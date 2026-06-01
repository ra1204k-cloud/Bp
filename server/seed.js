const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { connectDB, Season } = require('./db');

// Read the raw seasons.js file using regex to extract JSON
// Alternatively, since it's a module, it might be tricky to import directly in Node without babel, 
// so we'll just write a quick script that uses the data directly here for seeding.

const seasonsData = [
  {
    id: 1,
    title: "Season 1: The Chomu Fresher Arc",
    semester: "Semester 1",
    tagline: "AC vent gloating, water drinking debates, and train delays.",
    description: "Shreesh enters college with high vibes, but immediately gets locked in a battle of AC controls, existential train delays at Bareilly, and wri.",
    auraModifier: "+150 Aura",
    attendance: "85% (Before Do Not Disturb mode)",
    tags: ["Chomu"],
    episodes: [
      {
        id: "s1e1",
        title: "Ep 1: AC Wars & Water Debates",
        duration: "12m",
        thumbnail: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
        description: "Shreesh sits comfortably in the AC room gloating while Harsh sweats in the heat, initiating a legendary, highly philosophical debate about water drinking vs water bathing volumes.",
        caption: "Okay uncle ji. AC me thanda lag raha hai. Chomu.",
        dialogs: [
          { sender: "Shreesh", text: " to AC ki hawa kha raha hu. Tu garmi me baith chup chap." },
          { sender: "Harsh", text: "Bachon k hath me isilye phone nahi dete 😭" },
          { sender: "Shreesh", text: "Jitna Pani se tune abhi tak nahaya hai utna Pani me pee Chuka hu." },
          { sender: "Harsh", text: "Tu utna moot ta bhi hoga... Abhi tu baccha h." },
          { sender: "Shreesh", text: "Okay uncle ji 🫨🫨🫨 AC me thanda lag raha hai. Chomu." }
        ]
      },
      {
        id: "s1e2",
        title: "Ep 2: The 5-Hour Train Saga",
        duration: "15m",
        thumbnail: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80",
        description: "Traveling back to college is normal, unless it's Shreesh's train, which gets delayed by over 5 hours, triggering a complete existential crisis at Bareilly station at 2 AM.",
        caption: "Bareilly station, 31% battery, no powerbank, zero seat space, and career status: Khatam.",
        dialogs: [
          { sender: "Shreesh", text: "Bhai train 4:50 min late ho gayi. Mujhe lagta hai mera career khatam ho gaya aab." },
          { sender: "Harsh", text: "Bhai Where Is My Train pe 4:00 AM k bhi upar dikha rha h. Kaise?" },
          { sender: "Shreesh", text: "Kaha soounga? Yaha station par space bhi to honi chahiye. Phone is at 31%." },
          { sender: "Harsh", text: "Zameen par chaddar bicha k so ja... powerbank h?" },
          { sender: "Shreesh", text: "Me nahi soounga. Chomu, train 5 hours 10 min late ho gayi 😭" }
        ]
      },
      {
        id: "s1e3",
        title: "Ep 3: The A4 Paper Saviour",
        duration: "10m",
        thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
        description: "Shreesh realizes he has to write his Physics assignment on the delayed train and begs Harsh to bring 10 A4 papers to the railway station at 4 AM.",
        caption: "Harsh wrote 5 pages, squad wrote 3 pages. A4 pages saved the semester.",
        dialogs: [
          { sender: "Shreesh", text: "Tu kal assignment ki sath kuch A4 size page bhi lekar aa sakta hai kya? Mujhe train me hi karna padega." },
          { sender: "Harsh", text: "Bhai ankit aur sabne 3 page me bnaya h, aur maine 5 page me. Kitne chahiye?" },
          { sender: "Shreesh", text: "10 le aana yaar, ho jaega na 10 me?" },
          { sender: "Harsh", text: "Ok. Bhai par phone hi chalana par sona mat jabtak train na aa jaye." }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Season 2: The setprecision(2) Grinding",
    semester: "Semester 2",
    tagline: "High academic scores, C++ precision debates, and World Cup final crams.",
    description: "Shreesh hits a massive 9+ SGPA but refuses to share the exact double-decimal figure, triggering Harsh's C++ developer instincts. Meanwhile, cricket and assignments collide.",
    auraModifier: "+300 Aura",
    attendance: "70% (Match over lectures)",
    tags: ["C++", "SGPA", "World Cup Final"],
    episodes: [
      {
        id: "s2e1",
        title: "Ep 1: Double Precision GPA",
        duration: "18m",
        thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80",
        description: "Shreesh scores an awesome 9+ SGPA and 8+ CGPA. When Harsh asks for the exact score, Shreesh gives a vague reply, leading to a lesson in C++ syntax.",
        caption: "setprecision(2) means two decimal places, roomie! 🫡",
        dialogs: [
          { sender: "Harsh", text: "Jaldi bta cgpa aur sgpa dono. Aur setprecision(2) me btana." },
          { sender: "Shreesh", text: "9+ sgpa, 8+ cgpa. Ye kya hai?" },
          { sender: "Harsh", text: "C++ me hota h. setprecision(2) mtlb two decimal places. Mujhe pta tha tu 8 plus 9 plus likhoge 🫡" }
        ]
      },
      {
        id: "s2e2",
        title: "Ep 2: World Cup Final vs CS Assignment",
        duration: "14m",
        thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
        description: "During the intense India vs Australia 2023 World Cup final, Shreesh is stuck on a train begging for updates while Harsh plans to write CS assignments during advertisement breaks.",
        caption: "World Cup 4 years me ek baar aata hai! Match is more important.",
        dialogs: [
          { sender: "Shreesh", text: "Final bhi dekhna kyuki me to nahi dekh paunga 😭 Match is more important, end-sem baad me." },
          { sender: "Harsh", text: "Kal mai tv k samne baith jaunga aur breaks me CS ka assignment bhi likhunga 🥲" },
          { sender: "Harsh", text: "Bhai national anthem me train ki upper seat pr khada ho ja 😂" },
          { sender: "Shreesh", text: "👍👍👍" }
        ]
      },
      {
        id: "s2e3",
        title: "Ep 3: Haircut & Cute Aesthetics",
        duration: "16m",
        thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
        description: "Shreesh gets a fresh haircut, leading to a wave of aggressive aesthetic compliments from Harsh, who is still walking around like a 'chomu' with long hair.",
        caption: "Bhai tu haircut me itna cute lag rha h bhai, itna cute... 🤌",
        dialogs: [
          { sender: "Harsh", text: "Bhai tu naye hairstyle me itna cute lag rha h bhai, itna cute itna cute koi kaise ho skta h yar 🤌" },
          { sender: "Shreesh", text: "Bhai match me kuch bhi ho sakta hai... Faltu baat mat kar chomu." },
          { sender: "Harsh", text: "Lag rha h dimagi santulan kharab hote hue yaha shreesh pathak 😂" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Season 3: The Block-Unblock Chronicles",
    semester: "Semester 3",
    tagline: "Instagram unblock begging, UPI spams, and toxic roomie loops.",
    description: "The dramatic, endearing cycle of blocking and unblocking each other on social media, paired with weird 2 AM Paytm transactions.",
    auraModifier: "-50 Aura (Temporarily Blocked)",
    attendance: "60% (Banned on Instagram)",
    tags: ["Insta Block", "Pookie Roomie", "Paytm Spams"],
    episodes: [
      {
        id: "s3e1",
        title: "Ep 1: The Instagram Begging Saga",
        duration: "20m",
        thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
        description: "On Shreesh's birthday, Harsh writes a beautiful birthday wish, only to instantly follow it up with an extensive, aggressive spam session begging to be unblocked on Instagram.",
        caption: "Bhai insta se unblock krde plz plz plz plz...",
        dialogs: [
          { sender: "Harsh", text: "H B'day my dearest best friend & brother pookie roomie shreesh 🥳" },
          { sender: "Harsh", text: "Bhai insta se unblock krde plz plz plz plz plz plz plz plz plz plz plz plz plz plz plz plz plz plz plz plz plz..." },
          { sender: "Shreesh", text: "Are Bhai yaar me khud insta nahi chalta. Kal download karke kar dunga." },
          { sender: "Harsh", text: "Ok thanks bhai, unblock? 😂" }
        ]
      },
      {
        id: "s3e2",
        title: "Ep 2: Block Hi Sahi Hoon Mai",
        duration: "15m",
        thumbnail: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=600&q=80",
        description: "Harsh deletes a series of messages in fear of being blocked, only to find out Shreesh has unblocked him because 'he became a good boy'. Harsh immediately gets dramatic.",
        caption: "Unblocked roomie? Put me back in block custody, please! 😅",
        dialogs: [
          { sender: "Harsh", text: "Bhai sorry sorry. Mujhe laga block hu mai... unblocked status nahi pata tha." },
          { sender: "Shreesh", text: "Are tu aab shudar gaya tha tu mene unblock kar diya tujhe." },
          { sender: "Harsh", text: "Bhai phir se block hi kr de. Block hi sahi hu mai roomie 🙂" },
          { sender: "Shreesh", text: "Vo me dekh lunga, tu rehne de." }
        ]
      },
      {
        id: "s3e3",
        title: "Ep 3: The ₹10 UPI Spam",
        duration: "12m",
        thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
        description: "In the middle of the night at 2:00 AM, Harsh sends a series of exactly ₹10.00 Paytm transfers to Shreesh, leaving Shreesh completely baffled as Harsh deletes the context.",
        caption: "UPI spammed in multiples of ten. Peak late-night activities.",
        dialogs: [
          { sender: "Harsh", text: "You sent ₹10.00 to Shreesh" },
          { sender: "Harsh", text: "You sent ₹10.00 to Shreesh again" },
          { sender: "Harsh", text: "You sent ₹10.00 to Shreesh a third time" },
          { sender: "Shreesh", text: "Chomu delete kyu kara? Kya tha?" },
          { sender: "Harsh", text: "Rehne de bhai... Ankit ko keh de room me aaye." }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Season 4: Kala Sand & Secret Lectures",
    semester: "Semester 4",
    tagline: "Super secret lectures, OOP quiz cancellation, and gym bunks.",
    description: "Harsh attempts to share highly confidential lectures from 'Kala Sand', while the duo coordinates OOP quiz cheating schemes and infinite gym planning cycles.",
    auraModifier: "+500 Aura",
    attendance: "45% (Living on the edge)",
    tags: ["Kala Sand", "Gym Bunks", "OOP Quiz"],
    episodes: [
      {
        id: "s4e1",
        title: "Ep 1: Just Kala Sand Things",
        duration: "22m",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
        description: "Harsh shares a programming lecture under strict confidentiality rules because 'Kala Sand' prohibited sharing, only for Shreesh to point out it's publicly available on YouTube.",
        caption: "Don't share! (Publicly searchable anyway). Just kala sand things.",
        dialogs: [
          { sender: "Harsh", text: "Aur bhai sun ye lecture k bare me aur kisiko mat btana. Kale sand ne mana kiya tha." },
          { sender: "Shreesh", text: "Ye tu YouTube me available hai koi bhi dek sakta hai. Kuch nahi hota." },
          { sender: "Harsh", text: "yk just kala sand things... 🥴" }
        ]
      },
      {
        id: "s4e2",
        title: "Ep 2: OOP Cheating Cancelled",
        duration: "18m",
        thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
        description: "An elaborate system to cheat in the 3 PM OOP quiz is established, only for both to rejoice as the quiz gets cancelled at the very last second.",
        caption: "OOP Cheating setup: Successful. Quiz status: Cancelled! 🥳",
        dialogs: [
          { sender: "Harsh", text: "3 baje free hai? OOP ka quiz hai bhai. Cheating karani hai." },
          { sender: "Shreesh", text: "Okay l" },
          { sender: "Harsh", text: "Cancel ho gya quiz 🥳 Let's go to gym!" }
        ]
      },
      {
        id: "s4e3",
        title: "Ep 3: Gym Jaana To Bula Lena",
        duration: "16m",
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
        description: "The absolute, eternal loop of planning to go to the gym, questioning whether they will actually go, and postponing it for 'time pass' at 1 PM.",
        caption: "Gym timing: 1:00 PM (or never, depending on vibes).",
        dialogs: [
          { sender: "Harsh", text: "Gym jana to call/bula lena." },
          { sender: "Shreesh", text: "Aaj ka pata nahi ja bhi sakte hai nahi bhi." },
          { sender: "Harsh", text: "Kyu? Tune JS kitna dekh lya?" },
          { sender: "Shreesh", text: "Abhi utna hi dekha hai yaar. 1 bheje gym chalenge." },
          { sender: "Harsh", text: "Bhai phir tu kar kya rha hai? Padh le chomu!" },
          { sender: "Shreesh", text: "Kuch nahi bus time pass." }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Season 5: The Web Dev Grinding",
    semester: "Semester 5",
    tagline: "JavaScript grinds, SlickApp rating wars, and PKT class edits.",
    description: "From learning JS repository files to Harsh editing Shreesh's photos right in the front row of PKT's lecture hall, the hustle is real.",
    auraModifier: "+200 Aura",
    attendance: "50% (Strategic photo edits)",
    tags: ["JavaScript", "SlickApp", "PKT Class"],
    episodes: [
      {
        id: "s5e1",
        title: "Ep 1: JavaScript & CoderDost",
        duration: "14m",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80",
        description: "Harsh forces the CoderDost JS course onto Shreesh, urging him to finish JavaScript and React before the final exams so they can complete web dev before the year ends.",
        caption: "Saal khatm hone se pehle web dev khatm! 🚀",
        dialogs: [
          { sender: "Harsh", text: "Bhai tune js start kiya? Repo pe chapter wise questions practice krte rehna." },
          { sender: "Shreesh", text: "Abhi nahi kiya hai yaar, time nahi mil raha hai." },
          { sender: "Harsh", text: "React bhi karna hai endsem k pehle. Saal khatm hone se pehle web dev khatm 🥳" }
        ]
      },
      {
        id: "s5e2",
        title: "Ep 2: Front Row Photo Editing",
        duration: "20m",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
        description: "While sitting right at the front bench of Professor PKT's class under active surveillance, Harsh spends the time editing Shreesh's photos and admiring his own aesthetics.",
        caption: "Pkt ki class me aage baith kr photo edit kr rha hu 🤫",
        dialogs: [
          { sender: "Harsh", text: "Pkt ki class me aage baith kr photo edit kr rha hu 😅" },
          { sender: "Shreesh", text: "Chomu... Sir dekh lenge!" },
          { sender: "Harsh", text: "Bhai mai kitna cute lg rha hu na, bas lighting kharab h." }
        ]
      },
      {
        id: "s5e3",
        title: "Ep 3: SlickApp Rating Brutality",
        duration: "15m",
        thumbnail: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=600&q=80",
        description: "Harsh proudly shares his photo and SlickApp link demanding a rating out of 10. Shreesh responds with a mathematically brutal and precise scoring system.",
        caption: "Rate 1-10... 3.37/10. Harsh will try to improve! 😢",
        dialogs: [
          { sender: "Harsh", text: "Rate this pic, 1-10." },
          { sender: "Shreesh", text: "3.37/10." },
          { sender: "Harsh", text: "I'll try to improve & give my best 😢" }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Season 6: SSB & Room No 8 Reunion",
    semester: "Semester 6",
    tagline: "SSB interviews, Brothers' Day, and Room No 8 nostalgia.",
    description: "The final stretch of the college sitcom. Shreesh heads to the SSB interview, Harsh begs him to rejoin the squad groups, and they realize they are brothers for life.",
    auraModifier: "+999 Aura (Maxed Out)",
    attendance: "65% (SSB Bound)",
    tags: ["SSB", "Brothers Day", "Room No 8"],
    episodes: [
      {
        id: "s6e1",
        title: "Ep 1: SSB Interview Call",
        duration: "15m",
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
        description: "Shreesh prepares to leave for his Services Selection Board (SSB) interview, receiving nervous but deeply supportive wishes from Harsh, who is already missing their canteen runs.",
        caption: "All the best bhai ssb k lye! 👍👍",
        dialogs: [
          { sender: "Harsh", text: "All the best bhai ssb k lye 👍👍" },
          { sender: "Shreesh", text: "Thanks bhai." },
          { sender: "Harsh", text: "mess jana to mujhe bula lena, akele mat chale jana." }
        ]
      },
      {
        id: "s6e2",
        title: "Ep 2: Room No 8 Mutiny",
        duration: "18m",
        thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
        description: "Shreesh leaves the squad WhatsApp group in a fit of silence, causing immediate panic in Harsh, who begs him to return because their roomie status in Room 8 is sacred.",
        caption: "Shreesh group kyu chhod dya yar? Plz add ho ja.",
        dialogs: [
          { sender: "Harsh", text: "Shreesh group kyu chhod dya yar? Plz add ho ja." },
          { sender: "Shreesh", text: "Messages bohot aate hai." },
          { sender: "Harsh", text: "Bhai room no 8 me hi h tu abhi bhi, add ho ja chomu!" }
        ]
      },
      {
        id: "s6e3",
        title: "Ep 3: Brothers For Life",
        duration: "25m",
        thumbnail: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=600&q=80",
        description: "Celebrating Brothers' Day and realizing that underneath all the blocks, train delays, C++ precision arguments, and deleted chats, they are brothers for life.",
        caption: "Mai tum logo ko apna dost nahi, bhai manta hu! ❤️",
        dialogs: [
          { sender: "Harsh", text: "Happy brothers day bhai 😊" },
          { sender: "Shreesh", text: "Same to you." },
          { sender: "Harsh", text: "Bhai tm sab log mujhe apna dost nahi mante ho. Mai tm logon ko apna Bhai Manta hu." },
          { sender: "Shreesh", text: "Are roomie, tension mat le, forever stable! ❤️" }
        ]
      }
    ]
  }
];

const surpriseSeason = {
  id: 7,
  title: "Season 7: The Golden Archive",
  semester: "Secret Vault",
  tagline: "Happy Birthday Shreesh! The ultimate birthday celebration.",
  description: "An archive locked by the campus administration. Contains confidential folders of extreme emotional value, celebrating the birth of a true legend.",
  birthdayMessage: {
    title: "To My Best Friend & Brother, Shreesh Pathak 🎬",
    subtitle: "From a fresher looking for room numbers to a placement legend, we've lived the ultimate sitcom.",
    content: [
      "Happy Birthday, Shreesh! 🎂",
      "They say college is about gaining a degree, but looking back, the real prize was finding a brother like you. Through all the late-night tea sessions, the last-minute exam panics, the copy-pasted practical records, the spontaneous trips, and the intense block/unblock cycles, you've been the absolute main character of this journey.",
      "Whether it was waiting at Bareilly station at 2 AM with a 31% battery, writing assignments on A4 pages while the train shook, arguing about C++ setprecision(2) CGPAs, or sending ₹10 Paytm spams at midnight—we've created a lore that is absolutely unforgettable.",
      "I'm incredibly proud of who you are and so grateful to have you by my side. You've taught me that sometimes 'Match is more important' than minor details, and that no matter how many times we block each other, we're unblocked and united in room no 8.",
      "As you blow the candles today and we officially wrap up the 'College Seasons', remember that the sequel—the corporate/life arc—is going to have even higher production value, bigger plot twists, and infinite more aura.",
      "Happy Birthday, brother! Let's make this year an absolute blockbuster! 🚀❤️",
      "- Your Pookie Roomie, Harsh"
    ],
    wishes: [
      "✨ Infinite Aura (+9999 for life, setprecision(0))",
      "☕ Unlimited ginger tea & room no. 8 Maggi refills",
      "💻 C++ double precision setprecision(2) CGPAs",
      "🚗 Spontaneous road trips and favored Side Lower train seats that are never late",
      "🤝 A friendship that survives the block-unblock loops: Forever Stable"
    ]
  }
};

const seedDB = async () => {
  await connectDB();
  try {
    await Season.deleteMany({});
    
    // Insert regular seasons
    await Season.insertMany(seasonsData);
    
    // Insert surprise season
    const s7 = new Season(surpriseSeason);
    await s7.save();

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();

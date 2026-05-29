import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Wifi, Battery, Music, Folder, Map, Compass, Bell, X, Tv, Laptop, Sparkles, Award } from 'lucide-react';

export default function Desktop({ onOpenApp }) {
  const [activeNotificationIdx, setActiveNotificationIdx] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [alertText, setAlertText] = useState(null);
  const [bouncingApp, setBouncingApp] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Custom states for WhatsApp personalization
  const [showAbout, setShowAbout] = useState(false);

  const dockRef = useRef(null);
  const mouseX = useMotionValue(null);

  // Time ticker for top-right menu bar
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Personalized notifications array extracted from the WhatsApp chat!
  const notificationsList = [
    {
      title: "Varanasi Station Delay Alert",
      body: "Bareilly-Bhagalpur Express is late by 5 hours 10 mins. Career Status: Khatam 😭",
      type: "delay",
      color: "from-rose-500 to-red-600"
    },
    {
      title: "Paytm Cash Received",
      body: "Received ₹10.00 from Harsh. (Multiples spammed at 2 AM to settle a bet) 💸",
      type: "paytm",
      color: "from-blue-400 to-sky-500"
    },
    {
      title: "OOP Quiz Cancelled",
      body: "Cheating prep cancelled! OOP Quiz is officially postponed. Gym time: 1 PM sharp 🥳",
      type: "oop",
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Diwali Reply Speeedrun",
      body: "Harsh: Happy Diwali Siris! 🎇\nShreesh: H Diwali. (Aura modifier: +100)",
      type: "diwali",
      color: "from-amber-400 to-orange-500"
    }
  ];

  // Rotate notifications every 7 seconds to keep the desktop dynamic and nostalgic!
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setShowNotif(true);
      playSystemNotifSound();
    }, 2000);

    const interval = setInterval(() => {
      setShowNotif(false);
      setTimeout(() => {
        setActiveNotificationIdx((prev) => (prev + 1) % notificationsList.length);
        setShowNotif(true);
        playSystemNotifSound();
      }, 500);
    }, 9000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, []);

  const playSystemNotifSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  };

  const playLaunchSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5
      
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  };

  // Dock items data list (Customized with real WhatsApp stories!)
  const dockApps = [
    { id: 'finder', name: 'Finder', icon: Folder, color: 'from-blue-400 to-blue-600', text: '📂 Finder: All physical practical records locked! ShreeshFlix is the only active portal!' },
    { id: 'safari', name: 'Safari', icon: Compass, color: 'from-cyan-400 to-blue-500', text: '🌐 Safari: Crashed because Shreesh\'s aura is currently too high. Go study JS and React, chomu!' },
    { id: 'spotify', name: 'Spotify', icon: Music, color: 'from-emerald-400 to-green-600', text: '🎵 Spotify: Now playing "Shreesh\'s 3 AM Alarm" (Inspired by your alarm 👻).' },
    { id: 'maps', name: 'Maps', icon: Map, color: 'from-emerald-500 to-teal-600', text: '🗺️ Maps: Spontaneous road trips & delayed Bareilly trains only! Destination details locked inside ShreeshFlix.' },
    { id: 'shreeshflix', name: 'ShreeshFlix', icon: Tv, color: 'from-red-500 via-rose-600 to-red-700', isApp: true }
  ];

  const handleAppClick = (app) => {
    setBouncingApp(app.id);
    playLaunchSound();

    if (app.isApp) {
      setTimeout(() => {
        setBouncingApp(null);
        onOpenApp();
      }, 1800); // 1.8 seconds of bouncing action
    } else {
      setAlertText(app.text);
      setTimeout(() => {
        setBouncingApp(null);
      }, 600);
    }
  };

  // Magnification Hook Helper
  const DockIcon = ({ app }) => {
    const iconRef = useRef(null);
    const distance = useMotionValue(Infinity);

    useEffect(() => {
      const handleMouseMove = (e) => {
        if (!iconRef.current) return;
        const rect = iconRef.current.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        distance.set(Math.abs(e.clientX - iconCenterX));
      };

      const handleMouseLeave = () => {
        distance.set(Infinity);
      };

      window.addEventListener('mousemove', handleMouseMove);
      dockRef.current?.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        dockRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, []);

    const rawScale = useTransform(distance, [0, 100], [1.4, 1]);
    const springScale = useSpring(rawScale, { stiffness: 200, damping: 15 });

    const IconComponent = app.icon;
    const isBouncing = bouncingApp === app.id;

    return (
      <div className="relative group flex flex-col items-center select-none">
        <motion.div
          ref={iconRef}
          onClick={() => handleAppClick(app)}
          animate={isBouncing ? { y: [-24, 0, -18, 0, -8, 0] } : { y: 0 }}
          transition={app.isApp && isBouncing ? { repeat: Infinity, duration: 0.6 } : { duration: 0.5 }}
          style={{ width: 60, height: 60, scale: springScale }}
          className={`rounded-2xl bg-gradient-to-tr ${app.color} border border-white/20 flex items-center justify-center cursor-pointer shadow-lg active:scale-90 select-none relative`}
        >
          {app.isApp && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-neutral-900 animate-pulse flex items-center justify-center">
              <span className="text-[8px] text-white font-bold font-sans">1</span>
            </div>
          )}
          <IconComponent className="w-8 h-8 text-white stroke-[1.8]" />
        </motion.div>
        
        <span className="absolute bottom-20 scale-0 group-hover:scale-100 px-3 py-1 bg-neutral-900/90 border border-white/10 text-white font-medium text-xs rounded-lg whitespace-nowrap shadow-lg transition-transform pointer-events-none select-none z-50">
          {app.name}
        </span>
        
        {app.isApp && (
          <div className="w-1.5 h-1.5 rounded-full bg-white/70 absolute -bottom-3" />
        )}
      </div>
    );
  };

  const currentNotif = notificationsList[activeNotificationIdx];

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      {/* Anime Wallpaper Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/wallpaper.jpg"
          alt="wallpaper"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        {/* Lighter overlay so dock/icons stay visible */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Top Menu Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 px-6 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5 text-sm font-medium z-30">
        <div className="flex items-center gap-5">
          <span 
            onClick={() => setShowAbout(true)}
            className="text-sm font-semibold text-white/90 tracking-wide cursor-pointer hover:text-white transition-colors p-1"
            title="About Shreesh"
          >
            
          </span>
          <span className="text-white font-semibold cursor-default hover:text-white/80 transition-colors">Finder</span>
          <span className="text-white/70 cursor-default hover:text-white transition-colors">File</span>
          <span className="text-white/70 cursor-default hover:text-white transition-colors">Edit</span>
          <span className="text-white/70 cursor-default hover:text-white transition-colors">View</span>
          <span className="text-white/70 cursor-default hover:text-white transition-colors">Go</span>
          <span className="text-white/70 cursor-default hover:text-white transition-colors">Window</span>
          <span className="text-white/70 cursor-default hover:text-white transition-colors">Help</span>
        </div>
        <div className="flex items-center gap-4 text-white/80 cursor-default">
          <Wifi className="w-4 h-4 text-white/90" />
          <div className="flex items-center gap-1">
            <Battery className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
            <span className="text-xs">100%</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-indigo-200">Aura: +9999</span>
          <span className="text-xs hover:text-white transition-colors">{formatDate(currentTime)}</span>
          <span className="text-xs font-bold hover:text-white transition-colors">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Main Desktop Grid for Files / Apps */}
      <div className="absolute top-16 left-8 bottom-32 right-8 grid grid-flow-col auto-cols-[100px] grid-rows-[120px] gap-6 justify-start items-start z-10">
        
        {/* ShreeshFlix App Icon Double-Clickable Desktop Shortcut */}
        <motion.div
          onDoubleClick={() => handleAppClick(dockApps.find(a => a.id === 'shreeshflix'))}
          onClick={() => handleAppClick(dockApps.find(a => a.id === 'shreeshflix'))}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl border border-transparent hover:bg-white/10 hover:border-white/10 hover:backdrop-blur-sm transition-all duration-300 group cursor-pointer text-center w-24 relative select-none"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-500 via-rose-600 to-red-700 shadow-md flex items-center justify-center mb-2 group-hover:shadow-red-500/20 group-hover:shadow-lg relative">
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-neutral-900 animate-pulse flex items-center justify-center">
              <span className="text-[8px] text-white font-bold font-sans">1</span>
            </div>
            <Tv className="w-8 h-8 text-white" />
          </div>
          <span className="text-xs font-semibold text-white/90 drop-shadow-md select-none tracking-wide">
            ShreeshFlix
          </span>
          <span className="text-[8px] text-neutral-400 select-none">Double click</span>
        </motion.div>
      </div>

      {/* NEW: Yellow macOS-Style Glassmorphic Sticky Note Widget (Train Preparation Checklist) */}
      <motion.div
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="absolute bottom-32 left-8 w-[280px] p-5 rounded-2xl bg-amber-400/10 border border-amber-400/20 backdrop-blur-md text-amber-100 text-xs shadow-2xl z-10 flex flex-col gap-3 font-sans select-none"
      >
        <div className="flex items-center justify-between border-b border-amber-400/20 pb-2">
          <span className="font-bold tracking-wide text-amber-300 text-xs flex items-center gap-1.5 uppercase">
            📌 Shreesh's To-do List
          </span>
          <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">Room 8</span>
        </div>
        <ul className="flex flex-col gap-2 text-amber-200/90 font-medium">
          <li className="flex items-start gap-2">
            <span className="text-amber-400">✓</span>
            <span>Solve 10 leetcode daily</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">✓</span>
            <span>back flip mar kar sabka paani nikalna hai</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">✓</span>
            <span>Codeforce par grandmaster banna hai</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">✓</span>
            <span>Pahadan patani hai</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">✓</span>
            <span>100 pushups aur 100 situps</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">⚡</span>
            <span>Jaldi jaldi Harsh(chomu) ko do-teen baar block karna hai</span>
          </li>
        </ul>
        <div className="text-[10px] text-amber-400/60 italic text-right mt-1 font-serif border-t border-amber-400/10 pt-1.5">
          "Jitna pani se nahaya, utna pee gaya."
        </div>
      </motion.div>

      {/* Bottom Magnifying Dock */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <motion.div
          ref={dockRef}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(null)}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 15 }}
          className="h-20 px-4 rounded-3xl glassmorphism-dark flex items-end gap-5 pb-3 border border-white/10 shadow-2xl relative"
        >
          {dockApps.map((app) => (
            <DockIcon key={app.id} app={app} />
          ))}
        </motion.div>
      </div>

      {/* Top-Right Safari/Maps Warning Alerts */}
      <AnimatePresence>
        {alertText && (
          <motion.div
            initial={{ opacity: 0, x: 200, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 50 }}
            exit={{ opacity: 0, x: 200 }}
            className="absolute top-4 right-6 w-80 p-4 rounded-2xl glassmorphism border-rose-500/20 text-white z-40 shadow-2xl flex gap-3 items-start select-none"
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-widest">Portal Warning</h4>
              <p className="text-xs text-neutral-200 mt-1 leading-relaxed">{alertText}</p>
            </div>
            <button 
              onClick={() => setAlertText(null)}
              className="text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* macOS Cycling System Notification (Personalized) */}
      <AnimatePresence>
        {showNotif && currentNotif && (
          <motion.div
            initial={{ opacity: 0, x: 300, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 50 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute top-4 right-6 w-[340px] p-5 rounded-2xl glassmorphism-dark border-white/10 text-white z-30 shadow-2xl flex gap-4 items-start select-none"
          >
            <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr ${currentNotif.color} flex items-center justify-center text-white font-bold shadow shadow-indigo-500/20`}>
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold tracking-wide text-white">{currentNotif.title}</h4>
              <p className="text-xs text-neutral-300 mt-1 leading-normal font-medium whitespace-pre-line">
                {currentNotif.body}
              </p>
            </div>
            <button 
              onClick={() => setShowNotif(false)}
              className="text-white/40 hover:text-white cursor-pointer hover:bg-white/10 p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: Authentic 'About Shreesh' (About This Mac) Modal Window */}
      <AnimatePresence>
        {showAbout && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-[420px] rounded-2xl glassmorphism-dark border-white/15 overflow-hidden shadow-2xl relative"
            >
              {/* macOS Window Controls */}
              <div className="h-10 px-4 flex items-center justify-between border-b border-white/5 bg-white/5">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowAbout(false)}
                    className="w-3 h-3 rounded-full bg-rose-500 flex items-center justify-center text-[8px] text-rose-900 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-neutral-400 font-medium">About Shreesh</span>
                <div className="w-12" /> {/* spacer */}
              </div>

              {/* Info Area */}
              <div className="p-8 flex gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-xl relative shrink-0">
                  <Laptop className="w-12 h-12 text-white/95" />
                  <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
                
                <div className="flex flex-col gap-4 flex-grow">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">Shreesh Pathak</h3>
                    <p className="text-xs text-neutral-400">Model: Pookie Roomie (M1, 2020)</p>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 text-xs text-neutral-300 border-t border-white/5 pt-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Roll Number</span>
                      <span className="font-semibold text-white">230102063</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Hostel Address</span>
                      <span className="font-semibold text-white">Room No. 8 (Forever Stable)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">SGPA Score</span>
                      <span className="font-semibold text-emerald-400">setprecision(2) &lt;&lt; 9.0+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">CGPA Status</span>
                      <span className="font-semibold text-emerald-400">8.0+ (TBA Checked 🫡)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Fav Train Seat</span>
                      <span className="font-semibold text-white">Side Lower 🚂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Instagram Status</span>
                      <span className="font-semibold text-yellow-400">Unblocked (Finally!)</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-neutral-400">
                    <span>Aura Level: Infinite (+9999)</span>
                    <button 
                      onClick={() => {
                        setShowAbout(false);
                        alert("Ginger Tea Debt successfully split in ₹10 UPI increments! ☕");
                      }}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md font-medium text-white transition-all active:scale-95 cursor-pointer"
                    >
                      Settle Debt
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

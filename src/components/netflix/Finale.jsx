import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Award, Heart, RefreshCw, LogOut, ChevronRight, Music } from 'lucide-react';
import { surpriseSeason } from '../../data/seasons';

export default function Finale({ onBackToHome }) {
  const [candleLit, setCandleLit] = useState(true);
  const [celebrated, setCelebrated] = useState(false);
  const [activeTab, setActiveTab] = useState('letter'); // 'letter' -> 'scrapbook' -> 'outro'
  const [musicOn, setMusicOn] = useState(false);

  const { birthdayMessage } = surpriseSeason;

  // Custom synthesized acoustic piano celebration chime
  const playCelebrationChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const now = audioCtx.currentTime;

      // Sweeping major chord: C4 -> E4 -> G4 -> C5 -> E5 -> G5 -> C6
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gainNode.gain.setValueAtTime(0, now + idx * 0.07);
        gainNode.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.7);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.9);
      });
    } catch (e) {}
  };

  const triggerConfetti = () => {
    // 1. Initial center burst
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.6 }
    });

    // 2. Left side burst after 250ms
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.8 }
      });
    }, 250);

    // 3. Right side burst after 400ms
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.8 }
      });
    }, 400);
  };

  const handleBlowCandle = () => {
    setCandleLit(false);
    setCelebrated(true);
    playCelebrationChime();
    triggerConfetti();
  };

  // Scrapbook Memory Polaroid card items
  const scrapbookItems = [
    { id: 1, title: 'The Canteen Buffet', emoji: '🍜', caption: 'Survival on ₹40 Maggi splits.', rot: -5, tag: 'Sem 1' },
    { id: 2, title: '2 AM record copying', emoji: '✍️', caption: 'Legally became Amit for 10m.', rot: 4, tag: 'Sem 2' },
    { id: 3, title: 'Tea Tapri Syndicate', emoji: '☕', caption: 'Billion-dollar startups sketched.', rot: -3, tag: 'Sem 3' },
    { id: 4, title: 'Spontaneous Highway Rides', emoji: '🏍️', caption: 'Straight ahead till fuel ends.', rot: 6, tag: 'Sem 4' },
    { id: 5, title: 'Expert Resume Picasso', emoji: '💼', caption: 'Python advanced = print stars.', rot: -4, tag: 'Sem 5' },
    { id: 6, title: 'The Politician Formals', emoji: '👔', caption: 'Oversized suit, elections ready.', rot: 3, tag: 'Sem 6' }
  ];

  return (
    <div className="w-full h-full bg-[#0a0a0f] text-white overflow-y-auto font-sans relative">
      
      {/* Golden Particle Ambient Background */}
      <div className="absolute inset-0 ambient-bg z-0 opacity-40" />
      <div className="absolute top-[10%] left-[25%] w-[450px] h-[450px] bg-amber-500/10 rounded-full filter blur-[110px] animate-pulse" />
      
      {/* Top Header bar */}
      <div className="sticky top-0 h-16 px-6 md:px-12 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5 z-40 select-none">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-sm font-semibold active:scale-95 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit Vault</span>
        </button>
        <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>THE GOLDEN ARCHIVE UNLOCKED</span>
        </div>
      </div>

      {/* Main Interactive Celebration Area */}
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center gap-12 relative z-10 select-none">
        
        {/* Interactive Candle Blow Stage */}
        <AnimatePresence>
          {!celebrated ? (
            <motion.div
              key="celebration-stage"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full rounded-3xl glassmorphism border-amber-500/30 p-8 flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
              
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-black uppercase tracking-widest font-display animate-pulse">
                  System Final Event
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-black tracking-wide text-white mt-1">
                  Blow Shreesh's Birthday Candles! 🎂
                </h2>
                <p className="text-xs text-neutral-300 max-w-sm mt-1 leading-relaxed">
                  Click the glowing cake button below to extinguish the flame and ignite the ultimate birthday explosion!
                </p>
              </div>

              {/* Vector SVG Birthday Cake with Flicker Flame */}
              <div className="relative w-48 h-48 flex items-center justify-center py-4 cursor-pointer" onClick={handleBlowCandle}>
                
                {/* Cake Base Body */}
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  {/* Plate */}
                  <ellipse cx="50" cy="85" rx="45" ry="10" fill="#3f3f46" stroke="#52525b" strokeWidth="2" />
                  
                  {/* Layer 1 (Base chocolate) */}
                  <path d="M15,65 Q15,80 50,80 Q85,80 85,65 L85,45 Q85,60 50,60 Q15,60 15,45 Z" fill="#e50914" />
                  <rect x="15" y="45" width="70" height="20" fill="#e50914" />
                  <ellipse cx="50" cy="45" rx="35" ry="10" fill="#f43f5e" />

                  {/* Frosting drips */}
                  <path d="M15,45 Q20,53 25,45 Q30,53 35,45 Q40,53 45,45 Q50,53 55,45 Q60,53 65,45 Q70,53 75,45 Q80,53 85,45" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />

                  {/* Candle Stick */}
                  <rect x="47" y="15" width="6" height="20" fill="#fbbf24" rx="2" />
                  <rect x="47" y="20" width="6" height="4" fill="#3b82f6" />
                  <rect x="47" y="28" width="6" height="4" fill="#3b82f6" />
                </svg>

                {/* Flickering SVG Flame Candle */}
                {candleLit && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 0.95, 1], y: [0, -2, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="absolute top-9 left-[90px] w-5 h-8 bg-gradient-to-t from-red-500 via-orange-500 to-yellow-400 rounded-full filter blur-[1px] shadow-lg shadow-amber-500/50"
                  />
                )}
                
                {/* Visual Glow ring */}
                {candleLit && (
                  <div className="absolute top-5 left-[78px] w-12 h-12 bg-yellow-500/10 rounded-full filter blur-md animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
                )}
              </div>

              <button
                onClick={handleBlowCandle}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-rose-600 hover:from-amber-300 hover:to-rose-500 text-white font-extrabold px-8 py-3 rounded-full active:scale-95 transition-all shadow-lg hover:shadow-rose-500/20 cursor-pointer text-sm uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Blow the Candle!</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="post-celebrated-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center gap-8"
            >
              {/* Tab Nav buttons */}
              <div className="flex bg-neutral-900 border border-white/5 rounded-full p-1.5 w-full max-w-md select-none justify-between">
                <button
                  onClick={() => setActiveTab('letter')}
                  className={`flex-1 text-center py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'letter' 
                      ? "bg-amber-500 text-black shadow-md" 
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Emotional Letter
                </button>
                <button
                  onClick={() => setActiveTab('scrapbook')}
                  className={`flex-1 text-center py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'scrapbook' 
                      ? "bg-amber-500 text-black shadow-md" 
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  3D Scrapbook
                </button>
                <button
                  onClick={() => setActiveTab('outro')}
                  className={`flex-1 text-center py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'outro' 
                      ? "bg-amber-500 text-black shadow-md" 
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  To Be Continued...
                </button>
              </div>

              {/* Tab Content rendering */}
              <AnimatePresence mode="wait">
                
                {/* 1. EMOTIONAL BIRTHDAY LETTER */}
                {activeTab === 'letter' && (
                  <motion.div
                    key="tab-letter"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full rounded-3xl glassmorphism border-amber-500/20 px-8 py-10 md:p-12 text-left flex flex-col gap-6 shadow-2xl relative"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-bold select-none">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>LEGEND DECREE</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest font-display">
                        Official Birthday Montage
                      </span>
                      <h3 className="text-3xl font-display font-black text-white tracking-wide leading-tight">
                        {birthdayMessage.title}
                      </h3>
                      <p className="text-xs text-neutral-300 font-medium italic">
                        {birthdayMessage.subtitle}
                      </p>
                    </div>

                    {/* Letter Content body */}
                    <div className="flex flex-col gap-4 border-t border-b border-white/5 py-6">
                      {birthdayMessage.content.map((p, idx) => (
                        <p key={idx} className="text-sm text-neutral-200 leading-relaxed font-medium">
                          {p}
                        </p>
                      ))}
                    </div>

                    {/* Birthday Wishes listing */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                        My Special Birthday Wishes for You:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                        {birthdayMessage.wishes.map((w, idx) => (
                          <li key={idx} className="flex gap-2 items-center text-xs text-neutral-200 bg-white/5 border border-white/5 rounded-xl p-3 shadow shadow-black/10">
                            <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Relight button just in case! */}
                    <button
                      onClick={triggerConfetti}
                      className="mt-6 self-center flex items-center gap-2 bg-neutral-900 border border-white/5 text-amber-400 px-6 py-2.5 rounded-full hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer font-bold text-xs"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Re-explode Confetti!</span>
                    </button>
                  </motion.div>
                )}

                {/* 2. 3D MEMORY SCRAPBOOK */}
                {activeTab === 'scrapbook' && (
                  <motion.div
                    key="tab-scrapbook"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full flex flex-col gap-6"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-display font-black text-white tracking-wide">
                        The College Scrapbook 📸
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        Hover over these polaroids to align them in active focus. Click to shake or trigger nostalgic memories!
                      </p>
                    </div>

                    {/* Polaroid Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      {scrapbookItems.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                          style={{ rotate: item.rot }}
                          className="rounded-xl bg-white p-4 pb-6 shadow-2xl flex flex-col gap-3 cursor-pointer text-black transition-all border border-neutral-300 relative group"
                        >
                          {/* Photo Frame */}
                          <div className="h-32 bg-neutral-100 rounded-lg flex flex-col items-center justify-center text-5xl relative overflow-hidden">
                            <span>{item.emoji}</span>
                            <div className="absolute inset-0 bg-neutral-900/5 group-hover:bg-transparent transition-colors" />
                            <span className="absolute top-2 left-2 bg-neutral-950 text-white font-bold text-[8px] uppercase px-1.5 py-0.5 rounded tracking-wide font-sans">
                              {item.tag}
                            </span>
                          </div>

                          {/* Captions */}
                          <div className="text-left mt-1 select-none">
                            <h4 className="font-display font-bold text-xs text-neutral-900 leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-neutral-500 font-medium italic mt-1 font-serif">
                              "{item.caption}"
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 3. TO BE CONTINUED OUTRO CREDITS */}
                {activeTab === 'outro' && (
                  <motion.div
                    key="tab-outro"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-xl mx-auto rounded-3xl bg-neutral-950 px-8 py-12 text-center flex flex-col items-center gap-6 shadow-2xl border border-neutral-900 relative"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2">
                      <Heart className="w-6 h-6 fill-current animate-pulse" />
                    </div>

                    <h3 className="text-glow-red font-cinzel font-black text-2xl tracking-widest text-red-600 uppercase">
                      ShreeshFlix Outro
                    </h3>

                    {/* Scrolling Outro text credits */}
                    <div className="flex flex-col gap-6 text-neutral-300 text-sm leading-relaxed max-w-sm mt-2">
                      <p className="font-medium font-display">
                        "The college chapters may have officially concluded, but the sequel is going to have a massive budget upgrade, insane cinematic twists, and infinite lore."
                      </p>
                      
                      <div className="flex flex-col gap-1 text-xs border-t border-white/5 pt-4 mt-2">
                        <span className="text-neutral-500 font-bold uppercase tracking-widest">Main Protagonist</span>
                        <span className="text-white font-bold">Shreesh Pathak</span>
                      </div>

                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-neutral-500 font-bold uppercase tracking-widest">Story Director</span>
                        <span className="text-white font-bold">His Best Friend</span>
                      </div>

                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-neutral-500 font-bold uppercase tracking-widest">Aura Level</span>
                        <span className="text-emerald-400 font-black tracking-widest animate-pulse">OVER 9000! 👑</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-cinzel font-bold text-white tracking-widest mt-6 animate-pulse select-none">
                      TO BE CONTINUED...
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

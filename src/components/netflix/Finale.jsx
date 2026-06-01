import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, LogOut } from 'lucide-react';
import { surpriseSeason } from '../../data/seasons';

export default function Finale({ onBackToHome }) {
  const [candleLit, setCandleLit] = useState(true);
  const [celebrated, setCelebrated] = useState(false);

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
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.8 }
      });
    }, 250);

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
              {/* Glassmorphic Birthday Message Card */}
              <div className="w-full rounded-3xl glassmorphism border-amber-500/20 px-8 py-10 md:p-12 text-left flex flex-col gap-6 shadow-2xl relative">
                
                {/* Message Content body */}
                <div className="flex flex-col gap-4 py-4">
                  {birthdayMessage.content.map((p, idx) => (
                    <p key={idx} className="text-sm text-neutral-200 leading-relaxed font-medium">
                      {p}
                    </p>
                  ))}
                </div>


                {/* Re-explode button */}
                <button
                  onClick={triggerConfetti}
                  className="mt-6 self-center flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-rose-600/20 border border-amber-500/30 text-amber-400 px-6 py-2.5 rounded-full hover:from-amber-400/35 hover:to-rose-600/35 active:scale-95 transition-all cursor-pointer font-bold text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-explode Confetti!</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

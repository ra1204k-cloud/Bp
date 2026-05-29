import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BootScreen({ onComplete }) {
  const [powerState, setPowerState] = useState('off'); // 'off' -> 'booting' -> 'loaded'
  const [progress, setProgress] = useState(0);

  // Play a beautiful, warm C-major/G-major chord simulating the iconic macOS Startup Chime
  const playMacChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const now = audioCtx.currentTime;

      // Warm frequencies: C2, G2, C3, E3, G3, C4, E4
      const freqs = [65.41, 98.00, 130.81, 164.81, 196.00, 261.63, 329.63];
      
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        // Mix triangle and sine waves for a smooth, organ-like resonant tone
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        
        // Add subtle pitch detune for analog warmth
        osc.detune.setValueAtTime((Math.random() - 0.5) * 10, now);

        // Envelope: Quick swell, long natural decay
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2 / freqs.length, now + 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 3.8);
      });
    } catch (err) {
      console.warn("Audio Context failed to initialize:", err);
    }
  };

  const handlePowerOn = () => {
    setPowerState('booting');
    playMacChime();
  };

  // Simulate progress bar filling
  useEffect(() => {
    if (powerState !== 'booting') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPowerState('loaded');
            setTimeout(onComplete, 800); // Allow fadeout animation
          }, 500);
          return 100;
        }
        // Random incremental steps for realism
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [powerState, onComplete]);

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative select-none z-50">
      <AnimatePresence mode="wait">
        {powerState === 'off' && (
          <motion.div
            key="power-btn"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Pulsing Power Ring */}
            <button
              onClick={handlePowerOn}
              className="w-24 h-24 rounded-full border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95 group cursor-pointer"
            >
              <svg 
                className="w-10 h-10 text-neutral-400 group-hover:text-white transition-colors duration-300"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
            </button>
            <div className="text-center">
              <h2 className="text-neutral-300 font-display font-medium text-lg tracking-wide">MacBook Air M1</h2>
              <p className="text-neutral-500 text-sm mt-1">Click to Power On and Boot ShreeshFlix</p>
            </div>
          </motion.div>
        )}

        {powerState === 'booting' && (
          <motion.div
            key="boot-sequence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-20"
          >
            {/* Centered White Apple Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <img
                src="/apple_logo.jpg"
                alt="Apple"
                className="w-24 h-24 select-none"
                draggable={false}
              />
            </motion.div>

            {/* Apple Sonoma-style Progress Loading Indicator */}
            <div className="flex flex-col items-center gap-4 w-64">
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-neutral-900">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <motion.span 
                className="text-neutral-400 font-sans text-xs tracking-widest uppercase font-medium animate-pulse"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              >
                Starting Up...
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetflixIntro({ onComplete }) {
  const [stage, setStage] = useState('init'); // 'init' -> 'tudum' -> 'flash' -> 'zoom' -> 'done'

  // Play synthesized Netflix TUDUM sound effect
  const playTudum = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const now = audioCtx.currentTime;

      // Tap 1: Low-frequency bass thud (80 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(80, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.6, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Tap 2: Multi-voice heavy bass (85 Hz) + Warm sweeps (after 120ms delay)
      setTimeout(() => {
        const tNow = audioCtx.currentTime;
        
        // Deep sub bass
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(85, tNow);
        gain2.gain.setValueAtTime(0, tNow);
        gain2.gain.linearRampToValueAtTime(0.7, tNow + 0.03);
        gain2.gain.exponentialRampToValueAtTime(0.001, tNow + 0.8);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(tNow);
        osc2.stop(tNow + 0.9);

        // A-major bright sweeping strings (creating the cinematic metallic TUDUM resolution)
        const freqs = [164.81, 220.00, 277.18, 329.63, 440.00, 554.37, 659.25]; // E3, A3, C#4, E4, A4, C#5, E5
        freqs.forEach((freq, idx) => {
          const oscChord = audioCtx.createOscillator();
          const gainChord = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();

          oscChord.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
          oscChord.frequency.setValueAtTime(freq, tNow);
          oscChord.detune.setValueAtTime((Math.random() - 0.5) * 20, tNow); // Detune for organic chorus

          // Dynamic filter sweep
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(100, tNow);
          filter.frequency.exponentialRampToValueAtTime(1400, tNow + 0.2);
          filter.frequency.exponentialRampToValueAtTime(150, tNow + 1.4);

          gainChord.gain.setValueAtTime(0, tNow);
          gainChord.gain.linearRampToValueAtTime(0.3 / freqs.length, tNow + 0.08);
          gainChord.gain.exponentialRampToValueAtTime(0.0001, tNow + 1.9);

          oscChord.connect(filter);
          filter.connect(gainChord);
          gainChord.connect(audioCtx.destination);

          oscChord.start(tNow);
          oscChord.stop(tNow + 2.0);
        });
      }, 120);
    } catch (err) {}
  };

  useEffect(() => {
    // 1. Instantly trigger TUDUM sound and render red screen glow
    setStage('tudum');
    playTudum();

    // 2. Trigger rapid background memory flash sequence in 0.4s
    const flashTimer = setTimeout(() => {
      setStage('flash');
    }, 400);

    // 3. Trigger zooming of SHREESHFLIX lettering into camera lens in 1.4s
    const zoomTimer = setTimeout(() => {
      setStage('zoom');
    }, 1400);

    // 4. Complete intro in 2.6s, loading the Home page
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(zoomTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // High-contrast tag lists for subliminal memory grid overlay
  const flashMemories = [
    'TEA TAPRI', 'RECORD BOOKS', 'BUNKING', 'VALORANT 3AM', 'ROAD TRIPS',
    'EXAM GRIND', 'MOCK GRIT', 'AURAMAX', 'SEMESTER LORE', 'CAFFEINE DRIP'
  ];

  return (
    <div className="w-full h-full bg-[#141414] flex items-center justify-center relative overflow-hidden z-50">
      {/* Subliminal Grid Memory Flash Stage */}
      <AnimatePresence>
        {stage === 'flash' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 grid grid-cols-5 grid-rows-2 gap-4 p-8 pointer-events-none select-none z-0"
          >
            {flashMemories.map((text, idx) => (
              <div 
                key={idx} 
                className="rounded-xl border border-white/40 bg-white/5 flex items-center justify-center p-6 text-center select-none"
              >
                <span className="font-display font-black text-2xl tracking-widest text-white animate-pulse">
                  {text}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Red Laser Ambient Glow Background */}
      <motion.div
        animate={
          stage === 'zoom' 
            ? { scale: [1, 2], opacity: [0.3, 0] } 
            : { opacity: [0.1, 0.4, 0.2] }
        }
        transition={{ duration: 1.5 }}
        className="absolute w-[800px] h-[300px] rounded-full bg-red-600/30 filter blur-[150px] z-10 pointer-events-none select-none"
      />

      {/* Cinematic Logo Animation */}
      <div className="z-20 text-center select-none">
        <motion.h1
          fontFamily="Cinzel"
          initial={{ scale: 0.7, opacity: 0, letterSpacing: '15px' }}
          animate={
            stage === 'zoom'
              ? { scale: 35, opacity: 0, letterSpacing: '35px', filter: 'blur(10px)' }
              : { scale: 1, opacity: 1, letterSpacing: '8px' }
          }
          transition={
            stage === 'zoom'
              ? { duration: 1.2, ease: [0.9, 0.03, 0.69, 0.22] }
              : { duration: 0.8, type: 'spring', damping: 10 }
          }
          className="text-glow-red text-6xl md:text-8xl font-cinzel font-black tracking-widest text-red-600 uppercase select-none"
        >
          ShreeshFlix
        </motion.h1>
      </div>

      {/* Netflix Cinematic scan line laser overlay */}
      <motion.div 
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent pointer-events-none z-30 select-none" 
      />
    </div>
  );
}

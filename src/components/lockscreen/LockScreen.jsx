import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Battery, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  
  // Custom states for macOS Sleep-to-Unlock flow and Windows key fixes
  const [isPasswordActive, setIsPasswordActive] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const inputRef = useRef(null);

  // Detect Operating System on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgent) {
      setIsWindows(navigator.userAgent.toLowerCase().includes('win'));
    }
  }, []);

  // Sync date and clock time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Focus input automatically whenever password card becomes active
  useEffect(() => {
    if (isPasswordActive) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isPasswordActive]);

  // Global key interceptor to solve Windows Alt key and handle sleep-unlock toggles
  useEffect(() => {
    const handleKeyDown = (e) => {
      // CRITICAL FIX: Intercept Alt keydown on Windows and prevent browser menu focus steal
      if (e.key === 'Alt') {
        e.preventDefault();
      }

      if (!isPasswordActive) {
        // In Idle State: Any key down reveals the login input field (except Esc/F keys)
        if (e.key !== 'Escape' && e.key !== 'F5' && e.key !== 'F11' && e.key !== 'F12') {
          e.preventDefault();
          setIsPasswordActive(true);
        }
      } else {
        // In Active State: 
        if (e.key === 'Escape') {
          // Pressing Escape slides the login input away and goes back to sleep
          setIsPasswordActive(false);
          setPassword('');
          setError(false);
          setHintVisible(false);
        } else if (document.activeElement !== inputRef.current) {
          // If user clicked away, press any character or Alt to focus the input field again
          if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Alt') {
            inputRef.current?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPasswordActive]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Correct password is Shreesh's DOB: 02062006 (June 2, 2006)
    if (password === '02062006') {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setShake((prev) => prev + 1); // Trigger shake keyframes
      setPassword('');
      setHintVisible(true);
      playSystemErrorSound();
    }
  };

  // Synthesizes a low retro error warning beep on wrong key
  const playSystemErrorSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const now = audioCtx.currentTime;
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  };

  // Auto-types the birthday password for lightning-fast testing!
  const triggerBypass = (e) => {
    e.stopPropagation(); // Avoid triggering sleep toggles on container
    setIsPasswordActive(true);
    let index = 0;
    const pass = '02062006';
    setPassword('');
    const typing = setInterval(() => {
      if (index < pass.length) {
        setPassword((prev) => prev + pass[index]);
        index++;
      } else {
        clearInterval(typing);
        setTimeout(() => {
          onUnlock();
        }, 300);
      }
    }, 100);
  };

  const handleScreenClick = () => {
    if (!isPasswordActive) {
      setIsPasswordActive(true);
    }
  };

  return (
    <div 
      onClick={handleScreenClick}
      className="w-full h-full relative overflow-hidden select-none font-sans text-white cursor-default"
    >
      {/* Anime Wallpaper Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/wallpaper.jpg"
          alt="wallpaper"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        {/* Dark overlay to keep UI elements readable */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Top System Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 px-6 flex items-center justify-between bg-black/10 backdrop-blur-sm border-b border-white/5 text-sm font-medium z-40">
        <div className="flex items-center gap-1.5 cursor-default hover:opacity-80 transition-opacity">
          <span className="text-sm font-semibold tracking-wide"></span>
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/90">Shreesh OS</span>
        </div>
        <div className="flex items-center gap-4 cursor-default">
          <Wifi className="w-4 h-4 text-white/90" />
          <div className="flex items-center gap-1.5 group relative">
            <Battery className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
            <span className="text-xs text-white/80">100%</span>
            <span className="absolute top-8 right-0 text-[10px] whitespace-nowrap bg-neutral-900/90 border border-white/10 px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-50">
              ⚡ Fully Charged on Ginger Tea
            </span>
          </div>
          <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded text-indigo-200">Aura: +9999</span>
        </div>
      </div>

      {/* Large Sonoma Digital Clock & Date (Animates up when entering password) */}
      <motion.div 
        animate={{ 
          y: isPasswordActive ? -40 : 0,
          scale: isPasswordActive ? 0.75 : 1
        }}
        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
        className="absolute top-[16%] left-0 right-0 flex flex-col items-center justify-center text-center z-30"
      >
        <h1 className="text-8xl font-display font-extrabold tracking-tighter text-white/95">
          {formatTime(time)}
        </h1>
        <p className="text-lg font-medium text-indigo-100 tracking-wide mt-2">
          {formatDate(time)}
        </p>
      </motion.div>

      {/* Center macOS User Card container */}
      <div className="absolute inset-0 flex items-center justify-center pt-40 z-30 pointer-events-none">
        <motion.div
          key="lock-card"
          animate={{ 
            y: isPasswordActive ? 0 : 40,
            x: shake ? [-10, 10, -10, 10, -5, 5, 0] : 0
          }}
          transition={{ 
            y: { type: 'spring', stiffness: 90, damping: 15 },
            x: { duration: 0.4 }
          }}
          onClick={(e) => e.stopPropagation()} // Stop click-to-activate trigger on container
          className={`w-[350px] px-8 py-10 rounded-3xl flex flex-col items-center text-center relative pointer-events-auto transition-all duration-500 ${
            isPasswordActive ? 'glassmorphism' : 'bg-transparent border-transparent shadow-none'
          }`}
        >
          {/* Glowing Avatar Frame */}
          <div className="relative w-28 h-28 rounded-full flex items-center justify-center p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 shadow-xl mb-4 group cursor-pointer">
            <div className="w-full h-full rounded-full bg-neutral-900 flex flex-col items-center justify-center relative overflow-hidden">
              <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-bounce z-10" />
              <img 
                src="/shreesh_avatar.png" 
                alt="Shreesh Pathak" 
                className="w-full h-full object-cover select-none"
                style={{ objectPosition: '70% 10%', transform: 'scale(1.0)', transformOrigin: 'center top' }}
              />
            </div>
            <div className="absolute inset-0 rounded-full border border-white/20 scale-105 group-hover:scale-110 transition-transform duration-500 opacity-60" />
          </div>

          <h2 className="text-xl font-display font-semibold tracking-wide text-white">
            Shreesh Pathak
          </h2>
          <span className="text-xs text-white/40 font-medium mb-5">
            Roll No: 230102063
          </span>

          {/* Conditional rendering of Input form vs Pulsing Click Guide */}
          <div className="w-full h-[120px] flex flex-col items-center justify-start overflow-visible relative">
            <AnimatePresence mode="wait">
              {!isPasswordActive ? (
                <motion.div
                  key="click-guide"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium text-indigo-200 tracking-wide mt-2 animate-pulse cursor-pointer"
                  onClick={() => setIsPasswordActive(true)}
                >
                  Press {isWindows ? 'Alt' : 'Option (⌥)'} key or click to unlock
                </motion.div>
              ) : (
                <motion.div
                  key="password-input-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  className="w-full flex flex-col items-center"
                >
                  <form onSubmit={handleLoginSubmit} className="w-full flex flex-col items-center relative">
                    <div className="w-full relative flex items-center bg-black/25 hover:bg-black/35 focus-within:bg-black/45 rounded-full border border-white/10 focus-within:border-indigo-500/50 transition-all duration-300">
                      <input
                        ref={inputRef}
                        type="password"
                        placeholder="Enter DOB (DDMMYYYY)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-5 pr-12 py-3 bg-transparent border-none text-white placeholder-white/30 text-sm focus:outline-none tracking-widest text-center"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 active:scale-95 flex items-center justify-center transition-all cursor-pointer group"
                      >
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </form>

                  {/* Wrong Password Hint Overlay */}
                  <div className="h-10 mt-3 flex items-center justify-center overflow-visible">
                    {hintVisible && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-1 text-[11px] text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20"
                      >
                        <span>Wrong DOB! Hint: June 2, 2006 (02062006), chomu.</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sleep / Restart / Cancel footer (Only shows when active) */}
          <motion.div 
            animate={{ opacity: isPasswordActive ? 0.5 : 0 }}
            className={`mt-4 flex gap-5 text-xs text-white/50 select-none ${isPasswordActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => alert("MacBook is sleeping like Shreesh during placement training.")}>Sleep</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => alert("Restarting... loading C++ libraries.")}>Restart</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => { setIsPasswordActive(false); setPassword(''); setHintVisible(false); }}>Cancel</span>
          </motion.div>

          {/* Golden Dev Easter Egg Bypass Button */}
          <button
            onClick={triggerBypass}
            title="Fast Tester Bypass Chime"
            className="absolute top-3 right-3 w-8 h-8 rounded-lg border border-white/5 hover:bg-white/10 hover:border-amber-500/40 flex items-center justify-center active:scale-95 transition-all cursor-pointer text-white/20 hover:text-amber-400 group"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Screen Bottom Notice (Fades out when typing) */}
      <motion.div 
        animate={{ opacity: isPasswordActive ? 0 : 0.4 }}
        className="absolute bottom-6 left-0 right-0 text-center text-xs text-white z-30 select-none pointer-events-none"
      >
        <span>Press {isWindows ? 'Alt' : 'Option (⌥)'} key or enter DOB (02062006) to unlock your memory vault.</span>
      </motion.div>
    </div>
  );
}

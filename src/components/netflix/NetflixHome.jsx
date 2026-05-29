import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Sparkles, Award, Lock, Unlock, Eye, HelpCircle } from 'lucide-react';
import { seasonsData } from '../../data/seasons';

export default function NetflixHome({ 
  watchedSeasons = [], 
  onSelectSeason, 
  onUnlockSecretSeason,
  isSecretUnlocked = false,
  onAutoUnlockAll // Cheat code to instantly complete everything!
}) {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [hoveredSeason, setHoveredSeason] = useState(null);

  // Check if seasons 1 to 6 are fully watched to unlock vault
  const allSeasonsCompleted = seasonsData.every(s => watchedSeasons.includes(s.id));

  // Auto trigger secret season selection if unlocked
  const handleVaultClick = () => {
    if (allSeasonsCompleted || isSecretUnlocked) {
      onUnlockSecretSeason();
    } else {
      // Play system alert sound or shake
      playVaultLockSound();
      alert("🔒 Access Restricted: You must explore all 6 seasons (Semesters 1-6) to unlock the Golden Archive!");
    }
  };

  const playVaultLockSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.setValueAtTime(80, now + 0.1);
      
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  };

  return (
    <div className="w-full h-full bg-[#141414] text-white overflow-y-auto overflow-x-hidden font-sans relative">
      
      {/* Top Navbar */}
      <div className="sticky top-0 h-16 px-6 md:px-12 flex items-center justify-between bg-gradient-to-b from-[#141414] to-transparent z-40">
        <div className="flex items-center gap-8">
          <h1 className="text-glow-red text-2xl md:text-3xl font-cinzel font-black tracking-widest text-red-600 uppercase cursor-pointer select-none">
            ShreeshFlix
          </h1>
          <nav className="hidden md:flex items-center gap-5 text-sm text-neutral-300 font-medium select-none">
            <span className="text-white font-semibold cursor-pointer">Home</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setShowStatsModal(true)}>Aura Stats</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={handleVaultClick}>
              {allSeasonsCompleted || isSecretUnlocked ? "🔓 Secret Vault (Open)" : "🔒 Secret Vault (Locked)"}
            </span>
          </nav>
        </div>
        
        {/* Right side utilities */}
        <div className="flex items-center gap-4 select-none">

          <div 
            onClick={() => setShowStatsModal(true)}
            className="w-8 h-8 rounded bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white transition-all shadow-md font-bold font-display"
          >
            S
          </div>
        </div>
      </div>

      {/* Cinematic Hero Banner */}
      <div className="relative w-full h-[55vh] md:h-[65vh] flex items-center px-6 md:px-12 overflow-hidden bg-black">
        {/* Background Overlay image with dramatic radial overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 z-0 select-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80')` }}
        />
        {/* Rich Netflix black gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-10" />

        {/* Hero Content */}
        <div className="max-w-2xl z-20 flex flex-col gap-4 pt-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest bg-red-600 px-2 py-0.5 rounded shadow-md">
              A ShreeshFlix Original
            </span>
            <span className="text-xs text-emerald-400 font-bold">99% Match</span>
            <span className="text-xs text-neutral-400 font-medium">2026</span>
            <span className="text-[10px] border border-white/40 px-1.5 py-0.2 rounded font-bold text-neutral-300">
              U/A 18+
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white drop-shadow-md">
            The College Life of Shreesh Pathak
          </h1>

          <p className="text-sm md:text-lg italic font-medium text-neutral-300 drop-shadow-sm leading-relaxed">
            "Academics were completely optional. Aura, however, was absolutely mandatory."
          </p>

          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-xl">
            6 semesters. Infinite late-night tea cups. Copy-pasted lab codes, spontaneous highway rides, and the legendary silver-tongue pitches that conquered college examiners. Based on highly questionable true events.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onSelectSeason(1)}
              className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-lg font-bold transition-all active:scale-95 cursor-pointer shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play Season 1</span>
            </button>
            <button
              onClick={() => setShowStatsModal(true)}
              className="flex items-center gap-2 bg-neutral-600/60 hover:bg-neutral-600/80 text-white border border-white/10 px-6 py-2.5 rounded-lg font-bold transition-all active:scale-95 cursor-pointer shadow-lg"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Season Selection Row Grid */}
      <div className="px-6 md:px-12 py-10 z-20 relative mt-6 md:mt-10 flex flex-col gap-4 select-none">
        <h3 className="text-xl md:text-2xl font-display font-bold tracking-wide">
          Semesters Catalog (Select a Season)
        </h3>
        
        <div className="netflix-scroll-row select-none">
          {seasonsData.map((season) => {
            const isWatched = watchedSeasons.includes(season.id);
            return (
              <motion.div
                key={season.id}
                onMouseEnter={() => setHoveredSeason(season.id)}
                onMouseLeave={() => setHoveredSeason(null)}
                onClick={() => onSelectSeason(season.id)}
                className="w-56 md:w-64 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shadow-xl cursor-pointer hover:border-red-500/40 relative select-none"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                {/* Poster Image Frame */}
                <div className="w-full h-36 relative overflow-hidden bg-neutral-800">
                  <img 
                    src={season.episodes[0].thumbnail} 
                    alt={season.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  {/* Watched Episode Indicator badge */}
                  {isWatched && (
                    <div className="absolute top-2 left-2 bg-red-600/90 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Eye className="w-2.5 h-2.5" />
                      <span>EXPLORED</span>
                    </div>
                  )}
                  {/* Duration count overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {season.episodes.length} Episodes
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                </div>

                {/* Season Metadata Details */}
                <div className="p-4 flex flex-col gap-2">
                  <span className="text-[10px] font-extrabold uppercase text-red-500 tracking-wider font-display">
                    {season.semester}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-wide truncate">
                    {season.title.split(': ')[1]}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {season.tagline}
                  </p>
                  
                  {/* Aura score tag */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
                    <span className="text-emerald-400 font-bold">{season.auraModifier}</span>
                    <span className="text-neutral-500 font-medium">Att: {season.attendance.split(' ')[0]}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Locked Surprise Season 7 Vault Card */}
          <motion.div
            onClick={handleVaultClick}
            className={`w-56 md:w-64 shrink-0 rounded-xl overflow-hidden flex flex-col justify-center items-center p-6 border text-center relative select-none cursor-pointer ${
              allSeasonsCompleted || isSecretUnlocked
                ? "bg-gradient-to-b from-amber-500/10 to-rose-500/10 border-amber-500/40 hover:border-amber-400 shadow-amber-500/5"
                : "bg-neutral-950 border-neutral-900 shadow-inner group"
            }`}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            {allSeasonsCompleted || isSecretUnlocked ? (
              <div className="flex flex-col items-center gap-4 py-6 select-none">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
                  <Unlock className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-widest font-display">
                    SECRET VAULT
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-wide mt-1">
                    The Golden Archive
                  </h4>
                  <p className="text-[10px] text-neutral-300 mt-2 leading-normal">
                    Vault is unlocked!<br />Click to open birthday finale.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                  <div className="absolute bg-amber-500 text-black text-[8px] font-black uppercase tracking-wider py-1 text-center rotate-45 top-4 -right-6 w-28 shadow-sm">
                    Open 🎁
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6 select-none text-neutral-500 group-hover:text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Lock className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 font-display">
                    ACCESS RESTRICTED
                  </span>
                  <h4 className="text-sm font-bold text-neutral-400 tracking-wide mt-1">
                    Hidden Archive
                  </h4>
                  <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed px-2">
                    Explore all 6 seasons (Semesters 1-6) to unlock the birthday vault.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Floating Birthday Montage section */}
      <div className="px-6 md:px-12 py-6 bg-black/40 border-t border-white/5 select-none text-center">
        <p className="text-xs text-neutral-500 font-medium">
          🎬 ShreeshFlix - Crafted with ❤️ for Shreesh Pathak's Birthday.
        </p>
      </div>

      {/* "More Info" Glassmorphic Stats Modal */}
      <AnimatePresence>
        {showStatsModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-8 rounded-3xl glassmorphism-dark border-white/10 text-white relative shadow-2xl"
            >
              <button 
                onClick={() => setShowStatsModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95 cursor-pointer text-white/60 hover:text-white"
              >
                <XIcon className="w-4.5 h-4.5" />
              </button>

              <div className="flex flex-col items-center text-center gap-2 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 flex items-center justify-center font-bold text-2xl font-display shadow-lg">
                  👑
                </div>
                <h3 className="text-xl font-display font-extrabold tracking-wide mt-1">Shreesh Pathak</h3>
                <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  Classroom Legend
                </span>
              </div>

              {/* Stats Sheet */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-2">
                  System Stats Report
                </h4>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-medium">Aura Multiplier:</span>
                  <span className="text-emerald-400 font-black tracking-wide">+9999 Aura (Infinite)</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-medium">Canteen Credit Balance:</span>
                  <span className="text-amber-400 font-bold">-₹1500 (Ginger Tea Debt)</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-medium">Caffeine Consumption:</span>
                  <span className="text-indigo-300 font-bold">1200L (Mainly Tapri Tea)</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-medium">Average Attendance:</span>
                  <span className="text-rose-400 font-bold">42.5% (Perfect Bunk Formula)</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-medium">Active Brain Cells:</span>
                  <span className="text-sky-300 font-bold">2 (Executing parallel jokes)</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-300 font-medium">Silver Tongue Persuasion:</span>
                  <span className="text-amber-300 font-bold">100/100 (Max Charisma)</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="bg-white hover:bg-neutral-200 text-black px-6 py-2 rounded-xl font-bold transition-all active:scale-95 cursor-pointer shadow-lg w-full text-center"
                >
                  Back to Streaming
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple absolute icons
function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

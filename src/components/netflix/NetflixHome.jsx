import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Sparkles, Award, Lock, Unlock, Eye, HelpCircle, Trash2, Plus, X } from 'lucide-react';
import { seasonsData } from '../../data/seasons';

// Frequencies for Happy Birthday notes
const NOTE_FREQS = {
  'C4': 261.63,
  'D4': 293.66,
  'E4': 329.63,
  'F4': 349.23,
  'G4': 392.00,
  'A4': 440.00,
  'Bb4': 466.16,
  'C5': 523.25
};

// Slow, soft melody structure
const happyBirthdayNotes = [
  { note: 'C4', dur: 0.5 },
  { note: 'C4', dur: 0.5 },
  { note: 'D4', dur: 1 },
  { note: 'C4', dur: 1 },
  { note: 'F4', dur: 1 },
  { note: 'E4', dur: 2 },
  
  { note: 'C4', dur: 0.5 },
  { note: 'C4', dur: 0.5 },
  { note: 'D4', dur: 1 },
  { note: 'C4', dur: 1 },
  { note: 'G4', dur: 1 },
  { note: 'F4', dur: 2 },
  
  { note: 'C4', dur: 0.5 },
  { note: 'C4', dur: 0.5 },
  { note: 'C5', dur: 1 },
  { note: 'A4', dur: 1 },
  { note: 'F4', dur: 1 },
  { note: 'E4', dur: 1 },
  { note: 'D4', dur: 2 },
  
  { note: 'Bb4', dur: 0.5 },
  { note: 'Bb4', dur: 0.5 },
  { note: 'A4', dur: 1 },
  { note: 'F4', dur: 1 },
  { note: 'G4', dur: 1 },
  { note: 'F4', dur: 2 },
];

export default function NetflixHome({ 
  seasons = [],
  watchedSeasons = [], 
  onSelectSeason, 
  onUnlockSecretSeason,
  isSecretUnlocked = false,
  onAutoUnlockAll,
  onDeleteSeason,
  onAddSeason,
  isAdmin = false,
  onSetAdmin
}) {
  const [hoveredSeason, setHoveredSeason] = useState(null);
  const activeAudioCtxRef = useRef(null);

  // Play synthesized Happy Birthday soft slow tune
  const playHappyBirthdayTune = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (activeAudioCtxRef.current) {
        activeAudioCtxRef.current.close().catch(() => {});
      }

      const audioCtx = new AudioCtx();
      activeAudioCtxRef.current = audioCtx;
      const now = audioCtx.currentTime;
      
      const tempo = 0.8; // Slow beat speed
      let timeAccumulator = 0.1; // Smooth initial delay

      happyBirthdayNotes.forEach((item) => {
        const freq = NOTE_FREQS[item.note];
        if (freq) {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          osc.type = 'sine'; // Soft, pure pookie tone
          osc.frequency.setValueAtTime(freq, now + timeAccumulator);
          
          gainNode.gain.setValueAtTime(0, now + timeAccumulator);
          gainNode.gain.linearRampToValueAtTime(0.06, now + timeAccumulator + 0.05); // Soft volume
          gainNode.gain.setValueAtTime(0.06, now + timeAccumulator + (item.dur * tempo) - 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + timeAccumulator + (item.dur * tempo));
          
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc.start(now + timeAccumulator);
          osc.stop(now + timeAccumulator + (item.dur * tempo));
        }
        timeAccumulator += item.dur * tempo;
      });
    } catch (e) {}
  };

  useEffect(() => {
    const playTimer = setTimeout(() => {
      playHappyBirthdayTune();
    }, 800); // Trigger softly after mounting
    return () => {
      clearTimeout(playTimer);
      if (activeAudioCtxRef.current) {
        activeAudioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Add Season Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSemester, setNewSemester] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAuraModifier, setNewAuraModifier] = useState('+100 Aura');
  const [newAttendance, setNewAttendance] = useState('75%');
  const [newTags, setNewTags] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitSeason = () => {
    if (!newTitle || !newSemester) return;

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('semester', newSemester);
    formData.append('tagline', newTagline);
    formData.append('description', newDescription);
    formData.append('auraModifier', newAuraModifier);
    formData.append('attendance', newAttendance);
    formData.append('tags', newTags);
    if (newImageFile) {
      formData.append('thumbnailFile', newImageFile);
    }

    onAddSeason(formData);

    // Reset states
    setNewTitle('');
    setNewSemester('');
    setNewTagline('');
    setNewDescription('');
    setNewAuraModifier('+100 Aura');
    setNewAttendance('75%');
    setNewTags('');
    setNewImageFile(null);
    setNewImagePreview('');
    setIsAddModalOpen(false);
  };

  // Admin login states & handler
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (usernameInput === 'admin' && passwordInput === 'pookieroomie') {
      onSetAdmin(true);
      setIsLoginModalOpen(false);
      setLoginError('');
      setUsernameInput('');
      setPasswordInput('');
      alert("🔓 Admin Access Granted! Welcome roomie Shreesh.");
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  // Dynamic display seasons fallback
  const displaySeasons = seasons && seasons.length > 0 ? seasons.filter(s => s.id !== 7) : seasonsData.filter(s => s.id !== 7);

  // Check if seasons 1 to 6 are fully watched to unlock vault
  const allSeasonsCompleted = displaySeasons.length > 0 && displaySeasons.every(s => watchedSeasons.includes(s.id));

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
          <h1 
            onDoubleClick={() => {
              if (isAdmin) {
                if (window.confirm("Do you want to log out of Admin Mode?")) {
                  onSetAdmin(false);
                  alert("🔒 Logged out of Admin Mode.");
                }
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className="text-glow-red text-2xl md:text-3xl font-cinzel font-black tracking-widest text-red-600 uppercase cursor-pointer select-none"
            title={isAdmin ? "Double click to log out of Admin Mode" : "Double click to reveal Admin Login"}
          >
            ShreeshFlix
          </h1>
          <nav className="hidden md:flex items-center gap-5 text-sm text-neutral-300 font-medium select-none">
            <span className="text-white font-semibold cursor-pointer">Home</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={handleVaultClick}>
              {allSeasonsCompleted || isSecretUnlocked ? "🔓 Secret Vault (Open)" : "🔒 Secret Vault (Locked)"}
            </span>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-bold uppercase tracking-wider animate-pulse select-none">
                Admin Mode
              </span>
            )}
          </nav>
        </div>
        
        {/* Right side utilities */}
        <div className="flex items-center gap-4 select-none">

          <div 
            className="w-8 h-8 rounded bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center cursor-default hover:ring-2 hover:ring-white transition-all shadow-md font-bold font-display"
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
            "The most hardworking multitasking perfect man ever alive on earth (and also my small brother)"
          </p>

          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-xl">
            This is an amazing college life journey of my best best best best bestest friend Shreesh Pathak.....
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
          </div>
        </div>
      </div>

      {/* Season Selection Row Grid */}
      <div className="px-6 md:px-12 py-10 z-20 relative mt-6 md:mt-10 flex flex-col gap-4 select-none">
        <h3 className="text-xl md:text-2xl font-display font-bold tracking-wide">
          Semesters Catalog (Select a Season)
        </h3>
        
        <div className="netflix-scroll-row select-none">
          {displaySeasons.map((season) => {
            const isWatched = watchedSeasons.includes(season.id);
            const displayTitle = season.title && season.title.includes(': ') 
              ? season.title.split(': ')[1] 
              : (season.title || 'Untitled');
            const displayAttendance = season.attendance 
              ? season.attendance.split(' ')[0] 
              : '0%';

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
                    src={season.episodes && season.episodes[0] ? season.episodes[0].thumbnail : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'} 
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
                  {/* Delete Season Button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${season.semester || 'this season'}?`)) {
                          onDeleteSeason(season.id);
                        }
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600/90 border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-all z-20 animate-fade-in"
                      title="Delete Season"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {/* Duration count overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {season.episodes ? season.episodes.length : 0} Episodes
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                </div>

                {/* Season Metadata Details */}
                <div className="p-4 flex flex-col gap-2">
                  <span className="text-[10px] font-extrabold uppercase text-red-500 tracking-wider font-display">
                    {season.semester}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-wide truncate">
                    {displayTitle}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {season.tagline}
                  </p>
                  
                  {/* Aura score tag */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
                    <span className="text-emerald-400 font-bold">{season.auraModifier}</span>
                    <span className="text-neutral-500 font-medium">Att: {displayAttendance}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add Season Card */}
          {isAdmin && (
            <motion.div
              onClick={() => setIsAddModalOpen(true)}
              className="w-56 md:w-64 shrink-0 rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-red-500/50 bg-neutral-900/40 hover:bg-neutral-900/80 flex flex-col justify-center items-center p-6 text-center cursor-pointer transition-all duration-300 group shadow-md"
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-red-600/10 flex items-center justify-center text-neutral-400 group-hover:text-red-500 transition-colors mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-400 group-hover:text-red-500 transition-colors">
                Add New Season
              </h4>
              <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed px-2">
                Create a custom semester arc with personalized storylines!
              </p>
            </motion.div>
          )}

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



      {/* Admin Login Modal popup */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-6 md:p-8 rounded-3xl bg-neutral-900 border border-white/10 text-white relative shadow-2xl"
            >
              <button 
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setUsernameInput('');
                  setPasswordInput('');
                  setLoginError('');
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center gap-2 mb-6">
                <span className="text-2xl select-none">🔑</span>
                <h3 className="text-lg font-display font-bold tracking-wide mt-1">
                  Admin System Access
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium">
                  Enter credentials to unlock editorial capabilities.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Username
                  </label>
                  <input 
                    type="text" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Username"
                    required
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Password
                  </label>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-red-400 font-semibold text-center select-none">
                    ⚠️ {loginError}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 text-center"
                >
                  Verify Credentials
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Season Modal popup */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg p-6 md:p-8 rounded-3xl bg-neutral-900 border border-white/10 text-white relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewTitle('');
                  setNewSemester('');
                  setNewTagline('');
                  setNewDescription('');
                  setNewAuraModifier('+100 Aura');
                  setNewAttendance('75%');
                  setNewTags('');
                  setNewImageFile(null);
                  setNewImagePreview('');
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-display font-bold tracking-wide mb-5 text-red-500">
                Create a Custom ShreeshFlix Season
              </h3>

              <div className="flex flex-col gap-4 text-left">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    Season Title
                  </label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. The Placement Battle Royale"
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                  />
                </div>

                {/* Semester & Tagline row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                      Semester Label
                    </label>
                    <input 
                      type="text" 
                      value={newSemester}
                      onChange={(e) => setNewSemester(e.target.value)}
                      placeholder="e.g. Semester 7"
                      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                      Aura Modifier
                    </label>
                    <input 
                      type="text" 
                      value={newAuraModifier}
                      onChange={(e) => setNewAuraModifier(e.target.value)}
                      placeholder="e.g. +500 Aura"
                      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    Tagline / One-liner
                  </label>
                  <input 
                    type="text" 
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="e.g. Sleepless coding sprints, resume edits, and coffee addiction."
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    Detailed Plot Description
                  </label>
                  <textarea 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide a fun description of what Shreesh does during this semester..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all resize-none"
                  />
                </div>

                {/* Attendance & Tags row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                      Average Attendance
                    </label>
                    <input 
                      type="text" 
                      value={newAttendance}
                      onChange={(e) => setNewAttendance(e.target.value)}
                      placeholder="e.g. 55% (Strategic bunks)"
                      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                      Tags (Comma separated)
                    </label>
                    <input 
                      type="text" 
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g. Placements, Resume, DSA"
                      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Poster Image upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    Season Poster / Banner Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="px-4 py-2 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 text-xs font-semibold text-neutral-300 cursor-pointer transition-all active:scale-95">
                      Choose Cover Image...
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                      {newImageFile ? `✓ ${newImageFile.name}` : "No file chosen"}
                    </span>
                  </div>
                </div>

                {/* Image Preview Box */}
                {newImagePreview && (
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 relative mt-1 bg-neutral-950">
                    <img src={newImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { setNewImageFile(null); setNewImagePreview(''); }}
                      className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/75 hover:bg-black text-white text-[10px] cursor-pointer"
                    >
                      Clear Preview
                    </button>
                  </div>
                )}

                {/* Submit / Cancel Buttons */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setNewTitle('');
                      setNewSemester('');
                      setNewTagline('');
                      setNewDescription('');
                      setNewAuraModifier('+100 Aura');
                      setNewAttendance('75%');
                      setNewTags('');
                      setNewImageFile(null);
                      setNewImagePreview('');
                    }}
                    className="flex-1 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold transition-all text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitSeason}
                    disabled={!newTitle || !newSemester}
                    className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    Save Season
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



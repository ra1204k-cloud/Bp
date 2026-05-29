import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, X, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';

export default function EpisodePage({ episode, onBackToSeason, onMarkAsWatched }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const synthTimerRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Defining 3 narrative slides for each episode to represent full storytelling
  const slides = [
    {
      title: "The Premise: Setting the Stage",
      heading: "How the legend unfolded...",
      bgColor: "from-neutral-900 to-indigo-950/40",
      content: episode.description,
      illustrateEmoji: "🎬",
      detailText: "It began as a completely normal college day, but Shreesh was about to elevate it into an absolute blockbuster event."
    },
    {
      title: "The Climax: The Turning Point",
      heading: "The absolute peak of chaos!",
      bgColor: "from-neutral-900 to-rose-950/40",
      content: episode.caption,
      illustrateEmoji: "🔥",
      detailText: "This is where the standard rules of engineering physics, discipline, and attendance ratios ceased to apply."
    },
    {
      title: "The Resolution: The Lore Takeaway",
      heading: "Nostalgic wisdom & final rating",
      bgColor: "from-neutral-900 to-amber-950/40",
      content: "A legendary story that became a permanent part of the campus lore.",
      illustrateEmoji: "🏆",
      detailText: "Years from now, juniors will still speak of these events with awe.",
      stamp: true
    }
  ];

  // Auto progression slide timer (8 seconds per slide)
  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);
    const stepTime = 100; // Update progress every 100ms
    const totalTime = 8000; // 8 seconds per slide
    const increment = (stepTime / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [currentSlide, isPlaying]);

  // Mark this episode as watched when reaching the final slide
  useEffect(() => {
    if (currentSlide === slides.length - 1) {
      onMarkAsWatched(episode.id);
    }
  }, [currentSlide, episode.id, onMarkAsWatched]);

  const handleNextSlide = () => {
    setProgress(0);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      // Loop back to start or let user exit
      setCurrentSlide(0);
    }
  };

  const handlePrevSlide = () => {
    setProgress(0);
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    } else {
      setCurrentSlide(slides.length - 1);
    }
  };

  // Real-time Spacey Soundtrack Synthesizer Loop (Web Audio API)
  // Plays a beautiful soft spacey arpeggio loop: Cmaj -> Gmaj -> Amin -> Fmaj
  const startBackgroundSynth = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      
      let chordIndex = 0;
      // Warm synth chord arpeggios: 
      // C major: C3, E3, G3, C4
      // G major: G2, D3, G3, B3
      // A minor: A2, E3, A3, C4
      // F major: F2, C3, F3, A3
      const chords = [
        [130.81, 164.81, 196.00, 261.63], // Cmaj
        [98.00, 146.83, 196.00, 246.94],  // Gmaj
        [110.00, 164.81, 220.00, 261.63], // Amin
        [87.31, 130.81, 174.61, 220.00]   // Fmaj
      ];

      const playNextArpeggio = () => {
        const now = audioCtx.currentTime;
        const notes = chords[chordIndex];
        
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18); // Arpeggiated trigger delay!
          
          // Low-pass filter to keep the chime extremely soft and dreamy
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, now);

          gainNode.gain.setValueAtTime(0, now + idx * 0.18);
          gainNode.gain.linearRampToValueAtTime(0.04, now + idx * 0.18 + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.6);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 1.8);
        });

        chordIndex = (chordIndex + 1) % chords.length;
      };

      // Trigger arpeggio instantly
      playNextArpeggio();
      
      // Repeating sequencer timer every 2.4 seconds
      synthTimerRef.current = setInterval(playNextArpeggio, 2400);

    } catch (e) {
      console.warn("Lo-fi sequencer failed", e);
    }
  };

  const stopBackgroundSynth = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const handleMusicToggle = () => {
    if (musicOn) {
      stopBackgroundSynth();
      setMusicOn(false);
    } else {
      startBackgroundSynth();
      setMusicOn(true);
    }
  };

  // Clean up Web Audio nodes when exiting component
  useEffect(() => {
    return () => {
      stopBackgroundSynth();
    };
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0a0f] text-white overflow-hidden z-50 flex flex-col font-sans">
      
      {/* Background Radial Glow */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${currentSlideData.bgColor} opacity-60 z-0 transition-all duration-1000`} />
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Screen Split Navigation Tap zones (Instagram story style) */}
      <div className="absolute inset-0 flex z-10 pointer-events-auto select-none">
        <div onClick={handlePrevSlide} className="w-[30%] h-full cursor-w-resize" />
        <div className="w-[40%] h-full pointer-events-none" /> {/* Safe center zone */}
        <div onClick={handleNextSlide} className="w-[30%] h-full cursor-e-resize" />
      </div>

      {/* Top Controls Overlay */}
      <div className="w-full px-6 py-4 flex flex-col gap-4 relative z-20 select-none">
        
        {/* Story indicators progress bars */}
        <div className="flex gap-2 w-full">
          {slides.map((_, idx) => {
            let fillWidth = '0%';
            if (idx < currentSlide) fillWidth = '100%';
            if (idx === currentSlide) fillWidth = `${progress}%`;
            
            return (
              <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full transition-all duration-100 ease-linear"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* Action Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSeason}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer border border-white/5 active:scale-90"
            >
              <X className="w-5 h-5 text-neutral-300" />
            </button>
            <div>
              <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest font-display">
                Streaming Memory
              </span>
              <h2 className="text-sm font-bold text-white tracking-wide">
                {episode.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real-time ambient music synth loop */}
            <button
              onClick={handleMusicToggle}
              title="Toggle space ambient synth track"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md ${
                musicOn 
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" 
                  : "bg-black/40 text-neutral-400 border-white/5"
              }`}
            >
              {musicOn ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
              <span>{musicOn ? "Nostalgia Music: On" : "Synthesize Music"}</span>
            </button>

            {/* Play/Pause slides */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer border border-white/5 active:scale-90"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Slideshow Frame Display */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12 py-6 relative z-20 select-none pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: 'spring', damping: 20 }}
            className="w-full max-w-4xl rounded-3xl glassmorphism-dark border-white/10 px-8 py-10 md:p-12 flex flex-col md:flex-row gap-8 items-center relative shadow-2xl overflow-hidden min-h-[450px]"
          >
            {/* Ambient Red Laser Sweep */}
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 pointer-events-none animate-pulse" />

            {/* Left Column Graphic Visual */}
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0 shadow-lg text-6xl md:text-7xl relative select-none">
              {currentSlideData.illustrateEmoji}
              <div className="absolute inset-0 rounded-2xl border border-red-500/10 scale-105 animate-ping pointer-events-none select-none" style={{ animationDuration: '4s' }} />
            </div>

            {/* Right Column Text Stories */}
            <div className="flex-1 flex flex-col gap-4 text-left select-none">
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-500 font-display">
                {currentSlideData.title}
              </span>
              <h3 className="text-2xl md:text-4xl font-display font-black tracking-wide text-white leading-tight">
                {currentSlideData.heading}
              </h3>
              
              <p className="text-sm md:text-lg text-neutral-200 leading-relaxed font-medium">
                {currentSlideData.content}
              </p>
              
              <p className="text-xs text-neutral-400 leading-relaxed">
                {currentSlideData.detailText}
              </p>

              {/* Slide 1 & 2 Custom Dialogue Preview bubble boxes */}
              {currentSlide === 0 && episode.dialogs && episode.dialogs.length > 0 && (
                <div className="mt-4 flex flex-col gap-2.5 max-w-md">
                  {episode.dialogs.map((d, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.4 }}
                      className={`p-3 rounded-2xl text-xs leading-normal relative border max-w-[85%] ${
                        d.sender === 'Shreesh' 
                          ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-100 self-end rounded-br-none" 
                          : "bg-neutral-800 border-neutral-700 text-neutral-200 self-start rounded-bl-none"
                      }`}
                    >
                      <span className={`block font-bold text-[9px] mb-1 uppercase tracking-wider ${
                        d.sender === 'Shreesh' ? "text-indigo-400" : "text-red-400"
                      }`}>{d.sender}</span>
                      "{d.text}"
                    </motion.div>
                  ))}
                </div>
              )}

              {currentSlide === 1 && episode.dialogs && episode.dialogs.length > 1 && (
                <div className="mt-4 flex flex-col gap-2.5 max-w-md">
                  {episode.dialogs.slice(1, 4).map((d, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.4 }}
                      className={`p-3 rounded-2xl text-xs leading-normal relative border max-w-[85%] ${
                        d.sender === 'Shreesh' 
                          ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-100 self-end rounded-br-none" 
                          : "bg-neutral-800 border-neutral-700 text-neutral-200 self-start rounded-bl-none"
                      }`}
                    >
                      <span className={`block font-bold text-[9px] mb-1 uppercase tracking-wider ${
                        d.sender === 'Shreesh' ? "text-indigo-400" : "text-red-400"
                      }`}>{d.sender}</span>
                      "{d.text}"
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Slide 3 Climax Visual Aura Trophy Stamp */}
              {currentSlideData.stamp && (
                <motion.div
                  initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                  animate={{ scale: 1, rotate: -5, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring', damping: 12 }}
                  className="mt-4 self-start px-6 py-3 border-2 border-dashed border-emerald-500/50 bg-emerald-500/5 text-emerald-400 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/5 select-none"
                >
                  <Award className="w-8 h-8 animate-pulse shrink-0" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest block text-emerald-500">
                      Lore Milestone unlocked
                    </span>
                    <span className="text-sm font-bold tracking-wide">
                      Aura gained: +999 Max!
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Screen Split Navigation overlay controls */}
      <div className="px-6 py-6 border-t border-white/5 bg-[#0e0c12]/60 flex justify-between items-center relative z-20 select-none">
        <button
          onClick={handlePrevSlide}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer select-none active:scale-90"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        <span className="text-xs text-neutral-500 font-bold select-none">
          Slide {currentSlide + 1} of {slides.length}
        </span>

        <button
          onClick={handleNextSlide}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer select-none active:scale-90"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

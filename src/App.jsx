import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Importing components
import BootScreen from './components/boot/BootScreen';
import LockScreen from './components/lockscreen/LockScreen';
import Desktop from './components/desktop/Desktop';
import NetflixIntro from './components/netflix/NetflixIntro';
import NetflixHome from './components/netflix/NetflixHome';
import SeasonPage from './components/netflix/SeasonPage';
import EpisodePage from './components/netflix/EpisodePage';
import Finale from './components/netflix/Finale';

// Importing data (fallback if API fails, though we won't need it if API works)
import { seasonsData, surpriseSeason } from './data/seasons';

export default function App() {
  const [stage, setStage] = useState('boot'); // 'boot' -> 'lock' -> 'desktop' -> 'netflix-intro' -> 'netflix-home' -> 'season-view' -> 'episode-view' -> 'secret-vault'
  
  // Dynamic Seasons state from Backend API
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seasons on mount
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch('/api/seasons');
        if (response.ok) {
          const data = await response.json();
          setSeasons(data);
        } else {
          console.error("Failed to fetch seasons from API");
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeasons();
  }, []);

  // History tracking state
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  const [watchedSeasons, setWatchedSeasons] = useState([]);
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  
  // Navigation pointers
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);

  // Add/delete episode handlers
  const handleAddEpisode = async (seasonId, formData) => {
    try {
      const res = await fetch(`/api/seasons/${seasonId}/episodes`, {
        method: 'POST',
        body: formData // sending multipart/form-data directly
      });
      if (res.ok) {
        const updatedSeason = await res.json();
        setSeasons(prevSeasons => prevSeasons.map(s => s.id === seasonId ? updatedSeason : s));
      } else {
        alert("Failed to save episode to server.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error connecting to server.");
    }
  };

  const handleDeleteEpisode = async (seasonId, episodeId) => {
    try {
      const res = await fetch(`/api/seasons/${seasonId}/episodes/${episodeId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const updatedSeason = await res.json();
        setSeasons(prevSeasons => prevSeasons.map(s => s.id === seasonId ? updatedSeason : s));
      } else {
        alert("Failed to delete episode.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Mark an episode as fully watched and sync its parent season
  const handleMarkAsWatched = (episodeId) => {
    if (!watchedEpisodes.includes(episodeId)) {
      const newWatched = [...watchedEpisodes, episodeId];
      setWatchedEpisodes(newWatched);

      // Identify which season this episode belongs to, and mark that season as watched
      const foundSeason = seasons.find(s => s.episodes.some(e => e.id === episodeId));
      if (foundSeason && !watchedSeasons.includes(foundSeason.id)) {
        const newSeasons = [...watchedSeasons, foundSeason.id];
        setWatchedSeasons(newSeasons);

        // Check if all 6 seasons are now watched
        if (newSeasons.length === seasons.length) {
          setIsSecretUnlocked(true);
        }
      }
    }
  };

  // Easter Egg Cheat code to instantly complete everything!
  const handleAutoUnlockAll = () => {
    const allEpisodeIds = seasons.flatMap(s => s.episodes.map(e => e.id));
    const allSeasonIds = seasons.map(s => s.id);
    
    setWatchedEpisodes(allEpisodeIds);
    setWatchedSeasons(allSeasonIds);
    setIsSecretUnlocked(true);
    
    // Play a synthesized success sweep
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch(e){}
  };

  const currentSeason = seasons.find(s => s.id === selectedSeasonId);
  const currentEpisode = currentSeason?.episodes.find(e => e.id === selectedEpisodeId);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden select-none bg-black text-white relative">
      <AnimatePresence mode="wait">
        
        {/* Phase 1: MacBook Boot Screen */}
        {stage === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <BootScreen onComplete={() => setStage('lock')} />
          </motion.div>
        )}

        {/* Phase 2: macOS Lock Screen */}
        {stage === 'lock' && (
          <motion.div
            key="lock"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <LockScreen onUnlock={() => setStage('desktop')} />
          </motion.div>
        )}

        {/* Phase 3: macOS Desktop */}
        {stage === 'desktop' && (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <Desktop onOpenApp={() => setStage('netflix-intro')} />
          </motion.div>
        )}

        {/* Phase 4: ShreeshFlix TUDUM Launch Intro */}
        {stage === 'netflix-intro' && (
          <motion.div
            key="netflix-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <NetflixIntro onComplete={() => setStage('netflix-home')} />
          </motion.div>
        )}

        {/* Phase 5: Streaming Platform Homepage */}
        {stage === 'netflix-home' && (
          <motion.div
            key="netflix-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <NetflixHome 
              watchedSeasons={watchedSeasons}
              onSelectSeason={(seasonId) => {
                setSelectedSeasonId(seasonId);
                setStage('season-view');
                
                // Mark this season as explored
                if (!watchedSeasons.includes(seasonId)) {
                  const newSeasons = [...watchedSeasons, seasonId];
                  setWatchedSeasons(newSeasons);
                  
                  // Check if all 6 seasons are now explored
                  if (newSeasons.length === seasonsData.length) {
                    setIsSecretUnlocked(true);
                  }
                }
              }}
              onUnlockSecretSeason={() => setStage('secret-vault')}
              isSecretUnlocked={isSecretUnlocked}
              onAutoUnlockAll={handleAutoUnlockAll}
            />
          </motion.div>
        )}

        {/* Phase 6: Semester Episode Directory Grid */}
        {stage === 'season-view' && currentSeason && (
          <motion.div
            key="season-view"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: 'spring', damping: 20 }}
            className="w-full h-full"
          >
            <SeasonPage 
              season={currentSeason}
              onBackToHome={() => setStage('netflix-home')}
              onSelectEpisode={(epId) => {
                setSelectedEpisodeId(epId);
                setStage('episode-view');
              }}
              watchedEpisodes={watchedEpisodes}
              onAddEpisode={handleAddEpisode}
              onDeleteEpisode={handleDeleteEpisode}
            />
          </motion.div>
        )}

        {/* Phase 7: Fullscreen Narrative Memory Player */}
        {stage === 'episode-view' && currentEpisode && (
          <motion.div
            key="episode-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <EpisodePage 
              episode={currentEpisode}
              onBackToSeason={() => setStage('season-view')}
              onMarkAsWatched={handleMarkAsWatched}
            />
          </motion.div>
        )}

        {/* Phase 8: Golden Birthday Surprise Vault */}
        {stage === 'secret-vault' && (
          <motion.div
            key="secret-vault"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <Finale onBackToHome={() => setStage('netflix-home')} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

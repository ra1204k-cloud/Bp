import React, { useState } from 'react';
import { ChevronLeft, Sparkles, Plus, Trash2, X, Play } from 'lucide-react';

export default function SeasonPage({ 
  season, 
  onBackToHome, 
  onSelectEpisode, 
  watchedEpisodes = [],
  onAddEpisode,
  onDeleteEpisode
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');
  
  // Video uploading and playing states
  const [episodeType, setEpisodeType] = useState('image'); // 'image' or 'video'
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [newVideoPreview, setNewVideoPreview] = useState('');
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState('');

  // Fallback for background/poster if there are no episodes left
  const heroBg = season.episodes && season.episodes.length > 0 
    ? season.episodes[0].thumbnail 
    : 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // Increased to 100MB for server
        alert("⚠️ Video file is too large! Please choose a video under 100MB.");
        return;
      }
      setNewVideoFile(file);
      setNewVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitEpisode = () => {
    if (!newTitle) return;
    if (episodeType === 'image' && !newImageFile) return;
    if (episodeType === 'video' && !newVideoFile) return;

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('episodeType', episodeType);
    
    if (episodeType === 'image') {
      formData.append('file', newImageFile);
    } else {
      formData.append('file', newVideoFile);
      if (newImageFile) {
        formData.append('thumbnailFile', newImageFile);
      }
    }

    onAddEpisode(season.id, formData);

    // Reset states
    setNewTitle('');
    setNewImageFile(null);
    setNewImagePreview('');
    setNewVideoFile(null);
    setNewVideoPreview('');
    setEpisodeType('image');
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-full h-full bg-[#141414] text-white overflow-y-auto font-sans relative">
      
      {/* Back to Home Header */}
      <div className="sticky top-0 h-16 px-6 md:px-12 flex items-center bg-[#141414]/90 backdrop-blur-md border-b border-white/5 z-40 select-none">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors cursor-pointer text-sm font-semibold active:scale-95 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>
        <span className="h-4 w-px bg-white/20 mx-4" />
        <span className="text-xs uppercase font-extrabold tracking-widest text-red-500 font-display">
          {season.semester}
        </span>
      </div>

      {/* Season Showcase Banner Header */}
      <div className="relative px-6 md:px-12 py-10 md:py-16 bg-neutral-950 border-b border-white/5 overflow-hidden flex flex-col md:flex-row gap-8 items-start select-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm pointer-events-none select-none z-0"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />
        
        {/* Poster Slot */}
        <div className="w-full md:w-56 h-36 md:h-56 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-2xl bg-neutral-900 z-10 select-none">
          <img 
            src={heroBg} 
            alt={season.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info detail */}
        <div className="flex-1 flex flex-col gap-4 z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full font-bold">
              {season.semester}
            </span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{season.auraModifier}</span>
            </span>
            <span className="text-xs text-neutral-400 font-semibold">
              Attendance: {season.attendance}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-black tracking-wide">
            {season.title}
          </h2>

          <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl">
            {season.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {season.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-white/10 border border-white/5 px-2.5 py-1 rounded text-neutral-300 font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Episode Catalog List */}
      <div className="px-6 md:px-12 py-12 flex flex-col gap-6 select-none">
        <h3 className="text-xl md:text-2xl font-display font-bold tracking-wide">
          Episodes Directory ({season.episodes.length} Available)
        </h3>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [column-fill:_balance]">
          {season.episodes.map((ep, idx) => {
            return (
              <div
                key={ep.id}
                onClick={() => {
                  if (ep.videoUrl) {
                    setActiveVideoUrl(ep.videoUrl);
                    setActiveVideoTitle(ep.title);
                  }
                }}
                className={`break-inside-avoid inline-flex w-full mb-8 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 shadow-xl relative flex-col group ${
                  ep.videoUrl ? 'cursor-pointer hover:border-red-500/40' : ''
                }`}
              >
                {/* Thumbnail Card */}
                <div className="relative bg-neutral-800 overflow-hidden">
                  <img 
                    src={ep.thumbnail} 
                    alt={ep.title} 
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                  {/* Play Button Overlay for playable videos */}
                  {ep.videoUrl && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/25 transition-all duration-300 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-red-600/90 border border-red-500 flex items-center justify-center scale-95 group-hover:scale-105 transition-all shadow-lg shadow-red-600/40">
                        <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Delete Episode Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this episode?")) {
                        onDeleteEpisode(season.id, ep.id);
                      }
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600/90 text-white flex items-center justify-center transition-all z-30 cursor-pointer shadow-md opacity-0 group-hover:opacity-100 scale-95 hover:scale-105"
                    title="Delete Episode"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content details */}
                <div className="p-5 flex flex-col gap-1.5 justify-center">
                  <span className="text-[10px] font-extrabold text-red-500 font-display">
                    EPISODE {idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-white tracking-wide leading-snug">
                    {ep.title}
                  </h4>
                </div>
              </div>
            );
          })}

          {/* Dotted Plus Card */}
          <div 
            onClick={() => setIsAddModalOpen(true)}
            className="break-inside-avoid inline-flex w-full mb-8 rounded-2xl border-2 border-dashed border-white/20 hover:border-red-500/50 bg-neutral-900/40 hover:bg-neutral-900/80 flex flex-col justify-center items-center p-8 min-h-[220px] text-center cursor-pointer transition-all duration-300 group shadow-md"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-red-600/10 flex items-center justify-center text-neutral-400 group-hover:text-red-500 transition-colors mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-neutral-400 group-hover:text-red-500 transition-colors">
              Add New Episode
            </span>
          </div>
        </div>
      </div>

      {/* Add Episode Modal popup */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md p-6 md:p-8 rounded-3xl bg-neutral-900 border border-white/10 text-white relative shadow-2xl">
            <button 
              onClick={() => {
                setIsAddModalOpen(false);
                setNewTitle('');
                setNewImageFile(null);
                setNewImagePreview('');
                setNewVideoFile(null);
                setNewVideoPreview('');
                setEpisodeType('image');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-display font-bold tracking-wide mb-5">
              Add New Episode to {season.semester}
            </h3>

            <div className="flex flex-col gap-4">
              {/* Toggle Selector for Episode Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                  Episode Type
                </label>
                <div className="flex rounded-xl bg-black/50 p-1 border border-white/5">
                  <button
                    onClick={() => setEpisodeType('image')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      episodeType === 'image' 
                        ? 'bg-red-600 text-white shadow' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Static Image
                  </button>
                  <button
                    onClick={() => setEpisodeType('video')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      episodeType === 'video' 
                        ? 'bg-red-600 text-white shadow' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Playable Video
                  </button>
                </div>
              </div>

              {/* Title input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                  Episode Title
                </label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Ep 4: The Midnight Tea Hunt"
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white focus:outline-none focus:border-red-500/50 text-sm font-medium transition-all"
                />
              </div>

              {/* Conditional Uploader slots based on Type */}
              {episodeType === 'image' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    Episode Thumbnail Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="px-4 py-2 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 text-xs font-semibold text-neutral-300 cursor-pointer transition-all active:scale-95">
                      Choose Image...
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
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                      Upload Video Clip
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="px-4 py-2 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 text-xs font-semibold text-neutral-300 cursor-pointer transition-all active:scale-95">
                        Choose Video...
                        <input 
                          type="file" 
                          accept="video/*" 
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                        {newVideoFile ? `✓ ${newVideoFile.name}` : "No file chosen"}
                      </span>
                    </div>
                  </div>

                  {/* Optional thumbnail for the video card */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                      Upload Custom Card Thumbnail (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="px-4 py-2 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 text-xs font-semibold text-neutral-300 cursor-pointer transition-all active:scale-95">
                        Choose Thumbnail...
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                        {newImageFile ? `✓ ${newImageFile.name}` : "Default clapperboard"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
                    setNewImageFile(null);
                    setNewImagePreview('');
                    setNewVideoFile(null);
                    setNewVideoPreview('');
                    setEpisodeType('image');
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold transition-all text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitEpisode}
                  disabled={!newTitle || (episodeType === 'image' && !newImageFile) || (episodeType === 'video' && !newVideoFile)}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                >
                  Save Episode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Popup Player Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
          <div className="w-full max-w-4xl rounded-3xl bg-neutral-950 border border-white/10 text-white relative shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-900 select-none">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest font-display">
                  Now Streaming Episode Video
                </span>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {activeVideoTitle}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setActiveVideoUrl(null);
                  setActiveVideoTitle('');
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-neutral-300 hover:text-white cursor-pointer active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="p-6 bg-black flex justify-center items-center">
              <video 
                src={activeVideoUrl} 
                controls 
                autoPlay 
                className="w-full rounded-2xl border border-white/5 shadow-2xl max-h-[70vh] bg-black focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Film, Play, Clock, ChevronRight, Pause, RotateCcw, Volume2, Sparkles, Zap, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storyboardStyles as s } from '../storyboardStyles';
import { motion } from 'framer-motion';

import { StoryboardPageContext } from '../StoryboardPage';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound?: string;
  duration: string;
  linkedPrompt?: string;
  videoPrompt?: string;
  soulFocus?: string;
  vfxCompounds?: string;
  emotionalKey?: string;
  subtext?: string;
  assets?: string;
}

interface AnimaticTabProps {
  scenes?: Scene[];
  videoData?: Record<number, string>;
}

export const AnimaticTab: React.FC<AnimaticTabProps> = ({ scenes: propsScenes, videoData: propsVideoData }) => {
  const context = React.useContext(StoryboardPageContext);
  const scenes = propsScenes || context?.scenes || [];
  const videoData = propsVideoData || context?.videoData || {};
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeTheaterIndex, setActiveTheaterIndex] = useState<number | null>(null);
  const [theaterPlaybackProgress, setTheaterPlaybackProgress] = useState(0);

  const totalDuration = scenes.reduce((acc, s) => {
    const secs = parseInt(s.duration?.replace(/\D/g, '') || '5');
    return acc + (isNaN(secs) ? 5 : secs);
  }, 0);

  const hasVideos = Object.values(videoData).some(v => v && v !== 'loading');

  // Master Theater Playback Loop Hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingAll && activeTheaterIndex !== null) {
      const scene = scenes[activeTheaterIndex];
      const durationSec = parseInt(scene.duration?.replace(/\D/g, '') || '5');
      const durationMs = (isNaN(durationSec) ? 5 : durationSec) * 1000;
      
      let elapsed = 0;
      const step = 100; // Update progress bar every 100ms
      interval = setInterval(() => {
        elapsed += step;
        setTheaterPlaybackProgress((elapsed / durationMs) * 100);
        if (elapsed >= durationMs) {
          // Progress to next frame or wrap up
          if (activeTheaterIndex < scenes.length - 1) {
            setActiveTheaterIndex(prev => prev! + 1);
            setTheaterPlaybackProgress(0);
          } else {
            // End of sequence reached
            setIsPlayingAll(false);
            setActiveTheaterIndex(null);
            setTheaterPlaybackProgress(0);
          }
        }
      }, step);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingAll, activeTheaterIndex, scenes]);

  const toggleTheaterPlay = () => {
    if (scenes.length === 0) return;
    if (isPlayingAll) {
      setIsPlayingAll(false);
    } else {
      setIsPlayingAll(true);
      if (activeTheaterIndex === null) {
        setActiveTheaterIndex(0);
        setTheaterPlaybackProgress(0);
      }
    }
  };

  const selectTheaterScene = (idx: number) => {
    setActiveTheaterIndex(idx);
    setTheaterPlaybackProgress(0);
    setIsPlayingAll(true);
  };

  const activeScene = activeTheaterIndex !== null ? scenes[activeTheaterIndex] : null;
  const activeVideoUrl = activeScene ? videoData[activeScene.originalIndex] : null;
  const activeHasVideo = activeVideoUrl && activeVideoUrl !== 'loading';

  return (
    <div className={s.tabContent + " animate-in fade-in duration-700"}>
      {/* Header */}
      <div className={s.tabSectionHeader}>
        <div className="flex items-center gap-6">
          <div className={cn(s.tabHeaderIconBox, "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]")}>
            <Film className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-left">
            <h2 className={s.tabSectionTitle}>Animatic Master Cutting Room</h2>
            <p className={s.tabSectionSubtitle}>
              Sequential cinematic timing with real-time dynamic overlays
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3 px-5 py-3 bg-black/40 border border-white/5 rounded-2xl">
          <Clock className="w-4 h-4 text-emerald-400" />
          <div className="text-left">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Est. Runtime</p>
            <p className="text-xs font-black text-white font-mono mt-0.5">{Math.floor(totalDuration / 60)}m {totalDuration % 60}s</p>
          </div>
        </div>
      </div>

      {scenes.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Film className="w-12 h-12 text-zinc-700 mx-auto" />
          <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">
            No videos detected — parse a script to begin the animatic.
          </p>
        </div>
      ) : (
        <div className="space-y-10 max-w-4xl mx-auto">
          
          {/* CINEMATIC TIMELINE THEATER */}
          {hasVideos && (
            <div className="w-full bg-[#050505] border border-emerald-500/20 rounded-[2.5rem] p-6 backdrop-blur-3xl shadow-[0_0_60px_rgba(16,185,129,0.05)] relative overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent opacity-60 pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] bg-emerald-500/5 border border-emerald-500/20 px-4 py-1.5 rounded-xl">
                  {isPlayingAll ? "🔴 LIVE SEQUENCE PLAYBACK" : "⏸️ PLAYBACK READY"}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={toggleTheaterPlay}
                    className="h-10 px-6 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-emerald shadow-lg cursor-pointer"
                  >
                    {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlayingAll ? "Pause" : "Play Sequential Cut"}
                  </button>
                  <button 
                    onClick={() => { setIsPlayingAll(false); setActiveTheaterIndex(null); setTheaterPlaybackProgress(0); }}
                    className="h-10 w-10 rounded-xl border border-white/10 text-zinc-400 hover:text-white bg-white/[0.01] hover:bg-white/5 transition-all flex items-center justify-center cursor-pointer"
                    title="Reset Theater"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Theater Canvas Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Widescreen Theater Monitor */}
                <div className="lg:col-span-2 relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center shadow-2xl">
                  {activeHasVideo ? (
                    <video
                      key={activeTheaterIndex} // Force reload on index change
                      src={activeVideoUrl!}
                      className="w-full h-full object-cover"
                      autoPlay={isPlayingAll}
                      muted
                      loop
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-zinc-600">
                      <Film className="w-12 h-12 text-zinc-800 animate-pulse" />
                      <p className="text-xs uppercase tracking-widest font-black">
                        Select a scene row below to screen the cut
                      </p>
                    </div>
                  )}

                  {/* SUBTITLE OVERLAY */}
                  {activeScene && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-xl text-center bg-black/75 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 text-white font-medium text-xs leading-relaxed z-30 drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] shadow-2xl animate-in fade-in duration-300">
                      <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400 block mb-1 uppercase">
                        🎤 {activeScene.soulFocus || "SYSTEM DIALOG"}
                      </span>
                      "{activeScene.narration}"
                    </div>
                  )}

                  {/* FOLEY / ACOUSTIC CUE */}
                  {activeScene?.sound && (
                    <div className="absolute top-6 right-6 bg-blue-500/80 backdrop-blur-md border border-blue-400 text-white font-mono text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg z-30 flex items-center gap-1.5 shadow-2xl">
                      <Volume2 className="w-3.5 h-3.5 animate-bounce" /> {activeScene.sound}
                    </div>
                  )}

                  {/* ACTIVE TIMELINE TIMER */}
                  {activeScene && (
                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] font-black px-3 py-1.5 rounded-lg z-30 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Scene {String(activeTheaterIndex! + 1).padStart(2, '0')} — {activeScene.duration}
                    </div>
                  )}

                  {/* Playback Step Progress Line */}
                  {isPlayingAll && (
                    <div className="absolute bottom-0 left-0 h-1.5 bg-emerald-500 transition-all duration-100 shadow-emerald" style={{ width: `${theaterPlaybackProgress}%` }} />
                  )}
                </div>

                {/* Live Diagnostic HUD Column */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4 text-left flex flex-col justify-between">
                  {activeScene ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Active Section</span>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mt-1">{activeScene.section}</h4>
                      </div>
                      
                      {activeScene.soulFocus && (
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Character Focus</span>
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mt-1">👤 {activeScene.soulFocus}</span>
                        </div>
                      )}

                      {activeScene.emotionalKey && (
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Emotional Key</span>
                          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block mt-1">🔥 {activeScene.emotionalKey}</span>
                        </div>
                      )}

                      {activeScene.vfxCompounds && (
                        <div>
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">VFX Compound Filters</span>
                          <p className="text-[10px] text-zinc-400 font-mono leading-relaxed mt-1">✨ {activeScene.vfxCompounds}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-zinc-600 uppercase text-[10px] tracking-widest font-black">
                      No active scene selected
                    </div>
                  )}

                  {/* Playlist Queue Progress mini bars */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Sequence Timeline</span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {scenes.map((_, i) => (
                        <div 
                          key={i} 
                          onClick={() => selectTheaterScene(i)}
                          className={cn(
                            "h-6 px-2.5 rounded-lg flex items-center justify-center font-mono text-[10px] font-black cursor-pointer border transition-all",
                            activeTheaterIndex === i
                              ? "bg-emerald-500 text-black border-emerald-400"
                              : "bg-white/5 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
                          )}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sequential Playlist Track */}
          <div className="space-y-6">
            {scenes.map((scene, idx) => {
              const videoUrl = videoData[scene.originalIndex];
              const hasVideo = videoUrl && videoUrl !== 'loading';
              const isPlaying = activeTheaterIndex === idx;

              return (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  className={cn(
                    "flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 relative group overflow-hidden text-left cursor-pointer",
                    isPlaying
                      ? "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.05)]"
                      : "bg-[#050505] border-white/5 hover:border-emerald-500/20"
                  )}
                  onClick={() => selectTheaterScene(idx)}
                >
                  {/* Frame Number */}
                  <div className="flex items-center justify-center w-12 flex-shrink-0">
                    <span className={cn(
                      "text-xs font-black font-mono transition-colors",
                      isPlaying ? "text-emerald-400 animate-pulse" : "text-zinc-600 group-hover:text-zinc-400"
                    )}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Video / Placeholder */}
                  <div className="relative aspect-video w-full md:w-56 bg-black rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center shrink-0 shadow-lg group-hover:border-emerald-500/30 transition-all duration-500 z-10">
                    {hasVideo ? (
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay={isPlaying}
                        muted
                        loop
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-white/[0.01]">
                        <Film className="w-6 h-6" />
                      </div>
                    )}
                    {hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                      </div>
                    )}
                  </div>

                  {/* Scene Info */}
                  <div className="flex-1 space-y-3 relative z-10 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">{scene.section}</h4>
                        {scene.soulFocus && (
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/20 rounded-md">
                            👤 {scene.soulFocus}
                          </span>
                        )}
                        {scene.emotionalKey && (
                          <span className="text-[10px] font-black text-orange-400 bg-orange-500/5 px-2 py-0.5 border border-orange-500/20 rounded-md">
                            🔥 {scene.emotionalKey}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        <span className="text-xs font-black text-zinc-500">{scene.duration || '5s'}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-400 leading-relaxed font-bold uppercase tracking-tight line-clamp-2">
                      {scene.narration}
                    </p>

                    {/* SFX / Soundscape Overlay Cue */}
                    {scene.sound && (
                      <div className="flex items-center gap-2 pt-1">
                        <Volume2 className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] text-zinc-500 font-mono italic">{scene.sound}</span>
                      </div>
                    )}
                  </div>

                  {/* Arrow Indicator */}
                  {idx < scenes.length - 1 && (
                    <div className="hidden md:flex items-center flex-shrink-0 relative z-10">
                      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {!hasVideos && scenes.length > 0 && (
        <div className="text-center py-8 border border-dashed border-white/5 bg-white/[0.01] rounded-3xl max-w-4xl mx-auto">
          <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
            Generate videos from the VIDEO tab to activate full animatic playback
          </p>
        </div>
      )}
    </div>
  );
};

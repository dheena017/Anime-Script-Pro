import React, { useState } from 'react';
import { Film, Play, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  duration: string;
}

interface AnimaticTabProps {
  scenes: Scene[];
  videoData: Record<number, string>;
}

export const AnimaticTab: React.FC<AnimaticTabProps> = ({ scenes, videoData }) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const totalDuration = scenes.reduce((acc, s) => {
    const secs = parseInt(s.duration?.replace(/\D/g, '') || '5');
    return acc + (isNaN(secs) ? 5 : secs);
  }, 0);

  const hasVideos = Object.values(videoData).some(v => v && v !== 'loading');

  return (
    <div className="storyboard-tab-content">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="tab-header-icon-box bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10">
            <Film className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="tab-section-title">Animatic Preview</h2>
            <p className="tab-section-subtitle">
              Sequential frame sequencing with timing overlays
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-black/40 border border-white/5 rounded-2xl">
          <Clock className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Est. Runtime</p>
            <p className="text-sm font-black text-white font-mono">{Math.floor(totalDuration / 60)}m {totalDuration % 60}s</p>
          </div>
        </div>
      </div>

      {scenes.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Film className="w-12 h-12 text-zinc-700 mx-auto" />
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            No frames detected — parse a script to begin the animatic.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scenes.map((scene, idx) => {
            const videoUrl = videoData[scene.originalIndex];
            const hasVideo = videoUrl && videoUrl !== 'loading';
            const isPlaying = playingIndex === idx;

            return (
              <div
                key={scene.id}
                className={cn(
                  "animatic-frame-row group",
                  isPlaying
                    ? "bg-emerald-500/5 border-emerald-500/30"
                    : "bg-white/5 border-white/5 hover:border-emerald-500/20"
                )}
              >
                {/* Frame Number */}
                <div className="flex items-center justify-center w-12 flex-shrink-0">
                  <span className="text-[10px] font-black text-zinc-600 font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Video / Placeholder */}
                <div className="animatic-video-box">
                  {hasVideo ? (
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay={isPlaying}
                      muted
                      loop
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Film className="w-6 h-6" />
                    </div>
                  )}
                  {hasVideo && (
                    <button
                      onClick={() => setPlayingIndex(isPlaying ? null : idx)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-6 h-6 text-white" />
                    </button>
                  )}
                </div>

                {/* Scene Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{scene.section}</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      <span className="text-[9px] font-black text-zinc-500">{scene.duration || '5s'}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">{scene.narration}</p>
                </div>

                {/* Arrow */}
                {idx < scenes.length - 1 && (
                  <div className="flex items-center flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-zinc-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!hasVideos && scenes.length > 0 && (
        <div className="text-center py-6 border border-dashed border-white/10 rounded-3xl">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            Generate videos from the Frame Matrix tab to activate full animatic playback
          </p>
        </div>
      )}
    </div>
  );
};




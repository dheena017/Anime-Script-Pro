import React from 'react';
import { SoundscapeLibrary } from '../../components/Audio/SoundscapeLibrary';
import { Music } from 'lucide-react';

interface Scene {
  id: string;
  section: string;
  sound: string;
  duration: string;
}

interface AudioTabProps {
  scenes?: Scene[];
}

export const AudioTab: React.FC<AudioTabProps> = ({ scenes = [] }) => {
  return (
    <div className="storyboard-tab-content">
      {/* Header */}
      <div className="tab-section-header">
        <div className="tab-header-icon-box bg-blue-500/10 border-blue-500/20 shadow-blue-500/10">
          <Music className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="tab-section-title">Audio Sync</h2>
          <p className="tab-section-subtitle">
            BGM cues, SFX manifests, and soundscape orchestration
          </p>
        </div>
      </div>

      {/* Per-scene sound cues */}
      {scenes.length > 0 && (
        <div className="space-y-6">
          <h3 className="tab-grid-title">
            <Music className="w-3 h-3" /> Scene Sound Manifest
          </h3>
          <div className="space-y-3">
            {scenes.map((scene, i) => (
              <div
                key={scene.id}
                className="flex items-center gap-5 p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all group"
              >
                <span className="text-[9px] font-black text-zinc-600 font-mono w-6 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">{scene.section}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 font-medium">{scene.sound || 'No sound cue specified'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Waveform visualizer bars */}
                  {[2, 4, 3, 5, 2, 4, 3].map((h, j) => (
                    <div
                      key={j}
                      className="w-0.5 bg-blue-500/40 rounded-full group-hover:bg-blue-400/60 transition-all duration-300"
                      style={{ height: `${h * 3}px`, animationDelay: `${j * 100}ms` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-black text-zinc-600 flex-shrink-0">{scene.duration || '5s'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Soundscape Library */}
      <div className="pt-6 border-t border-white/5">
        <SoundscapeLibrary />
      </div>
    </div>
  );
};





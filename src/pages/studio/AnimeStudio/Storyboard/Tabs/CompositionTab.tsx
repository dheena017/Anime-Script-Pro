import React from 'react';
import { Layers } from 'lucide-react';
import { SceneTimeline } from '../components/SceneTimeline';
import { Moodboard } from '../../components/Moodboard/Moodboard';
import { SoundscapeLibrary } from '../../components/Audio/SoundscapeLibrary';

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
}

interface CompositionTabProps {
  scenes: Scene[];
}

export const CompositionTab: React.FC<CompositionTabProps> = ({ scenes }) => {
  return (
    <div className="py-10 space-y-16">
      {/* Header */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <Layers className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Composition Suite</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Scene timeline, visual moodboard, and spatial arrangement
          </p>
        </div>
      </div>

      {/* Scene Timeline */}
      {scenes.length > 0 ? (
        <SceneTimeline scenes={scenes} />
      ) : (
        <div className="py-10 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            No scenes found — generate a script and parse the storyboard first.
          </p>
        </div>
      )}

      {/* Moodboard + Soundscape side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-white/5">
        <Moodboard />
        <SoundscapeLibrary />
      </div>
    </div>
  );
};

import { Music } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Scene } from './types';

interface StoryboardScriptViewProps {
  scenes: Scene[];
  calculateDuration: (narration: string) => number;
  highlightNarrative: (text: string) => ReactNode;
}

export function StoryboardScriptView({ scenes, calculateDuration, highlightNarrative }: StoryboardScriptViewProps) {
  return (
    <div className="bg-zinc-950 p-12 md:p-24 rounded-3xl border border-white/5 font-mono text-zinc-300 max-w-4xl mx-auto space-y-16 shadow-2xl">
      <div className="text-center border-b border-white/5 pb-10">
        <h1 className="text-2xl font-bold text-zinc-100 uppercase tracking-[0.3em] mb-2">Production Script</h1>
        <p className="text-[10px] text-zinc-500">VERSION 1.0 - {new Date().toLocaleDateString()}</p>
      </div>
      {scenes.map((scene, index) => (
        <div key={scene.id} className="space-y-6 relative">
          <div className="absolute -left-12 text-[10px] text-zinc-700 font-bold">SC {index + 1}</div>
          <div className="text-zinc-500 uppercase flex items-center gap-4">
            <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">{scene.section}</span>
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[10px] font-mono text-zinc-600">{calculateDuration(scene.narration)} SEC</span>
          </div>
          <div className="pl-6 space-y-6">
            <p className="text-zinc-400 italic font-serif text-lg leading-relaxed">{scene.visuals.toUpperCase()}</p>
            <div className="mx-auto max-w-md text-center py-4">
              <p className="text-zinc-500 uppercase text-xs mb-2 tracking-widest font-bold">Dialogue</p>
              <p className="text-zinc-100 text-xl leading-relaxed uppercase tracking-tight">{highlightNarrative(scene.narration)}</p>
            </div>
            <p className="text-blue-500/40 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
              <Music className="w-3 h-3" /> {scene.sound}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

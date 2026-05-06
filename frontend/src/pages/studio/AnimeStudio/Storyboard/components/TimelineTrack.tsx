import React from 'react';
import { Zap, Play } from 'lucide-react';

interface Scene {
  id: string;
  section: string;
  duration: string;
}

interface TimelineTrackProps {
  scenes: Scene[];
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({ scenes }) => {
  return (
    <div className="relative h-20 bg-[#050505] rounded-2xl border border-studio/10 p-4 flex items-center gap-1 overflow-x-auto no-scrollbar group shadow-inner">
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
      
      {scenes.length > 0 ? (
        scenes.map((scene, idx) => (
          <div 
            key={scene.id}
            className="group/item relative h-full flex-1 min-w-[120px] rounded-lg bg-zinc-900/50 border border-white/5 hover:border-studio/30 transition-all flex flex-col justify-center px-4 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-studio/20 group-hover/item:bg-studio transition-colors" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] font-black text-studio uppercase tracking-tighter">BEAT {idx + 1}</span>
              <span className="text-[8px] font-mono text-zinc-500">{scene.duration}</span>
            </div>
            <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-tight line-clamp-1">{scene.section}</p>
            
            <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
               <Play className="w-3 h-3 text-studio fill-current" />
            </div>
          </div>
        ))
      ) : (
        <div className="flex-1 flex items-center justify-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic">
           Awaiting Production Master...
        </div>
      )}
      
      {scenes.length > 0 && (
        <div className="min-w-[60px] h-full rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-zinc-700 hover:text-studio hover:border-studio/30 transition-colors cursor-pointer">
           <Zap className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

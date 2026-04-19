import React from 'react';
import { Timer, Zap, Play, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scene {
  id: string;
  section: string;
  duration: string;
}

interface SceneTimelineProps {
  scenes: Scene[];
}

export const SceneTimeline: React.FC<SceneTimelineProps> = ({ scenes }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <Timer className="w-4 h-4" />
          Production Timeline
        </h3>
        <div className="flex items-center gap-4 text-[9px] font-bold text-cyan-500/60 uppercase tracking-widest">
           <span>Total: {scenes.length * 5}s Estimated</span>
           <div className="w-[1px] h-3 bg-zinc-800" />
           <span>6 Master Beats</span>
        </div>
      </div>

      <div className="relative h-20 bg-[#050505] rounded-2xl border border-cyan-500/10 p-4 flex items-center gap-1 overflow-x-auto no-scrollbar group shadow-inner">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        
        {scenes.length > 0 ? (
          scenes.map((scene, idx) => (
            <div 
              key={scene.id}
              className="group/item relative h-full flex-1 min-w-[120px] rounded-lg bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-center px-4 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/20 group-hover/item:bg-cyan-500 transition-colors" />
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-black text-cyan-400 uppercase tracking-tighter">BEAT {idx + 1}</span>
                <span className="text-[8px] font-mono text-zinc-500">{scene.duration}</span>
              </div>
              <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-tight line-clamp-1">{scene.section}</p>
              
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                 <Play className="w-3 h-3 text-cyan-400 fill-current" />
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic">
             Awaiting Production Master...
          </div>
        )}
        
        {scenes.length > 0 && (
          <div className="min-w-[60px] h-full rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-zinc-700 hover:text-cyan-500 hover:border-cyan-500/30 transition-colors cursor-pointer">
             <Zap className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

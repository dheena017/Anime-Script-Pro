import React from 'react';
import { Clapperboard, Volume2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Scene } from './types';

interface ScreeningTimelineProps {
  scenes: Scene[];
  isLoading: boolean;
}

export const ScreeningTimeline: React.FC<ScreeningTimelineProps> = ({
  scenes,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl mb-4">
        <span className="text-xs font-black text-studio uppercase tracking-[0.3em]">Master Manifest</span>
        <div className="flex gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
           <div className="w-1.5 h-1.5 rounded-full bg-studio/40" />
           <div className="w-1.5 h-1.5 rounded-full bg-studio/40" />
        </div>
      </div>
      <ScrollArea className="h-[700px] border border-zinc-800 rounded-3xl bg-black/40 backdrop-blur-md">
        <div className="p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 bg-zinc-900/50 rounded-2xl animate-pulse" />
            ))
          ) : scenes.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <Clapperboard className="w-10 h-10 text-zinc-800 mx-auto" />
              <p className="text-xs text-zinc-600 uppercase font-black tracking-widest">No scenes sync'd to manifest</p>
            </div>
          ) : (
            scenes.map((scene, idx) => (
              <div 
                key={scene.id}
                className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-studio/40 transition-all group flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-black border border-zinc-800 rounded-xl flex items-center justify-center text-xs font-black text-zinc-500 group-hover:text-studio transition-colors">
                  {scene.scene_number}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-studio uppercase tracking-[0.2em]">Unit-ID: {idx + 1}00X</span>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-2.5 h-2.5 text-zinc-600" />
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-md font-black uppercase tracking-tighter",
                        scene.status === 'SYNCED' ? "bg-studio/10 text-studio border border-studio/20" : "bg-green-500/10 text-green-500 border border-green-500/20"
                      )}>{scene.status}</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-zinc-300 line-clamp-2 leading-relaxed">
                    {scene.script || "Scene pattern generated..."}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};




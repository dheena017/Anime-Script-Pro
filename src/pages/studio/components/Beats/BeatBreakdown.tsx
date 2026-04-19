import React from 'react';
import { Timer, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Beat {
  label: string;
  duration: string;
  description: string;
}

interface BeatBreakdownProps {
  selectedBeat: string;
  beats: Beat[];
  onApply: () => void;
}

export const BeatBreakdown: React.FC<BeatBreakdownProps> = ({
  selectedBeat,
  beats,
  onApply
}) => {
  return (
    <div className="space-y-4">
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-cyan-500" />
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-300">Phase Breakdown: {selectedBeat}</h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {beats.map((beat, idx) => (
              <div key={idx} className="group flex gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-cyan-500/30 transition-colors">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-black text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                    {idx + 1}
                  </div>
                  {idx < beats.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-800 mt-2" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-wider text-cyan-50">{beat.label}</p>
                    <p className="text-[10px] font-mono text-cyan-500/80 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20">{beat.duration}</p>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{beat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fuchsia-500" />
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-300">Pro Tips</h4>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-transparent border border-fuchsia-500/20 space-y-4">
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-fuchsia-400">Pacing</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                "Ensure the transition between beats 3 and 4 contains a 'false peak' if you're aiming for high-retention anime recaps."
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-widest text-fuchsia-400">Visuals</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                "Each beat should have at least one 'anchor visual' that gets described in your script details later."
              </p>
            </div>
            <Button 
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-widest text-[10px] h-9 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
              onClick={onApply}
            >
              Apply Structure Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

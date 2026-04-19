import React from 'react';
import { Music, Play, Volume2, Sparkles, Disc, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MOCK_TRACKS = [
  { name: 'Neon Horizon', genre: 'Synthwave', bpm: 120, mood: 'Action' },
  { name: 'Midnight Duel', genre: 'Orchestral', bpm: 140, mood: 'Tense' },
  { name: 'Cherry Blossom', genre: 'Lo-Fi', bpm: 80, mood: 'Slice of Life' },
  { name: 'Digital Soul', genre: 'Cyberpunk', bpm: 128, mood: 'Dynamic' },
];

export const SoundscapeLibrary: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <Music className="w-4 h-4 text-studio" />
          AI Soundscape Curation
        </h3>
        <Badge variant="outline" className="text-[8px] border-studio/20 text-studio bg-studio/5">
           Beta: Audio Engine v1
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MOCK_TRACKS.map((track) => (
          <Card key={track.name} className="bg-[#050505] border-zinc-800 p-3 hover:border-studio/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-studio/5">
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-studio transition-colors">
                  <Play className="w-4 h-4 fill-current" />
               </div>
               <div className="flex-1">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-widest leading-none">{track.name}</h4>
                  <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter mt-1">
                    {track.genre} • {track.bpm} BPM • {track.mood}
                  </p>
               </div>
               <div className="flex flex-col items-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <Activity className="w-3 h-3 text-zinc-500" />
                  <span className="text-[7px] text-zinc-600 font-mono">03:42</span>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <Disc className="w-full h-full text-white animate-spin-slow" />
            </div>
          </Card>
        ))}
      </div>
      
      <Button className="w-full h-10 bg-[#0a0a0a] border border-studio/10 text-[9px] font-black uppercase tracking-widest text-studio hover:bg-studio/10 hover:border-studio/30 transition-all">
         Refresh AI Curation <Sparkles className="w-3 h-3 ml-2" />
      </Button>
    </div>
  );
};

const Badge = ({ children, variant, className }: any) => (
  <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter", className)}>
    {children}
  </span>
);

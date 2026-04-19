import React from 'react';
import { Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Moodboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Production Moodboard
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase tracking-[0.2em] text-cyan-500 hover:text-cyan-400">
          Capture Vibe <Sparkles className="w-3 h-3 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((id) => (
          <Card key={id} className="aspect-square bg-[#0a0a0a] border-zinc-800 overflow-hidden relative group cursor-pointer hover:border-cyan-500/30 transition-all">
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 opacity-20 group-hover:opacity-100 transition-opacity">
               <Camera className="w-6 h-6 text-zinc-600 group-hover:text-cyan-500" />
               <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700 group-hover:text-cyan-700">Empty Frame</span>
            </div>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-zinc-700" />
            <div className="absolute bottom-2 left-2 right-2 h-[1px] bg-zinc-900" />
          </Card>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Palette, Brush } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const StylePromptsTab: React.FC = () => {
  const styles = [
    { name: 'Makoto Shinkai', desc: 'Lush lighting, hyper-detailed backgrounds, emotional atmosphere.', icon: '✨' },
    { name: 'Ufotable', desc: 'Dynamic digital effects, high-contrast action, cinematic lighting.', icon: '⚔️' },
    { name: 'Studio Ghibli', desc: 'Painterly textures, naturalistic palettes, whimsical charm.', icon: '🪵' },
    { name: 'MAPPA', desc: 'Grit, realistic character designs, fluid animation sequences.', icon: '🎬' },
  ];

  return (
    <div className="py-10 space-y-16">
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <Palette className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Visual Style Guide</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Visual signature orchestration and aesthetic parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {styles.map((style, i) => (
          <Card key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-amber-500/20 transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl">{style.icon}</span>
              <div className="w-2 h-2 rounded-full bg-amber-500/50" />
            </div>
            <h4 className="text-lg font-black text-white uppercase tracking-widest mb-3">{style.name}</h4>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">{style.desc}</p>
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="w-8 h-8 rounded-full border border-black bg-zinc-800" />
                ))}
              </div>
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Style Nodes Configured</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-10 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 text-center">
        <Brush className="w-12 h-12 text-amber-500/20" />
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Master Aesthetic Engine</h4>
          <p className="text-[10px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Select a base style to inject specific tokens into your image prompts for consistent visual storytelling.
          </p>
        </div>
      </Card>
    </div>
  );
};




import React from 'react';
import { ShieldAlert, Ban, Info, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const NegativePromptsTab: React.FC = () => {
  const constraints = [
    { label: 'Malformed Anatomy', active: true },
    { label: 'Low Resolution', active: true },
    { label: 'Text Overlays', active: true },
    { label: 'Motion Blur', active: true },
    { label: 'Inconsistent Lighting', active: false },
    { label: 'Distorted Backgrounds', active: true },
    { label: 'Duplicate Objects', active: false },
  ];

  return (
    <div className="py-10 space-y-16">
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.1)]">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Negative DNA</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">
            Constraint clusters and quality filters for neural generation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Ban className="w-3 h-3" /> Master Negative Cluster
          </h3>
          <Card className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] min-h-[300px]">
            <p className="text-sm font-mono text-zinc-400 leading-loose">
              lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bad feet, malformed limbs, fused fingers, too many fingers, long neck, cross-eyed, mutated hands, polar lowres, bad body, bad proportions, gross proportions, liquid body, realistic, photo, 3d, render
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3 h-3" /> Active Constraints
          </h3>
          <div className="space-y-2">
            {constraints.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#080808] border border-white/5 rounded-2xl">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{c.label}</span>
                <div className={cn("w-2 h-2 rounded-full", c.active ? "bg-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "bg-zinc-800")} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="p-8 border border-dashed border-rose-500/20 bg-rose-500/5 rounded-[2rem] flex items-center gap-6">
        <AlertTriangle className="w-8 h-8 text-rose-500/40" />
        <p className="text-xs text-zinc-500 font-medium leading-relaxed uppercase tracking-wider">
          Negative prompts are applied across all scenes to maintain quality.
        </p>
      </Card>
    </div>
  );
};




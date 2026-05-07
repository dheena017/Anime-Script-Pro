import React from 'react';
import { Users, Fingerprint, Brain, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CastEmptyStateProps {
  onLaunch: () => void;
  onLoadDemo?: () => void;
  isGenerating: boolean;
}

const features = [
  { icon: Fingerprint, title: 'DNA Synthesis', description: 'Unique personality markers and backstories' },
  { icon: Brain, title: 'Cognitive Mapping', description: 'AI determines relationship dynamics and arcs' },
  { icon: ShieldCheck, title: 'Integrity Audit', description: 'Checks cast consistency against the story core' },
];

export const CastEmptyState: React.FC<CastEmptyStateProps> = ({
  onLaunch,
  onLoadDemo,
  isGenerating
}) => {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center gap-8 min-h-[620px]">
      <div className="w-full max-w-3xl rounded-[2rem] border border-cyan-500/20 bg-[#050505] px-8 py-14 text-center backdrop-blur-sm shadow-[0_0_60px_rgba(6,182,212,0.08)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent" />

        <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-500/20 bg-cyan-500/5">
          <Users className="h-10 w-10 text-cyan-400" />
        </div>

        <div className="relative mb-6">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/80">Character Designer</p>
          <h2 className="text-4xl font-black uppercase tracking-[0.12em] text-white drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            Build Your Cast
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 leading-relaxed">
            Your cast registry is empty. Generate characters, relationships, and deep trait analysis to bring your story’s people to life.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button
            onClick={onLaunch}
            disabled={isGenerating}
            className="h-12 rounded-full bg-cyan-500 px-8 text-[10px] font-black uppercase tracking-[0.22em] text-black hover:bg-cyan-400 transition-all shadow-[0_0_24px_rgba(6,182,212,0.18)]"
          >
            {isGenerating ? 'Synthesizing Cast...' : 'Create My Cast'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {!isGenerating && onLoadDemo && (
            <Button
              variant="outline"
              onClick={onLoadDemo}
              className="h-12 rounded-full border border-white/10 bg-white/5 px-8 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Load Demo Cast
            </Button>
          )}
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <p className="mb-4 text-[9px] font-black uppercase tracking-[0.26em] text-zinc-500">Cast Generation Modules</p>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 text-left">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-black/30">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-white">{feature.title}</h3>
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};





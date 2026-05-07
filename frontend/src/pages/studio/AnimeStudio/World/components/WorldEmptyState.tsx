import React from 'react';
import { Globe, Map, Book, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorldEmptyStateProps {
  onLaunch: () => void;
  onLoadDemo?: () => void;
  isGenerating: boolean;
}

export const WorldEmptyState: React.FC<WorldEmptyStateProps> = ({
  onLaunch,
  onLoadDemo,
  isGenerating
}) => {
  const features = [
    { icon: Map, title: 'Geographic Synthesis', description: 'AI manifests terrain, climates, and strategic points', color: 'text-cyan-400', bgColor: 'bg-cyan-500/5', borderColor: 'border-cyan-500/20' },
    { icon: Book, title: 'Lore Generation', description: 'Auto-generates historical timelines and cultural norms', color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/5', borderColor: 'border-fuchsia-500/20' },
    { icon: Shield, title: 'Rule Definition', description: 'Defines the metaphysical and physical laws of reality', color: 'text-amber-400', bgColor: 'bg-amber-500/5', borderColor: 'border-amber-500/20' }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="w-full py-20 flex items-center justify-center min-h-[500px]">
        <div className="w-full max-w-3xl rounded-[2rem] border border-studio/20 bg-gradient-to-br from-[#050505] to-studio/5 px-8 py-16 text-center backdrop-blur-sm" style={{ boxShadow: '0 0 60px rgba(6, 182, 212, 0.06)' }}>
          {/* Icon Container with Glow */}
          <div className="mx-auto mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-3xl bg-studio/10 border border-studio/20 animate-pulse blur-xl" />
            </div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-studio/30 bg-studio/5">
              <Globe className="h-12 w-12 text-studio animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-3xl font-black uppercase tracking-tighter text-white">
            Build Your World
          </h1>
          
          {/* Description */}
          <p className="mb-8 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 max-w-md mx-auto leading-relaxed">
            Your story's foundation is currently empty. Generate your world to see its history, geography, and laws come to life.
          </p>

          {/* Primary Action Button */}
          <div className="mb-8 flex flex-col gap-4 items-center justify-center">
            <Button 
              onClick={onLaunch}
              disabled={isGenerating}
              className="bg-studio hover:bg-studio/90 text-black font-black uppercase tracking-widest text-[11px] px-10 py-6 h-auto rounded-full gap-2 group transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Crafting Your World...
                </>
              ) : (
                <>
                  Create My World
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {!isGenerating && onLoadDemo && (
              <Button 
                variant="ghost" 
                onClick={onLoadDemo}
                className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 hover:text-studio transition-all gap-2 hover:bg-studio/10"
              >
                <Sparkles className="w-3 h-3" />
                Load Aetheria Demo World
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Info Text */}
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            🚀 AI-powered world generation comes next
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
        {features.map((feature, index) => {
          const Feature = feature.icon;
          return (
            <div 
              key={index}
              className={`p-6 rounded-2xl border ${feature.borderColor} ${feature.bgColor} backdrop-blur-sm transition-all hover:border-opacity-100 hover:bg-opacity-10`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`mb-4 inline-flex p-3 rounded-xl ${feature.bgColor} border ${feature.borderColor}`}>
                <Feature className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="mb-2 font-black text-sm uppercase tracking-tight text-white">
                {feature.title}
              </h3>
              <p className="text-[10px] font-bold text-zinc-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};





import React from 'react';
import { Sparkles, History, Zap, Users, Building2, Map, Globe, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorldTab } from '../tabs/WorldTabs';

interface SpecializedTabEmptyStateProps {
  tab: Exclude<WorldTab, 'manifest'>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const TAB_CONFIG: Record<Exclude<WorldTab, 'manifest'>, { 
  label: string;
  color: string;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  shadowColor: string;
  description: string;
  icon: React.ReactNode;
}> = {
  lore: {
    label: 'Historical Timeline',
    color: 'text-fuchsia-400',
    accentColor: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/20',
    bgColor: 'bg-fuchsia-500/5',
    shadowColor: 'rgba(217, 70, 239, 0.1)',
    description: 'Expand your world\'s history with eras and legendary events.',
    icon: <History className="w-10 h-10" />
  },
  powers: {
    label: 'Power System',
    color: 'text-amber-400',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/5',
    shadowColor: 'rgba(250, 204, 21, 0.1)',
    description: 'Define mechanics, tiers, and limitations of your world\'s powers.',
    icon: <Zap className="w-10 h-10" />
  },
  factions: {
    label: 'Faction Politics',
    color: 'text-blue-400',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/5',
    shadowColor: 'rgba(59, 130, 246, 0.1)',
    description: 'Create complex relationships between world factions and ideologies.',
    icon: <Users className="w-10 h-10" />
  },
  architecture: {
    label: 'Visual Style',
    color: 'text-orange-400',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    bgColor: 'bg-orange-500/5',
    shadowColor: 'rgba(249, 115, 22, 0.1)',
    description: 'Define the architectural aesthetic and visual motifs of your world.',
    icon: <Building2 className="w-10 h-10" />
  },
  atlas: {
    label: 'World Atlas',
    color: 'text-cyan-400',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    bgColor: 'bg-cyan-500/5',
    shadowColor: 'rgba(34, 211, 238, 0.1)',
    description: 'Map out the physical geography, biomes, and regional boundaries.',
    icon: <Map className="w-10 h-10" />
  },
  culture: {
    label: 'Societal Ethos',
    color: 'text-rose-400',
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500/20',
    bgColor: 'bg-rose-500/5',
    shadowColor: 'rgba(244, 63, 94, 0.1)',
    description: 'Profile the rituals, daily life, and cultural traditions of your people.',
    icon: <Globe className="w-10 h-10" />
  },
  systems: {
    label: 'World Dynamics',
    color: 'text-emerald-400',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
    shadowColor: 'rgba(16, 185, 129, 0.1)',
    description: 'Define ecosystems, signature technology, and mechanical systems.',
    icon: <Cpu className="w-10 h-10" />
  }
};

export const SpecializedTabEmptyState: React.FC<SpecializedTabEmptyStateProps> = ({
  tab,
  onGenerate,
  isGenerating
}) => {
  const config = TAB_CONFIG[tab];

  return (
    <div className="w-full py-20 flex items-center justify-center min-h-[500px]">
      <div 
        className={`w-full max-w-3xl rounded-[2rem] border ${config.borderColor} bg-[#050505] px-8 py-16 text-center backdrop-blur-sm`}
        style={{ boxShadow: `0 0 60px ${config.shadowColor}` }}
      >
        {/* Icon Container with Pulse */}
        <div className="mx-auto mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`h-20 w-20 rounded-3xl ${config.bgColor} border ${config.borderColor} animate-pulse`} />
          </div>
          <div className={`relative flex h-20 w-20 items-center justify-center rounded-3xl border ${config.borderColor} ${config.bgColor} ${config.color}`}>
            {config.icon}
          </div>
        </div>

        {/* Title */}
        <h2 className={`mb-4 text-2xl font-black uppercase tracking-tight ${config.accentColor}`}>
          {config.label}
        </h2>

        {/* Description */}
        <p className="mb-8 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 max-w-md mx-auto leading-relaxed">
          {config.description}
        </p>

        {/* Divider */}
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`${config.bgColor} ${config.color} border ${config.borderColor} rounded-full px-8 py-6 h-auto font-black uppercase tracking-widest text-[10px] gap-2 group transition-all hover:bg-opacity-10`}
        >
          {isGenerating ? (
            <>
              <div className={`w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin`} />
              Generating {config.label}...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Generate {config.label}
            </>
          )}
        </Button>

        {/* Info Text */}
        <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          💡 AI will create this section based on your world foundation
        </p>
      </div>
    </div>
  );
};

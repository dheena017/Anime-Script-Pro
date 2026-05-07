import React from 'react';
import {
  Fingerprint,
  Users,
  ShieldCheck,
  UserPlus,
  Dna,
  Workflow,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type CastTab = 'matrix' | 'registry' | 'integrity' | 'add-lead' | 'dna' | 'dynamics' | 'characters';

interface CastTabsProps {
  activeTab: CastTab;
  setActiveTab: (tab: CastTab) => void;
  loadingStates?: Partial<Record<CastTab, boolean>>;
}

const GLOW_COLORS: Record<CastTab, string> = {
  registry: 'bg-studio',
  characters: 'bg-cyan-400',
  matrix: 'bg-fuchsia-400',
  dna: 'bg-blue-400',
  dynamics: 'bg-rose-400',
  integrity: 'bg-emerald-400',
  'add-lead': 'bg-amber-400',
};

const UNDERLINE_COLORS: Record<CastTab, string> = {
  registry: 'from-studio/0 via-studio to-studio/0',
  characters: 'from-cyan-400/0 via-cyan-400 to-cyan-400/0',
  matrix: 'from-fuchsia-400/0 via-fuchsia-400 to-fuchsia-400/0',
  dna: 'from-blue-400/0 via-blue-400 to-blue-400/0',
  dynamics: 'from-rose-400/0 via-rose-400 to-rose-400/0',
  integrity: 'from-emerald-400/0 via-emerald-400 to-emerald-400/0',
  'add-lead': 'from-amber-400/0 via-amber-400 to-amber-400/0',
};

export const CastTabs: React.FC<CastTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {}
}) => {
  const tabs: { id: CastTab; label: string; icon: any; color: string }[] = [
    { id: 'registry', label: 'Registry', icon: Users, color: 'text-studio' },
    { id: 'characters', label: 'Manifest', icon: Fingerprint, color: 'text-cyan-400' },
    { id: 'matrix', label: 'Matrix', icon: Workflow, color: 'text-fuchsia-400' },
    { id: 'dna', label: 'Trait Analysis', icon: Dna, color: 'text-blue-400' },
    { id: 'dynamics', label: 'Dynamics', icon: Zap, color: 'text-rose-400' },
    { id: 'integrity', label: 'Integrity', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'add-lead', label: 'Add Lead', icon: UserPlus, color: 'text-amber-400' },
  ];

  return (
    <div className="tabs-nav-container group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]" />

      {tabs.map((tab) => {
        const loading = loadingStates[tab.id] || false;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "tabs-nav-button group/tab",
              isActive ? tab.color : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="cast-tab-glow"
                className={cn("storyboard-tab-glow", GLOW_COLORS[tab.id])}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="cast-tab-bg"
                className="absolute inset-0 rounded-xl bg-white/[0.04] border border-white/10"
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}

            <div className="flex items-center gap-2 relative z-10">
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin" />
              ) : (
                <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-300", isActive ? "opacity-100 scale-110" : "opacity-40 group-hover/tab:opacity-70 group-hover/tab:scale-105")} />
              )}
              <span>{tab.label}</span>
            </div>

            {isActive && (
              <motion.div
                layoutId="cast-tab-underline"
                className={cn("absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r rounded-full", UNDERLINE_COLORS[tab.id])}
                style={{ filter: 'blur(0.5px)', opacity: 0.7 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}

            {loading && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full animate-pulse z-20" />
            )}
          </button>
        );
      })}
    </div>
  );
};

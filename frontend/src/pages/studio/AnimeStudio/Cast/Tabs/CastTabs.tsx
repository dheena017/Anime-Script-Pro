import React from 'react';
import { Users, Mic2, Swords, TrendingUp, GitBranch, Layout, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type CastTab = 'registry' | 'voice' | 'combat' | 'arcs' | 'dynamics' | 'relationships' | 'technical';

interface CastTabsProps {
  activeTab: CastTab;
  setActiveTab: (tab: CastTab) => void;
  loadingStates?: Partial<Record<CastTab, boolean>>;
}

const TABS: { id: CastTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'registry',      label: 'IDENTITY',      icon: Users,       color: 'text-studio',    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'     },
  { id: 'voice',         label: 'VOICE',          icon: Mic2,        color: 'text-cyan-400',  glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]'    },
  { id: 'combat',        label: 'COMBAT',         icon: Swords,      color: 'text-red-400',   glow: 'shadow-[0_0_15px_rgba(248,113,113,0.3)]'   },
  { id: 'arcs',          label: 'ARCS',           icon: TrendingUp,  color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(192,38,211,0.3)]'  },
  { id: 'dynamics',      label: 'DYNAMICS',       icon: GitBranch,   color: 'text-orange-400', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]'   },
  { id: 'relationships', label: 'RELATIONSHIPS',  icon: Workflow,    color: 'text-pink-400',  glow: 'shadow-[0_0_15px_rgba(244,114,182,0.3)]'   },
  { id: 'technical',     label: 'TECHNICAL',      icon: Layout,      color: 'text-indigo-400', glow: 'shadow-[0_0_15px_rgba(129,140,248,0.3)]'  },
];

export const CastTabs: React.FC<CastTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {}
}) => {
  return (
    <div className="flex items-center gap-1 bg-black/50 border border-white/10 p-1.5 rounded-full backdrop-blur-xl shadow-2xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {TABS.map((tab) => {
        const loading = loadingStates[tab.id] || false;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-5 py-2 text-[10px] font-black tracking-[0.2em] transition-all duration-500 uppercase flex items-center gap-2.5",
              isActive ? tab.color : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {/* Per-tab color neon glow pill */}
            {isActive && (
              <motion.div
                layoutId="cast-active-pill"
                className={cn(
                  "absolute inset-0 bg-white/10 border border-white/20 rounded-full z-0",
                  tab.glow
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2.5">
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin" />
              ) : (
                <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-500", isActive ? "opacity-100 scale-110" : "opacity-40")} />
              )}
              <span className="hidden md:inline">{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

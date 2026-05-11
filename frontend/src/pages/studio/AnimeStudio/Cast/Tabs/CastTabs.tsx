import React from 'react';
import { Users, Mic2, Swords, TrendingUp, GitBranch, Layout, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { castStyles as s } from '../castStyles';

export type CastTab = 'registry' | 'voice' | 'combat' | 'arcs' | 'dynamics' | 'relationships' | 'technical';

interface CastTabsProps {
  activeTab: CastTab;
  setActiveTab: (tab: CastTab) => void;
  loadingStates?: Partial<Record<CastTab, boolean>>;
}

const TABS: { id: CastTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'registry',      label: 'IDENTITY',      icon: Users,       color: 'text-studio',    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'     },
  { id: 'voice',         label: 'VOICE',          icon: Mic2,        color: 'text-cyan-400',  glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]'    },
  { id: 'combat',        label: 'COMBAT',         icon: Swords,      color: 'text-red-400',   glow: 'shadow-[0_0_15_rgba(248,113,113,0.3)]'   },
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
    <div className={s.tabs.container}>
      <div className={s.tabs.overlay} />

      {TABS.map((tab) => {
        const loading = loadingStates[tab.id] || false;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(s.tabs.button, isActive ? s.tabs.buttonActive : s.tabs.buttonInactive)}
          >
            {/* Per-tab color neon glow pill */}
            {isActive && (
              <motion.div
                layoutId="cast-active-pill"
                className={cn(s.tabs.pill, tab.glow)}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2.5">
              {loading ? (
                <div className={s.tabs.spinner} />
              ) : (
                <tab.icon className={cn(s.tabs.icon, isActive ? s.tabs.iconActive : s.tabs.iconInactive)} />
              )}
              <span className={s.tabs.label}>{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

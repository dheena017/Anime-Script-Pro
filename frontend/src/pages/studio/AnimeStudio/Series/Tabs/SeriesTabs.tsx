import React from 'react';
import { Film, ListChecks, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { seriesStyles as s } from '../seriesStyles';

export type SeriesTab = 'roadmap' | 'episodes' | 'blueprint' | 'assets';

interface SeriesTabsProps {
  activeTab: SeriesTab;
  setActiveTab: (tab: SeriesTab) => void;
  loadingStates?: Partial<Record<SeriesTab, boolean>>;
}

const TABS: { id: SeriesTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'episodes', label: 'EPISODES', icon: Film,       color: 'text-cyan-400',    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]'   },
  { id: 'roadmap',  label: 'SCENES',   icon: ListChecks, color: 'text-studio',      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'    },
  { id: 'assets',   label: 'ASSETS',   icon: Box,        color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]'   },
];

export const SeriesTabs: React.FC<SeriesTabsProps> = ({
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
            {isActive && (
              <motion.div
                layoutId="series-active-pill"
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

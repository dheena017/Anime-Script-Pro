import React from 'react';
import { ListChecks, Film, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type SeriesTab = 'roadmap' | 'episodes' | 'blueprint' | 'assets';

interface SeriesTabsProps {
  activeTab: SeriesTab;
  setActiveTab: (tab: SeriesTab) => void;
}

const TABS: { id: SeriesTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'episodes', label: 'EPISODES', icon: Film,       color: 'text-cyan-400',    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]'   },
  { id: 'roadmap',  label: 'SCENES',   icon: ListChecks, color: 'text-studio',      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'    },
  { id: 'assets',   label: 'ASSETS',   icon: Box,        color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]'   },
];

export const SeriesTabs: React.FC<SeriesTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="flex items-center gap-1 bg-black/50 border border-white/10 p-1.5 rounded-full backdrop-blur-xl shadow-2xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {TABS.map((tab) => {
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
                layoutId="series-active-pill"
                className={cn(
                  "absolute inset-0 bg-white/10 border border-white/20 rounded-full z-0",
                  tab.glow
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2.5">
              <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-500", isActive ? "opacity-100 scale-110" : "opacity-40")} />
              <span className="hidden md:inline">{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

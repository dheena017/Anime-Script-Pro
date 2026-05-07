import React from 'react';
import { 
  ListChecks, 
  Film,
  Network, 
  GitMerge, 
  Box, 
  Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type SeriesTab = 'roadmap' | 'episodes' | 'blueprint' | 'arcs' | 'assets' | 'timeline';

interface SeriesTabsProps {
  activeTab: SeriesTab;
  setActiveTab: (tab: SeriesTab) => void;
}

const GLOW_COLORS: Record<SeriesTab, string> = {
  roadmap: 'bg-studio',
  episodes: 'bg-cyan-400',
  blueprint: 'bg-amber-400',
  arcs: 'bg-fuchsia-400',
  assets: 'bg-emerald-400',
  timeline: 'bg-blue-400',
};

const UNDERLINE_COLORS: Record<SeriesTab, string> = {
  roadmap: 'from-studio/0 via-studio to-studio/0',
  episodes: 'from-cyan-400/0 via-cyan-400 to-cyan-400/0',
  blueprint: 'from-amber-400/0 via-amber-400 to-amber-400/0',
  arcs: 'from-fuchsia-400/0 via-fuchsia-400 to-fuchsia-400/0',
  assets: 'from-emerald-400/0 via-emerald-400 to-emerald-400/0',
  timeline: 'from-blue-400/0 via-blue-400 to-blue-400/0',
};

export const SeriesTabs: React.FC<SeriesTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: SeriesTab; label: string; icon: any; color: string }[] = [
    { id: 'roadmap', label: 'Roadmap', icon: ListChecks, color: 'text-studio' },
    { id: 'episodes', label: 'Episodes', icon: Film, color: 'text-cyan-400' },
    { id: 'blueprint', label: 'Blueprint', icon: Network, color: 'text-amber-400' },
    { id: 'arcs', label: 'Arcs', icon: GitMerge, color: 'text-fuchsia-400' },
    { id: 'assets', label: 'Assets', icon: Box, color: 'text-emerald-400' },
    { id: 'timeline', label: 'Timeline', icon: Clock, color: 'text-blue-400' },
  ];

  return (
    <div className="tabs-nav-container group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]" />

      {tabs.map((tab) => {
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
                layoutId="series-tab-glow"
                className={cn("storyboard-tab-glow", GLOW_COLORS[tab.id])}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="series-tab-bg"
                className="absolute inset-0 rounded-xl bg-white/[0.04] border border-white/10"
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}

            <div className="flex items-center gap-2 relative z-10">
              <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-300", isActive ? "opacity-100 scale-110" : "opacity-40 group-hover/tab:opacity-70 group-hover/tab:scale-105")} />
              <span>{tab.label}</span>
            </div>

            {isActive && (
              <motion.div
                layoutId="series-tab-underline"
                className={cn("absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r rounded-full", UNDERLINE_COLORS[tab.id])}
                style={{ filter: 'blur(0.5px)', opacity: 0.7 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

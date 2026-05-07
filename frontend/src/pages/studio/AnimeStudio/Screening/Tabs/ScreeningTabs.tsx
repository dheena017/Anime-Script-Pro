import React from 'react';
import { Monitor, Film, Play, History, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type ScreeningTab = 'preview' | 'sequences' | 'dailies' | 'archives' | 'exports';

interface ScreeningTabsProps {
  activeTab: ScreeningTab;
  setActiveTab: (tab: ScreeningTab) => void;
}

const GLOW_COLORS: Record<ScreeningTab, string> = {
  preview: 'bg-studio',
  sequences: 'bg-emerald-400',
  dailies: 'bg-amber-400',
  archives: 'bg-zinc-400',
  exports: 'bg-blue-400',
};

const UNDERLINE_COLORS: Record<ScreeningTab, string> = {
  preview: 'from-studio/0 via-studio to-studio/0',
  sequences: 'from-emerald-400/0 via-emerald-400 to-emerald-400/0',
  dailies: 'from-amber-400/0 via-amber-400 to-amber-400/0',
  archives: 'from-zinc-400/0 via-zinc-400 to-zinc-400/0',
  exports: 'from-blue-400/0 via-blue-400 to-blue-400/0',
};

export const ScreeningTabs: React.FC<ScreeningTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: ScreeningTab; label: string; icon: any; color: string }[] = [
    { id: 'preview', label: 'Cinema Mode', icon: Monitor, color: 'text-studio' },
    { id: 'sequences', label: 'Sequences', icon: Film, color: 'text-emerald-400' },
    { id: 'dailies', label: 'Dailies', icon: Play, color: 'text-amber-400' },
    { id: 'archives', label: 'Archives', icon: History, color: 'text-zinc-400' },
    { id: 'exports', label: 'Exports', icon: Download, color: 'text-blue-400' },
  ];

  return (
    <div className="tabs-nav-container group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]" />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "tabs-nav-button group/tab",
              isActive ? tab.color : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="screening-tab-glow"
                className={cn("storyboard-tab-glow", GLOW_COLORS[tab.id])}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="screening-tab-bg"
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
                layoutId="screening-tab-underline"
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

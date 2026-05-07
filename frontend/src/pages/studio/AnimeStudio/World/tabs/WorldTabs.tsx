import React from 'react';
import {
  History,
  Zap,
  Users,
  ScrollText,
  Building2,
  Map,
  Cpu,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { reportTabChange } from '@/lib/studio-logger';

export type WorldTab = 'manifest' | 'lore' | 'factions' | 'powers' | 'architecture' | 'atlas' | 'culture' | 'systems';

interface WorldTabsProps {
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
  loadingStates?: Partial<Record<WorldTab, boolean>>;
}

const GLOW_COLORS: Record<WorldTab, string> = {
  manifest: 'bg-zinc-400',
  lore: 'bg-fuchsia-400',
  factions: 'bg-blue-400',
  powers: 'bg-amber-400',
  architecture: 'bg-orange-400',
  atlas: 'bg-cyan-400',
  culture: 'bg-rose-400',
  systems: 'bg-emerald-400',
};

const UNDERLINE_COLORS: Record<WorldTab, string> = {
  manifest: 'from-zinc-400/0 via-zinc-400 to-zinc-400/0',
  lore: 'from-fuchsia-400/0 via-fuchsia-400 to-fuchsia-400/0',
  factions: 'from-blue-400/0 via-blue-400 to-blue-400/0',
  powers: 'from-amber-400/0 via-amber-400 to-amber-400/0',
  architecture: 'from-orange-400/0 via-orange-400 to-orange-400/0',
  atlas: 'from-cyan-400/0 via-cyan-400 to-cyan-400/0',
  culture: 'from-rose-400/0 via-rose-400 to-rose-400/0',
  systems: 'from-emerald-400/0 via-emerald-400 to-emerald-400/0',
};

export const WorldTabs: React.FC<WorldTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {}
}) => {
  const tabs: { id: WorldTab; label: string; icon: any; color: string }[] = [
    { id: 'manifest', label: 'Manifest', icon: ScrollText, color: 'text-zinc-400' },
    { id: 'lore', label: 'History', icon: History, color: 'text-fuchsia-400' },
    { id: 'factions', label: 'Factions', icon: Users, color: 'text-blue-400' },
    { id: 'powers', label: 'Powers', icon: Zap, color: 'text-amber-400' },
    { id: 'architecture', label: 'Architecture', icon: Building2, color: 'text-orange-400' },
    { id: 'atlas', label: 'Atlas', icon: Map, color: 'text-cyan-400' },
    { id: 'culture', label: 'Culture', icon: Globe, color: 'text-rose-400' },
    { id: 'systems', label: 'Systems', icon: Cpu, color: 'text-emerald-400' },
  ];

  const handleTabClick = (tabId: WorldTab) => {
    if (activeTab !== tabId) {
      reportTabChange('WORLD', tabId, 'anime');
      setActiveTab(tabId);
    }
  };

  const isTabLoading = (tabId: WorldTab) => loadingStates[tabId] || false;

  return (
    <div className="tabs-nav-container group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]" />

      {tabs.map((tab) => {
        const loading = isTabLoading(tab.id);
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "tabs-nav-button group/tab",
              isActive ? tab.color : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {/* Active pill background */}
            {isActive && (
              <motion.div
                layoutId="world-tab-glow"
                className={cn("storyboard-tab-glow", GLOW_COLORS[tab.id])}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="world-tab-bg"
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

            {/* Gradient bottom underline */}
            {isActive && (
              <motion.div
                layoutId="world-tab-underline"
                className={cn("absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r rounded-full", UNDERLINE_COLORS[tab.id])}
                style={{ filter: 'blur(0.5px)', opacity: 0.7 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}

            {/* Loading dot */}
            {loading && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full animate-pulse z-20" />
            )}
          </button>
        );
      })}
    </div>
  );
};

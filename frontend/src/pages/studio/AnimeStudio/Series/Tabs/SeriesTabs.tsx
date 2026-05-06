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
    <div className="flex items-center gap-2 p-1.5 bg-[#080808]/60 border border-white/5 rounded-[1.5rem] backdrop-blur-md relative overflow-x-auto no-scrollbar group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 group/tab shrink-0 whitespace-nowrap",
            activeTab === tab.id ? tab.color : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="series-tab-glow"
              className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className={cn("w-3.5 h-3.5 transition-transform duration-300 group-hover/tab:scale-110", activeTab === tab.id ? "opacity-100" : "opacity-40")} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="series-tab-underline"
              className="absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-50"
            />
          )}
        </button>
      ))}
    </div>
  );
};




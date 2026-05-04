import React from 'react';
import { Layout, Camera, Layers, Film, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type StoryboardTab = 'frames' | 'angles' | 'composition' | 'animatic' | 'audio';

interface StoryboardTabsProps {
  activeTab: StoryboardTab;
  setActiveTab: (tab: StoryboardTab) => void;
}

export const StoryboardTabs: React.FC<StoryboardTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: StoryboardTab; label: string; icon: any; color: string }[] = [
    { id: 'frames',      label: 'Frame Matrix',  icon: Layout,  color: 'text-fuchsia-400' },
    { id: 'angles',      label: 'Shot Angles',   icon: Camera,  color: 'text-studio'      },
    { id: 'composition', label: 'Composition',   icon: Layers,  color: 'text-amber-400'   },
    { id: 'animatic',    label: 'Animatic',      icon: Film,    color: 'text-emerald-400' },
    { id: 'audio',       label: 'Audio Sync',    icon: Music,   color: 'text-blue-400'    },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#080808]/60 border border-white/5 rounded-[1.5rem] backdrop-blur-md relative overflow-x-auto no-scrollbar group">
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 via-transparent to-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "storyboard-tab-btn relative",
            activeTab === tab.id ? tab.color : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="storyboard-tab-glow"
              className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className={cn("w-3.5 h-3.5 transition-transform duration-300 group-hover/tab:scale-110", activeTab === tab.id ? "opacity-100" : "opacity-40")} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div layoutId="storyboard-tab-underline" className="absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-50" />
          )}
        </button>
      ))}
    </div>
  );
};

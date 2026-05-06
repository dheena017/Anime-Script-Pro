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
    <div className="storyboard-tabs-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "storyboard-tab-btn group/tab relative overflow-hidden",
            activeTab === tab.id 
              ? "bg-white/[0.03] border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]" 
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab-glow"
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-5",
                tab.id === 'frames' && "from-fuchsia-500",
                tab.id === 'angles' && "from-studio",
                tab.id === 'composition' && "from-amber-400",
                tab.id === 'animatic' && "from-emerald-400",
                tab.id === 'audio' && "from-blue-400"
              )}
            />
          )}
          
          <tab.icon className={cn(
            "w-4 h-4 transition-all duration-500",
            activeTab === tab.id ? tab.color : "text-zinc-600 group-hover/tab:text-zinc-400"
          )} />
          
          <span className={cn(
            "relative z-10 transition-colors duration-500",
            activeTab === tab.id ? "text-white" : "text-zinc-500 group-hover/tab:text-zinc-300"
          )}>
            {tab.label}
          </span>

          {activeTab === tab.id && (
            <motion.div 
              layoutId="tab-indicator"
              className={cn(
                "absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r",
                tab.id === 'frames' && "from-fuchsia-500/0 via-fuchsia-500 to-fuchsia-500/0",
                tab.id === 'angles' && "from-studio/0 via-studio to-studio/0",
                tab.id === 'composition' && "from-amber-400/0 via-amber-400 to-amber-400/0",
                tab.id === 'animatic' && "from-emerald-400/0 via-emerald-400 to-emerald-400/0",
                tab.id === 'audio' && "from-blue-400/0 via-blue-400 to-blue-400/0"
              )}
            />
          )}
        </button>
      ))}
    </div>
  );
};

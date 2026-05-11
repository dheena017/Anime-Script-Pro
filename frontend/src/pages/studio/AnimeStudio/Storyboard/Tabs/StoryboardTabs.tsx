import React from 'react';
import { Layout, Camera, Layers, Film, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type StoryboardTab = 'frames' | 'angles' | 'composition' | 'animatic' | 'audio';

interface StoryboardTabsProps {
  activeTab: StoryboardTab;
  setActiveTab: (tab: StoryboardTab) => void;
}

const TABS: { id: StoryboardTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'frames',      label: 'FRAME MATRIX', icon: Layout,  color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(192,38,211,0.3)]'  },
  { id: 'angles',      label: 'SHOT ANGLES',  icon: Camera,  color: 'text-studio',      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'   },
  { id: 'composition', label: 'COMPOSITION',  icon: Layers,  color: 'text-amber-400',   glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'  },
  { id: 'animatic',    label: 'ANIMATIC',     icon: Film,    color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]'  },
  { id: 'audio',       label: 'AUDIO SYNC',   icon: Music,   color: 'text-blue-400',    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'  },
];

export const StoryboardTabs: React.FC<StoryboardTabsProps> = ({ activeTab, setActiveTab }) => {
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
                layoutId="storyboard-active-pill"
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

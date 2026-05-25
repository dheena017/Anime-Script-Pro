import React from 'react';
import { LayoutGrid, Camera, Box, Play, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { storyboardStyles as s } from '../storyboardStyles';

export type StoryboardTab = 'frames' | 'angles' | 'composition' | 'animatic' | 'audio';

interface StoryboardTabsProps {
  activeTab: StoryboardTab;
  setActiveTab: (tab: StoryboardTab) => void;
  loadingStates?: Partial<Record<StoryboardTab, boolean>>;
}

const TABS: { id: StoryboardTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'frames',      label: 'VIDEO',        icon: LayoutGrid, color: 'text-orange-400', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' },
  { id: 'angles',      label: 'ANGLES',       icon: Camera,     color: 'text-studio',    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]'     },
  { id: 'composition', label: 'COMPOSITION',  icon: Box,        color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'    },
  { id: 'animatic',    label: 'ANIMATIC',     icon: Play,       color: 'text-amber-400',   glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'    },
  { id: 'audio',       label: 'AUDIO',        icon: Music,      color: 'text-blue-400',    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'    },
];

export const StoryboardTabs: React.FC<StoryboardTabsProps> = ({
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
                layoutId="storyboard-active-pill"
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

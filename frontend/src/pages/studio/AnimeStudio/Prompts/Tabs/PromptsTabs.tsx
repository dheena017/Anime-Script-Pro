import React from 'react';
import { Image, Video, Palette, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type PromptsTab = 'image' | 'video' | 'style' | 'negative';

interface PromptsTabsProps {
  activeTab: PromptsTab;
  setActiveTab: (tab: PromptsTab) => void;
}

const GLOW_COLORS: Record<PromptsTab, string> = {
  image: 'bg-studio',
  video: 'bg-emerald-400',
  style: 'bg-amber-400',
  negative: 'bg-rose-400',
};

const UNDERLINE_COLORS: Record<PromptsTab, string> = {
  image: 'from-studio/0 via-studio to-studio/0',
  video: 'from-emerald-400/0 via-emerald-400 to-emerald-400/0',
  style: 'from-amber-400/0 via-amber-400 to-amber-400/0',
  negative: 'from-rose-400/0 via-rose-400 to-rose-400/0',
};

export const PromptsTabs: React.FC<PromptsTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: PromptsTab; label: string; icon: any; color: string }[] = [
    { id: 'image', label: 'Image DNA', icon: Image, color: 'text-studio' },
    { id: 'video', label: 'Motion DNA', icon: Video, color: 'text-emerald-400' },
    { id: 'style', label: 'Art Style', icon: Palette, color: 'text-amber-400' },
    { id: 'negative', label: 'Negatives', icon: ShieldAlert, color: 'text-rose-400' },
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
                layoutId="prompts-tab-glow"
                className={cn("storyboard-tab-glow", GLOW_COLORS[tab.id])}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="prompts-tab-bg"
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
                layoutId="prompts-tab-underline"
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

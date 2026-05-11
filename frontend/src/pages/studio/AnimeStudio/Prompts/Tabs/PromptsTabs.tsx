import React from 'react';
import { Image, Wind, MinusCircle, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { promptsStyles as s } from '../promptsStyles';

export type PromptsTab = 'image' | 'motion' | 'negative' | 'style';

interface PromptsTabsProps {
  activeTab: PromptsTab;
  setActiveTab: (tab: PromptsTab) => void;
  loadingStates?: Partial<Record<PromptsTab, boolean>>;
}

const TABS: { id: PromptsTab; label: string; icon: any; color: string; glow: string }[] = [
  { id: 'image',    label: 'IMAGE PROMPTS',    icon: Image,       color: 'text-studio',    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
  { id: 'motion',   label: 'MOTION DYNAMICS',  icon: Wind,        color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  { id: 'negative', label: 'NEGATIVE BOUNDS', icon: MinusCircle, color: 'text-red-400',     glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' },
  { id: 'style',    label: 'STYLE PROTOCOLS', icon: Palette,     color: 'text-amber-400',   glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
];

export const PromptsTabs: React.FC<PromptsTabsProps> = ({
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
            {isActive && (
              <motion.div
                layoutId="prompts-active-pill"
                className={cn(s.tabs.glowMotion, tab.glow)}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2.5">
              {loading ? (
                <div className={s.tabs.spinner} />
              ) : (
                <tab.icon className={cn(s.tabs.icon, isActive ? s.tabs.iconActive : s.tabs.iconInactive)} />
              )}
              <span className="hidden lg:inline">{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

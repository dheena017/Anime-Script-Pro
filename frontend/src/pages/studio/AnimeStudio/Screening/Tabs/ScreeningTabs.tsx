import React from 'react';
import { Monitor, Play, FileText, Settings, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { screeningStyles as s } from '../screeningStyles';

export type ScreeningTab = 'preview' | 'sequences' | 'dailies' | 'archives' | 'exports';

interface ScreeningTabsProps {
  activeTab: ScreeningTab;
  setActiveTab: (tab: ScreeningTab) => void;
  loadingStates?: Partial<Record<ScreeningTab, boolean>>;
}

const TABS: { id: ScreeningTab; label: string; icon: any; color: string; glow: string }[] = [
  { id: 'preview',   label: 'PREVIEW',   icon: Monitor,  color: 'text-studio',      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
  { id: 'sequences', label: 'SEQUENCES', icon: Play,     color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  { id: 'dailies',   label: 'DAILIES',   icon: FileText, color: 'text-amber-400',   glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
  { id: 'archives',  label: 'ARCHIVES',  icon: Settings, color: 'text-zinc-400',    glow: 'shadow-[0_0_15px_rgba(161,161,170,0.3)]' },
  { id: 'exports',   label: 'EXPORTS',   icon: BarChart, color: 'text-violet-400',  glow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' },
];

export const ScreeningTabs: React.FC<ScreeningTabsProps> = ({
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
                layoutId="screening-active-pill"
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

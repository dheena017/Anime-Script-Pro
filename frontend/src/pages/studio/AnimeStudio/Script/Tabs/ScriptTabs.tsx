import React from 'react';
import {
  FileText,
  MessageSquare,
  Music,
  BarChart3,
  Search,
  Layout,
  TableProperties,
  Film,
  Zap,
  Box
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { scriptStyles as s } from '../scriptStyles';

export type ScriptTab = 'teleprompter' | 'linguistics' | 'beats' | 'dialogue' | 'cinematics' | 'analysis' | 'audio' | 'metadata' | 'visuals';

interface ScriptTabsProps {
  activeTab: ScriptTab;
  setActiveTab: (tab: ScriptTab) => void;
  loadingStates?: Partial<Record<ScriptTab, boolean>>;
}

const TABS: { id: ScriptTab; label: string; icon: any; color: string; glow: string }[] = [
  { id: 'teleprompter', label: 'TELEPROMPTER', icon: FileText, color: 'text-studio', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
  { id: 'beats', label: 'BEAT SHEET', icon: TableProperties, color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  { id: 'dialogue', label: 'DIALOGUE', icon: MessageSquare, color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(192,38,211,0.3)]' },
  { id: 'cinematics', label: 'CINEMATICS', icon: Film, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]' },
  { id: 'audio', label: 'AUDIO/VO', icon: Music, color: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
  { id: 'linguistics', label: 'LINGUISTICS', icon: Zap, color: 'text-orange-400', glow: 'shadow-[0_0_15px_rgba(251,146,60,0.3)]' },
  { id: 'analysis', label: 'ANALYSIS', icon: BarChart3, color: 'text-rose-400', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
  { id: 'metadata', label: 'METADATA', icon: Search, color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
];

export const ScriptTabs: React.FC<ScriptTabsProps> = ({
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
                layoutId="script-active-pill"
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

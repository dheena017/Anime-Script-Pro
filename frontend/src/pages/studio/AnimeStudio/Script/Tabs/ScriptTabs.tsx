import React from 'react';
import { 
  FileText, 
  Languages, 
  ListMusic, 
  MessageSquare, 
  Database,
  Camera,
  Activity,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type ScriptTab = 'teleprompter' | 'linguistics' | 'beats' | 'dialogue' | 'metadata' | 'cinematics' | 'analysis' | 'audio';

interface ScriptTabsProps {
  activeTab: ScriptTab;
  setActiveTab: (tab: ScriptTab) => void;
}

const GLOW_COLORS: Record<ScriptTab, string> = {
  teleprompter: 'bg-studio',
  cinematics: 'bg-purple-400',
  linguistics: 'bg-amber-400',
  beats: 'bg-fuchsia-400',
  dialogue: 'bg-emerald-400',
  analysis: 'bg-rose-400',
  audio: 'bg-cyan-400',
  metadata: 'bg-blue-400',
};

const UNDERLINE_COLORS: Record<ScriptTab, string> = {
  teleprompter: 'from-studio/0 via-studio to-studio/0',
  cinematics: 'from-purple-400/0 via-purple-400 to-purple-400/0',
  linguistics: 'from-amber-400/0 via-amber-400 to-amber-400/0',
  beats: 'from-fuchsia-400/0 via-fuchsia-400 to-fuchsia-400/0',
  dialogue: 'from-emerald-400/0 via-emerald-400 to-emerald-400/0',
  analysis: 'from-rose-400/0 via-rose-400 to-rose-400/0',
  audio: 'from-cyan-400/0 via-cyan-400 to-cyan-400/0',
  metadata: 'from-blue-400/0 via-blue-400 to-blue-400/0',
};

export const ScriptTabs: React.FC<ScriptTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: ScriptTab; label: string; icon: any; color: string }[] = [
    { id: 'teleprompter', label: 'Teleprompter', icon: FileText, color: 'text-studio' },
    { id: 'cinematics', label: 'Cinematics', icon: Camera, color: 'text-purple-400' },
    { id: 'linguistics', label: 'Linguistics', icon: Languages, color: 'text-amber-400' },
    { id: 'beats', label: 'Beat Sheet', icon: ListMusic, color: 'text-fuchsia-400' },
    { id: 'dialogue', label: 'Dialogue', icon: MessageSquare, color: 'text-emerald-400' },
    { id: 'analysis', label: 'Pulse', icon: Activity, color: 'text-rose-400' },
    { id: 'audio', label: 'Audio', icon: Volume2, color: 'text-cyan-400' },
    { id: 'metadata', label: 'Metadata', icon: Database, color: 'text-blue-400' },
  ];

  return (
    <div className="tabs-nav-container flex-wrap group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]" />

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
                layoutId="script-tab-glow"
                className={cn("storyboard-tab-glow", GLOW_COLORS[tab.id])}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="script-tab-bg"
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
                layoutId="script-tab-underline"
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

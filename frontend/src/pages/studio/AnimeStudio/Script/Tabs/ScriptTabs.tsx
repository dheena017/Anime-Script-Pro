import React from 'react';
import { 
  FileText, 
  Languages, 
  ListMusic, 
  MessageSquare, 
  Database 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type ScriptTab = 'teleprompter' | 'linguistics' | 'beats' | 'dialogue' | 'metadata';

interface ScriptTabsProps {
  activeTab: ScriptTab;
  setActiveTab: (tab: ScriptTab) => void;
}

export const ScriptTabs: React.FC<ScriptTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: ScriptTab; label: string; icon: any; color: string }[] = [
    { id: 'teleprompter', label: 'Teleprompter', icon: FileText, color: 'text-studio' },
    { id: 'linguistics', label: 'Linguistics', icon: Languages, color: 'text-amber-400' },
    { id: 'beats', label: 'Beat Sheet', icon: ListMusic, color: 'text-fuchsia-400' },
    { id: 'dialogue', label: 'Dialogue', icon: MessageSquare, color: 'text-emerald-400' },
    { id: 'metadata', label: 'Metadata', icon: Database, color: 'text-blue-400' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#080808]/60 border border-white/5 rounded-[1.5rem] backdrop-blur-md relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 group/tab",
            activeTab === tab.id ? tab.color : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="script-tab-glow"
              className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className={cn("w-3.5 h-3.5 transition-transform duration-300 group-hover/tab:scale-110", activeTab === tab.id ? "opacity-100" : "opacity-40")} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="script-tab-underline"
              className="absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-50"
            />
          )}
        </button>
      ))}
    </div>
  );
};




import React from 'react';
import { Cpu, Terminal, Zap, Activity, Settings, Layout as LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type EngineTab = 'status' | 'template' | 'console' | 'calibration' | 'optimization' | 'logs';

interface EngineTabsProps {
  activeTab: EngineTab;
  setActiveTab: (tab: EngineTab) => void;
}

export const EngineTabs: React.FC<EngineTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: EngineTab; label: string; icon: any; color: string }[] = [
    { id: 'status', label: 'Core Status', icon: Cpu, color: 'text-studio' },
    { id: 'template', label: 'Template', icon: LayoutGrid, color: 'text-fuchsia-400' },
    { id: 'console', label: 'Console', icon: Terminal, color: 'text-emerald-400' },
    { id: 'calibration', label: 'Calibration', icon: Zap, color: 'text-amber-400' },
    { id: 'optimization', label: 'Optimization', icon: Activity, color: 'text-blue-400' },
    { id: 'logs', label: 'System Logs', icon: Settings, color: 'text-zinc-400' },
  ];

  return (
    <div className="tabs-nav-container !bg-transparent !border-none">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "tabs-nav-button",
            activeTab === tab.id ? tab.color : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="engine-tab-glow"
              className="tabs-nav-active-glow"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className={cn("w-3.5 h-3.5 transition-transform duration-300", activeTab === tab.id ? "opacity-100 scale-110" : "opacity-40")} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="engine-tab-underline"
              className="tabs-nav-underline"
            />
          )}
        </button>
      ))}
    </div>
  );
};

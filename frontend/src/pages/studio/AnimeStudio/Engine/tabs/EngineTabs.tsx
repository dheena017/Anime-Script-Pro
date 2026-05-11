import React from 'react';
import { Cpu, Terminal, Zap, Activity, Settings, Layout as LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { engineStyles as s } from '../engineStyles';

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
    <div className={s.tabs.container}>
      <div className={s.tabs.overlay} />
      
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(s.tabs.button, activeTab === tab.id ? cn(tab.color, s.tabs.buttonActive) : s.tabs.buttonInactive)}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="engine-tab-glow"
              className={s.tabs.glow}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className={cn(s.tabs.icon, activeTab === tab.id ? s.tabs.iconActive : s.tabs.iconInactive)} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="engine-tab-underline"
              className={s.tabs.underline}
            />
          )}
        </button>
      ))}
    </div>
  );
};

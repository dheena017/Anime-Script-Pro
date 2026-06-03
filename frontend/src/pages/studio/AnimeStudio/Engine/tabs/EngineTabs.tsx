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
          aria-label={tab.label}
          title={tab.label}
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
          <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="engine-tab-underline"
              className={s.tabs.underline}
            />
          )}
        </button>
      ))}

      {/* Mobile bottom nav (icon-only) */}
      <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-[320] bg-[#050505]/95 backdrop-blur-md px-3 py-2 rounded-3xl shadow-2xl flex items-center gap-2">
        {tabs.map(tab => (
          <button
            key={`mobile-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-zinc-300", activeTab === tab.id ? 'bg-white/[0.04] text-white' : 'bg-transparent')}
          >
            <tab.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};

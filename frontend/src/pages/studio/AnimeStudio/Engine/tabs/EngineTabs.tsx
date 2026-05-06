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
    <div className="flex items-center justify-center gap-10 p-2 relative overflow-x-auto hide-scrollbar">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shrink-0 whitespace-nowrap",
            activeTab === tab.id 
              ? cn(tab.color, "bg-white/[0.03] shadow-[0_0_20px_rgba(255,255,255,0.02)]") 
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="engine-tab-glow"
              className="absolute inset-0 border border-white/10 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.02)]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-500", activeTab === tab.id ? "opacity-100 scale-110 rotate-[360deg]" : "opacity-40")} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="engine-tab-underline"
              className="absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-50 blur-[1px]"
            />
          )}
        </button>
      ))}
    </div>
  );
};

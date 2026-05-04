import React from 'react';
import {
  History,
  Zap,
  Users,
  ScrollText,
  Building2,
  Map,
  Cpu,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type WorldTab = 'manifest' | 'lore' | 'factions' | 'powers' | 'architecture' | 'atlas' | 'culture' | 'systems';

interface WorldTabsProps {
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
}

export const WorldTabs: React.FC<WorldTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: WorldTab; label: string; icon: any; color: string }[] = [
    { id: 'manifest', label: 'Manifest', icon: ScrollText, color: 'text-zinc-400' },
    { id: 'lore', label: 'History', icon: History, color: 'text-fuchsia-400' },
    { id: 'factions', label: 'Factions', icon: Users, color: 'text-blue-400' },
    { id: 'powers', label: 'Powers', icon: Zap, color: 'text-amber-400' },
    { id: 'architecture', label: 'Architecture', icon: Building2, color: 'text-orange-400' },
    { id: 'atlas', label: 'Atlas', icon: Map, color: 'text-cyan-400' },
    { id: 'culture', label: 'Culture', icon: Globe, color: 'text-rose-400' },
    { id: 'systems', label: 'Systems', icon: Cpu, color: 'text-emerald-400' },
  ];

  return (
    <div className="tabs-nav-container">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "tabs-nav-button transition-all duration-200",
            activeTab === tab.id 
              ? `${tab.color} bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.03)]` 
              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
          )}
        >
          <tab.icon className={cn("w-3.5 h-3.5 transition-transform duration-300", activeTab === tab.id ? "opacity-100 scale-110" : "opacity-40")} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-40 shadow-[0_0_10px_currentColor]" />
          )}
        </button>
      ))}
    </div>
  );
};





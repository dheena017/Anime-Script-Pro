import React from 'react';
import {
  Fingerprint,
  Users,
  ShieldCheck,
  UserPlus,
  Dna,
  Workflow,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type CastTab = 'matrix' | 'registry' | 'integrity' | 'add-lead' | 'dna' | 'dynamics' | 'characters';

interface CastTabsProps {
  activeTab: CastTab;
  setActiveTab: (tab: CastTab) => void;
}

export const CastTabs: React.FC<CastTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: CastTab; label: string; icon: any; color: string }[] = [
    { id: 'registry', label: 'Registry', icon: Users, color: 'text-studio' },
    { id: 'characters', label: 'Manifest', icon: Fingerprint, color: 'text-cyan-400' },
    { id: 'matrix', label: 'Matrix', icon: Workflow, color: 'text-fuchsia-400' },
    { id: 'dna', label: 'Trait Analysis', icon: Dna, color: 'text-blue-400' },
    { id: 'dynamics', label: 'Dynamics', icon: Zap, color: 'text-rose-400' },
    { id: 'integrity', label: 'Integrity', icon: ShieldCheck, color: 'text-emerald-400' },
    { id: 'add-lead', label: 'Add Lead', icon: UserPlus, color: 'text-amber-400' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#080808]/60 border border-white/5 rounded-[1.5rem] backdrop-blur-md relative overflow-x-auto no-scrollbar group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3 group/tab shrink-0 whitespace-nowrap",
            activeTab === tab.id ? tab.color : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="cast-tab-glow"
              className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <tab.icon className={cn("w-3.5 h-3.5 transition-transform duration-300 group-hover/tab:scale-110", activeTab === tab.id ? "opacity-100" : "opacity-40")} />
          <span className="relative z-10">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div
              layoutId="cast-tab-underline"
              className="absolute -bottom-1 left-4 right-4 h-0.5 bg-current rounded-full opacity-50"
            />
          )}
        </button>
      ))}
    </div>
  );
};




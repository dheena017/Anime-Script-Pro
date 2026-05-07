import {
  Users,
  Mic2,
  Swords,
  TrendingUp,
  GitBranch,
  Layout,
  Workflow
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type CastTab = 'registry' | 'voice' | 'combat' | 'arcs' | 'dynamics' | 'relationships' | 'technical';

interface CastTabsProps {
  activeTab: CastTab;
  setActiveTab: (tab: CastTab) => void;
  loadingStates?: Partial<Record<CastTab, boolean>>;
}

const GLOW_COLORS: Record<CastTab, string> = {
  registry: 'bg-studio',
  voice: 'bg-cyan-500',
  combat: 'bg-red-500',
  arcs: 'bg-fuchsia-500',
  dynamics: 'bg-orange-500',
  relationships: 'bg-fuchsia-500',
  technical: 'bg-indigo-500',
};

const UNDERLINE_COLORS: Record<CastTab, string> = {
  registry: 'from-studio/0 via-studio to-studio/0',
  voice: 'from-cyan-500/0 via-cyan-500 to-cyan-500/0',
  combat: 'from-red-500/0 via-red-500 to-red-500/0',
  arcs: 'from-fuchsia-500/0 via-fuchsia-500 to-fuchsia-500/0',
  dynamics: 'from-orange-500/0 via-orange-500 to-orange-500/0',
  relationships: 'from-fuchsia-500/0 via-fuchsia-500 to-fuchsia-500/0',
  technical: 'from-indigo-500/0 via-indigo-500 to-indigo-500/0',
};

export const CastTabs: React.FC<CastTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {}
}) => {
  const tabs: { id: CastTab; label: string; icon: any; color: string }[] = [
    { id: 'registry', label: 'Registry', icon: Users, color: 'text-studio' },
    { id: 'voice', label: 'Voice', icon: Mic2, color: 'text-cyan-400' },
    { id: 'combat', label: 'Combat', icon: Swords, color: 'text-red-400' },
    { id: 'arcs', label: 'Arcs', icon: TrendingUp, color: 'text-fuchsia-400' },
    { id: 'dynamics', label: 'Dynamics', icon: GitBranch, color: 'text-orange-400' },
    { id: 'relationships', label: 'Relationships', icon: Workflow, color: 'text-fuchsia-400' },
    { id: 'technical', label: 'Technical', icon: Layout, color: 'text-indigo-400' },
  ];

  return (
    <div className="tabs-nav-container group">
      <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[1.5rem]" />

      {tabs.map((tab) => {
        const loading = loadingStates[tab.id] || false;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "tabs-nav-button group/tab",
              isActive ? tab.color : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="cast-tab-glow"
                className={cn("storyboard-tab-glow", GLOW_COLORS[tab.id])}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="cast-tab-bg"
                className="absolute inset-0 rounded-xl bg-white/[0.04] border border-white/10"
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}

            <div className="flex items-center gap-2 relative z-10">
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-transparent border-t-current rounded-full animate-spin" />
              ) : (
                <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-300", isActive ? "opacity-100 scale-110" : "opacity-40 group-hover/tab:opacity-70 group-hover/tab:scale-105")} />
              )}
              <span>{tab.label}</span>
            </div>

            {isActive && (
              <motion.div
                layoutId="cast-tab-underline"
                className={cn("absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r rounded-full", UNDERLINE_COLORS[tab.id])}
                style={{ filter: 'blur(0.5px)', opacity: 0.7 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
              />
            )}

            {loading && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full animate-pulse z-20" />
            )}
          </button>
        );
      })}
    </div>
  );
};

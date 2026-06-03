import React from "react";
import {
  History,
  Zap,
  Users,
  ScrollText,
  Building2,
  Map,
  Cpu,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { reportTabChange } from "@/lib/dev-console-logs";
import { worldStyles as s } from "../worldStyles";

export type WorldTab =
  | "manifest"
  | "lore"
  | "factions"
  | "powers"
  | "architecture"
  | "atlas"
  | "culture"
  | "systems";

interface WorldTabsProps {
  activeTab: WorldTab;
  setActiveTab: (tab: WorldTab) => void;
  loadingStates?: Partial<Record<WorldTab, boolean>>;
}

const GLOW_COLORS: Record<WorldTab, string> = {
  manifest: "bg-zinc-400",
  lore: "bg-fuchsia-400",
  factions: "bg-blue-400",
  powers: "bg-amber-400",
  architecture: "bg-orange-400",
  atlas: "bg-cyan-400",
  culture: "bg-rose-400",
  systems: "bg-emerald-400",
};

const UNDERLINE_COLORS: Record<WorldTab, string> = {
  manifest: "from-zinc-400/0 via-zinc-400 to-zinc-400/0",
  lore: "from-fuchsia-400/0 via-fuchsia-400 to-fuchsia-400/0",
  factions: "from-blue-400/0 via-blue-400 to-blue-400/0",
  powers: "from-amber-400/0 via-amber-400 to-amber-400/0",
  architecture: "from-orange-400/0 via-orange-400 to-orange-400/0",
  atlas: "from-cyan-400/0 via-cyan-400 to-cyan-400/0",
  culture: "from-rose-400/0 via-rose-400 to-rose-400/0",
  systems: "from-emerald-400/0 via-emerald-400 to-emerald-400/0",
};

export const WorldTabs: React.FC<WorldTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {},
}) => {
  const tabs: {
    id: WorldTab;
    label: string;
    icon: any;
    color: string;
    glow: string;
  }[] = [
    {
      id: "manifest",
      label: "MANIFEST",
      icon: ScrollText,
      color: "text-zinc-400",
      glow: "shadow-[0_0_15px_rgba(161,161,170,0.3)]",
    },
    {
      id: "lore",
      label: "HISTORY",
      icon: History,
      color: "text-fuchsia-400",
      glow: "shadow-[0_0_15px_rgba(192,38,211,0.3)]",
    },
    {
      id: "factions",
      label: "FACTIONS",
      icon: Users,
      color: "text-blue-400",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    },
    {
      id: "powers",
      label: "POWERS",
      icon: Zap,
      color: "text-amber-400",
      glow: "shadow-[0_0_15px_rgba(251,191,36,0.3)]",
    },
    {
      id: "architecture",
      label: "ARCHITECTURE",
      icon: Building2,
      color: "text-orange-400",
      glow: "shadow-[0_0_15px_rgba(251,146,60,0.3)]",
    },
    {
      id: "atlas",
      label: "ATLAS",
      icon: Map,
      color: "text-cyan-400",
      glow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
    },
    {
      id: "culture",
      label: "CULTURE",
      icon: Globe,
      color: "text-rose-400",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    },
    {
      id: "systems",
      label: "SYSTEMS",
      icon: Cpu,
      color: "text-emerald-400",
      glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]",
    },
  ];

  const handleTabClick = (tabId: WorldTab) => {
    if (activeTab !== tabId) {
      // Removed redundant reportTabChange here to avoid double-logging with WorldLayout
      setActiveTab(tabId);
    }
  };

  const isTabLoading = (tabId: WorldTab) => loadingStates[tabId] || false;

  return (
    <div className={s.tabs.container}>
      <div className={s.tabs.overlay} />

      {tabs.map((tab) => {
        const loading = isTabLoading(tab.id);
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              s.tabs.button,
              isActive ? cn(tab.color, s.tabs.buttonActive) : s.tabs.buttonInactive,
            )}
          >
            {isActive && (
              <motion.div
                layoutId="world-tab-glow"
                className={s.tabs.glow}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            <div className="relative z-10 flex items-center gap-2.5">
              {loading ? (
                <div className={s.tabs.spinner} />
              ) : (
                <tab.icon
                  className={cn(
                    s.tabs.icon,
                    isActive ? s.tabs.iconActive : s.tabs.iconInactive,
                  )}
                />
              )}
              <span className="relative z-10 hidden sm:inline">{tab.label}</span>
            </div>

            {isActive && (
              <motion.div 
                layoutId="world-tab-underline"
                className={cn(s.tabs.underline, tab.color)}
              />
            )}
          </button>
        );
      })}

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-[320] bg-[#050505]/95 backdrop-blur-md px-3 py-2 rounded-3xl shadow-2xl flex items-center gap-2 overflow-x-auto max-w-[95vw] hide-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={`mobile-${tab.id}`}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              title={tab.label}
              className={cn(
                "w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors",
                isActive ? cn('bg-white/[0.04]', tab.color) : 'bg-transparent text-zinc-400'
              )}
            >
              <tab.icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React from "react";
import {
  Users,
  Mic2,
  Swords,
  TrendingUp,
  GitBranch,
  Layout,
  Workflow,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { characterStyles as s } from "../characterStyles";

export type CharacterTab =
  | "characters"
  | "lead"
  | "voice"
  | "combat"
  | "arcs"
  | "dynamics"
  | "relationships"
  | "integrity"
  | "technical";

interface CharacterTabsProps {
  activeTab: CharacterTab;
  setActiveTab: (tab: CharacterTab) => void;
  loadingStates?: Partial<Record<CharacterTab, boolean>>;
}

const TABS: {
  id: CharacterTab;
  label: string;
  icon: React.FC<any>;
  color: string;
  glow: string;
}[] = [
  {
    id: "characters",
    label: "CHARACTERS",
    icon: Users,
    color: "text-studio",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  },
  {
    id: "lead",
    label: "ADD LEAD",
    icon: UserPlus,
    color: "text-amber-400",
    glow: "shadow-[0_0_15px_rgba(250,204,21,0.25)]",
  },
  {
    id: "voice",
    label: "VOICE",
    icon: Mic2,
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
  },
  {
    id: "combat",
    label: "COMBAT",
    icon: Swords,
    color: "text-red-400",
    glow: "shadow-[0_0_15_rgba(248,113,113,0.3)]",
  },
  {
    id: "arcs",
    label: "ARCS",
    icon: TrendingUp,
    color: "text-fuchsia-400",
    glow: "shadow-[0_0_15px_rgba(192,38,211,0.3)]",
  },
  {
    id: "dynamics",
    label: "DYNAMICS",
    icon: GitBranch,
    color: "text-orange-400",
    glow: "shadow-[0_0_15px_rgba(251,146,60,0.3)]",
  },
  {
    id: "relationships",
    label: "RELATIONSHIPS",
    icon: Workflow,
    color: "text-pink-400",
    glow: "shadow-[0_0_15px_rgba(244,114,182,0.3)]",
  },
  {
    id: "integrity",
    label: "INTEGRITY",
    icon: ShieldCheck,
    color: "text-emerald-400",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.25)]",
  },
  {
    id: "technical",
    label: "TECHNICAL",
    icon: Layout,
    color: "text-indigo-400",
    glow: "shadow-[0_0_15px_rgba(129,140,248,0.3)]",
  },
];

export const CharacterTabs: React.FC<CharacterTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {},
}) => {
  return (
    <div className={s.tabs.container}>
      <div className={s.tabs.overlay} />

      {TABS.map((tab) => {
        const loading = loadingStates[tab.id] || false;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              s.tabs.button,
              isActive
                ? cn(tab.color, s.tabs.buttonActive)
                : s.tabs.buttonInactive,
            )}
          >
            {isActive && (
              <motion.div
                layoutId="cast-tab-glow"
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
              <span className="relative z-10 hidden sm:inline">
                {tab.label}
              </span>
            </div>

            {isActive && (
              <motion.div
                layoutId="cast-tab-underline"
                className={cn(s.tabs.underline, tab.color)}
              />
            )}
          </button>
        );
      })}

      {/* Mobile bottom nav */}
      <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-[320] bg-[#050505]/95 backdrop-blur-md px-3 py-2 rounded-3xl shadow-2xl flex items-center gap-2 overflow-x-auto max-w-[95vw] hide-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={`mobile-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={cn(
                "w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors",
                isActive
                  ? cn("bg-white/[0.04]", tab.color)
                  : "bg-transparent text-zinc-400",
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

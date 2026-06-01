import React from "react";
import { LayoutGrid, Camera, Box, Play, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { storyboardStyles as s } from "../storyboardStyles";

export type StoryboardTab =
  | "video"
  | "angles"
  | "composition"
  | "animatic"
  | "audio";

interface StoryboardTabsProps {
  activeTab: StoryboardTab;
  setActiveTab: (tab: StoryboardTab) => void;
  loadingStates?: Partial<Record<StoryboardTab, boolean>>;
}

const TABS: {
  id: StoryboardTab;
  label: string;
  icon: React.FC<any>;
  color: string;
  glow: string;
}[] = [
  {
    id: "video",
    label: "VIDEO",
    icon: LayoutGrid,
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  },
  {
    id: "angles",
    label: "ANGLES",
    icon: Camera,
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  },
  {
    id: "composition",
    label: "COMPOSITION",
    icon: Box,
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  },
  {
    id: "animatic",
    label: "ANIMATIC",
    icon: Play,
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  },
  {
    id: "audio",
    label: "AUDIO",
    icon: Music,
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  },
];

export const StoryboardTabs: React.FC<StoryboardTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {},
}) => {
  return (
    <>
      {/* Mobile icon-only tab rail */}
      <div className="sm:hidden w-full flex items-center gap-2 overflow-x-auto px-3 py-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center justify-center p-2 rounded-lg min-w-[44px]",
                isActive ? "bg-white/6" : "bg-transparent",
              )}
            >
              <tab.icon
                className={cn(
                  "w-5 h-5 text-white/90",
                  isActive ? tab.color : "text-zinc-400",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="hidden sm:flex flex-row items-center justify-center gap-4 p-2 relative mx-auto bg-[#030712]/60 border border-white/5 rounded-full backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] w-fit">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        {TABS.map((tab) => {
          const loading = loadingStates[tab.id] || false;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 border border-transparent whitespace-nowrap",
                isActive 
                  ? cn(tab.color, "border border-cyan-500/20 bg-[#05162b]/80 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-cyan-400") 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]",
              )}
            >
              {/* Per-tab color neon glow pill */}
              {isActive && (
                <motion.div
                  layoutId="storyboard-active-pill"
                  className="absolute inset-0 rounded-full pointer-events-none bg-cyan-500/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2.5">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                ) : (
                  <tab.icon
                    className={cn(
                      "w-4 h-4 transition-all duration-500",
                      isActive ? "opacity-100 scale-110 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "opacity-40",
                    )}
                  />
                )}
                <span className="hidden sm:inline">{tab.label}</span>
              </div>

              {isActive && (
                <motion.div 
                  layoutId="storyboard-tab-underline"
                  className="absolute bottom-1.5 left-6 right-6 h-[2px] bg-cyan-400 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

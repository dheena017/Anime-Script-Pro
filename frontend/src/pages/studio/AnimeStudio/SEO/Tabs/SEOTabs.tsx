import React from "react";
import { Search, Tag, FileText, Share2, TrendingUp, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { seoStyles as s } from "../seoStyles";

export type SEOTab =
  | "keywords"
  | "description"
  | "tags"
  | "alt"
  | "distribution"
  | "growth";

interface SEOTabsProps {
  activeTab: SEOTab;
  setActiveTab: (tab: SEOTab) => void;
  loadingStates?: Partial<Record<SEOTab, boolean>>;
}

const TABS: {
  id: SEOTab;
  label: string;
  icon: React.FC<any>;
  color: string;
  hoverColor: string;
  glow: string;
  pillBg: string;
}[] = [
  {
    id: "keywords",
    label: "KEYWORDS",
    icon: Hash,
    color: "text-cyan-300",
    hoverColor: "hover:text-cyan-400",
    glow: "shadow-[0_0_25px_rgba(6,182,212,0.45)]",
    pillBg: "bg-cyan-500/15 border border-cyan-500/30",
  },
  {
    id: "description",
    label: "DESCRIPTION",
    icon: FileText,
    color: "text-fuchsia-300",
    hoverColor: "hover:text-fuchsia-400",
    glow: "shadow-[0_0_25px_rgba(217,70,239,0.45)]",
    pillBg: "bg-fuchsia-500/15 border border-fuchsia-500/30",
  },
  {
    id: "tags",
    label: "TAGS",
    icon: Tag,
    color: "text-pink-300",
    hoverColor: "hover:text-pink-400",
    glow: "shadow-[0_0_25px_rgba(236,72,153,0.45)]",
    pillBg: "bg-pink-500/15 border border-pink-500/30",
  },
  {
    id: "alt",
    label: "ALT TEXT",
    icon: Search,
    color: "text-sky-300",
    hoverColor: "hover:text-sky-400",
    glow: "shadow-[0_0_25px_rgba(14,165,233,0.45)]",
    pillBg: "bg-sky-500/15 border border-sky-500/30",
  },
  {
    id: "distribution",
    label: "DISTRIBUTION",
    icon: Share2,
    color: "text-rose-300",
    hoverColor: "hover:text-rose-400",
    glow: "shadow-[0_0_25px_rgba(244,63,94,0.45)]",
    pillBg: "bg-rose-500/15 border border-rose-500/30",
  },
  {
    id: "growth",
    label: "GROWTH",
    icon: TrendingUp,
    color: "text-orange-300",
    hoverColor: "hover:text-orange-400",
    glow: "shadow-[0_0_25px_rgba(249,115,22,0.45)]",
    pillBg: "bg-orange-500/15 border border-orange-500/30",
  },
];

export const SEOTabs: React.FC<SEOTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {},
}) => {
  return (
    <div className={cn(s.tabs.container, "no-scrollbar")}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
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
                ? cn(tab.color, tab.hoverColor)
                : cn(s.tabs.buttonInactive, tab.hoverColor),
            )}
          >
            {/* Per-tab color neon glow pill */}
            {isActive && (
              <motion.div
                layoutId="seo-active-pill"
                className={cn(s.tabs.pill, tab.pillBg, tab.glow)}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2">
              {loading ? (
                <div
                  className={cn(s.tabs.spinner, isActive ? tab.color : "")}
                />
              ) : (
                <tab.icon
                  className={cn(
                    s.tabs.icon,
                    isActive
                      ? cn(
                          s.tabs.iconActive,
                          "drop-shadow-[0_0_6px_currentColor]",
                        )
                      : s.tabs.iconInactive,
                  )}
                />
              )}
              <span
                className={cn(
                  s.tabs.label,
                  "transition-all duration-300",
                  isActive && "drop-shadow-[0_0_8px_currentColor] font-black",
                )}
              >
                {tab.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  History,
  Zap,
  Users,
  Building2,
  Map,
  Globe,
  LucideIcon,
} from "lucide-react";
import { WorldTab } from "../tabs/WorldTabs";

interface WorldLoadingTabProps {
  type: WorldTab;
}

const TAB_CONFIG: Record<
  WorldTab,
  { label: string; subtext: string; icon: LucideIcon; accentColor: string }
> = {
  manifest: {
    label: "World Manifest",
    subtext: "Synthesizing the foundation of your reality...",
    icon: Globe,
    accentColor: "text-studio",
  },
  lore: {
    label: "Historical Timeline",
    subtext: "Weaving the threads of eras and legendary events...",
    icon: History,
    accentColor: "text-fuchsia-500",
  },
  powers: {
    label: "Power System",
    subtext: "Manifesting the metaphysical laws and tiers...",
    icon: Zap,
    accentColor: "text-amber-500",
  },
  factions: {
    label: "Faction Politics",
    subtext: "Calculating social webs and conflicting ideologies...",
    icon: Users,
    accentColor: "text-cyan-500",
  },
  architecture: {
    label: "Visual Style",
    subtext: "Architecting structural motifs and aesthetics...",
    icon: Building2,
    accentColor: "text-amber-500",
  },
  atlas: {
    label: "World Atlas",
    subtext: "Mapping geographic biomes and regional bounds...",
    icon: Map,
    accentColor: "text-cyan-500",
  },
  culture: {
    label: "Societal Ethos",
    subtext: "Profiling rituals, daily life, and traditions...",
    icon: Globe,
    accentColor: "text-fuchsia-500",
  },
  systems: {
    label: "World Dynamics",
    subtext: "Engineering ecosystems and signature tech...",
    icon: Cpu,
    accentColor: "text-emerald-500",
  },
};

export const WorldLoadingTab: React.FC<WorldLoadingTabProps> = ({ type }) => {
  const config = TAB_CONFIG[type] || TAB_CONFIG.manifest;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-10 animate-in fade-in duration-700">
      <div className="relative">
        {/* Pulse Ring */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 m-auto w-32 h-32 rounded-full bg-studio/20 blur-xl`}
        />

        {/* Spinning Outer Ring */}
        <div
          className={`w-24 h-24 border-2 border-white/5 border-t-studio rounded-full animate-spin shadow-[0_0_40px_rgba(6,182,212,0.2)]`}
        />

        {/* Central Icon */}
        <div className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center">
          <Icon
            className={`w-10 h-10 ${config.accentColor} animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]`}
          />
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-1">
          <p className="font-black tracking-[0.5em] text-xs uppercase text-zinc-500">
            AI Neural Synchronization
          </p>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            {config.label} <span className="text-studio">Sovereignty</span>
          </h3>
        </div>

        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
          {config.subtext}
        </p>

        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-studio animate-ping" />
            <span className="text-xs font-black text-studio/60 uppercase tracking-widest">
              Logic: Stable
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-studio animate-ping delay-150" />
            <span className="text-xs font-black text-studio/60 uppercase tracking-widest">
              Core: Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import {
  Camera,
  Eye,
  Maximize2,
  RotateCcw,
  Triangle,
  Move,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { storyboardStyles as s } from "../storyboardStyles";
import { motion } from "framer-motion";

const shotTypes = [
  {
    label: "Extreme Wide",
    code: "EWS",
    description:
      "Establishes environment. Character is a tiny element in the vast world.",
    color: "from-blue-500/10 via-blue-500/5 to-transparent",
    border:
      "border-blue-500/15 hover:border-blue-500/35 shadow-[0_0_30px_rgba(59,130,246,0.02)]",
    icon: "🌐",
    glow: "bg-blue-500/5",
  },
  {
    label: "Wide Shot",
    code: "WS",
    description:
      "Full character in frame with surrounding environment context.",
    color: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    border:
      "border-cyan-500/15 hover:border-cyan-500/35 shadow-[0_0_30px_rgba(6,182,212,0.02)]",
    icon: "🏙️",
    glow: "bg-cyan-500/5",
  },
  {
    label: "Medium Shot",
    code: "MS",
    description: "Waist-up framing. Standard dialogue and action scenes.",
    color: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    border:
      "border-emerald-500/15 hover:border-emerald-500/35 shadow-[0_0_30px_rgba(16,185,129,0.02)]",
    icon: "🧍",
    glow: "bg-emerald-500/5",
  },
  {
    label: "Close-Up",
    code: "CU",
    description:
      "Face and shoulders. Emotional intensity and reaction moments.",
    color: "from-amber-500/10 via-amber-500/5 to-transparent",
    border:
      "border-amber-500/15 hover:border-amber-500/35 shadow-[0_0_30px_rgba(245,158,11,0.02)]",
    icon: "😤",
    glow: "bg-amber-500/5",
  },
  {
    label: "Extreme Close-Up",
    code: "ECU",
    description: "Eyes, hands, or key object. Maximum dramatic tension.",
    color: "from-rose-500/10 via-rose-500/5 to-transparent",
    border:
      "border-rose-500/15 hover:border-rose-500/35 shadow-[0_0_30px_rgba(244,63,94,0.02)]",
    icon: "👁️",
    glow: "bg-rose-500/5",
  },
  {
    label: "Over-the-Shoulder",
    code: "OTS",
    description:
      "Conversation framing. Keeps subject in spatial relation to speaker.",
    color: "from-orange-500/10 via-orange-500/5 to-transparent",
    border:
      "border-orange-500/15 hover:border-orange-500/35 shadow-[0_0_30px_rgba(249,115,22,0.02)]",
    icon: "↩️",
    glow: "bg-orange-500/5",
  },
];

const angles = [
  {
    label: "Eye Level",
    icon: Eye,
    desc: "Neutral, naturalistic. Standard narrative perspective.",
    color:
      "text-blue-400 bg-blue-500/5 border-blue-500/10 hover:border-blue-500/30",
  },
  {
    label: "Low Angle",
    icon: Triangle,
    desc: "Power, dominance. Makes subject appear imposing.",
    color:
      "text-orange-400 bg-orange-500/5 border-orange-500/10 hover:border-orange-500/30",
  },
  {
    label: "High Angle",
    icon: Maximize2,
    desc: "Vulnerability, smallness. Used in defeat or reflection.",
    color:
      "text-amber-400 bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30",
  },
  {
    label: "Dutch Angle",
    icon: RotateCcw,
    desc: "Unease, psychological tension. Tilted horizon line.",
    color:
      "text-rose-400 bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30",
  },
  {
    label: "POV Shot",
    icon: Move,
    desc: "First-person perspective. Audience inhabits character's view.",
    color:
      "text-emerald-400 bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30",
  },
];

export const AnglesTab: React.FC = () => {
  return (
    <div className={s.tabContent + " animate-in fade-in duration-700"}>
      {/* Header */}
      <div className={s.tabSectionHeader}>
        <div
          className={cn(
            s.tabHeaderIconBox,
            "bg-studio/10 border-studio/20 shadow-[0_0_40px_rgba(6,182,212,0.15)]",
          )}
        >
          <Camera className="w-8 h-8 text-studio animate-pulse" />
        </div>
        <div className="text-left">
          <h2 className={s.tabSectionTitle}>Shot Angles</h2>
          <p className={s.tabSectionSubtitle}>
            Camera blocking, lens selection, and cinematic framing guides
          </p>
        </div>
      </div>

      {/* Shot Types */}
      <div className="space-y-8">
        <h3 className={s.tabGridTitle}>
          <Camera className="w-4 h-4 text-studio" /> Shot Type Reference Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shotTypes.map((shot, i) => (
            <motion.div
              key={shot.code}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "p-8 bg-gradient-to-br rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group",
                shot.color,
                shot.border,
              )}
            >
              <div
                className={cn(
                  "absolute top-0 right-0 w-24 h-24 blur-3xl pointer-events-none",
                  shot.glow,
                )}
              />
              <div className="flex items-center justify-between relative z-10">
                <span className="text-3xl">{shot.icon}</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                  {shot.code}
                </span>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest mt-6 relative z-10">
                {shot.label}
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed font-bold uppercase tracking-wide mt-3 relative z-10">
                {shot.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Camera Angles */}
      <div className="space-y-8">
        <h3 className={s.tabGridTitle + " uppercase"}>Angle Diagnostics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {angles.map((angle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "flex items-start gap-5 p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group",
                angle.color,
              )}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-500">
                <angle.icon className="w-5 h-5 text-studio" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                  {angle.label}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-2 font-bold uppercase tracking-wide leading-relaxed">
                  {angle.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

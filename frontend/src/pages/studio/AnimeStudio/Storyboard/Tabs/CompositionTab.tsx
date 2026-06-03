import React from "react";
import { Layers } from "lucide-react";
import { SceneTimeline } from "../components/SceneTimeline";
import { Moodboard } from "../../components/Moodboard/Moodboard";
import { SoundscapeLibrary } from "../../components/Audio/SoundscapeLibrary";
import { storyboardStyles as s } from "../storyboardStyles";
import { cn } from "@/lib/utils";

import { StoryboardPageContext } from "../StoryboardPage";

interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
  duration: string;
  linkedPrompt?: string;
  videoPrompt?: string;
  soulFocus?: string;
  vfxCompounds?: string;
  emotionalKey?: string;
  subtext?: string;
  assets?: string;
}

interface CompositionTabProps {
  scenes?: Scene[];
}

export const CompositionTab: React.FC<CompositionTabProps> = ({
  scenes: propsScenes,
}) => {
  const context = React.useContext(StoryboardPageContext);
  const scenes = propsScenes || context?.scenes || [];
  return (
    <div className={s.tabContent + " animate-in fade-in duration-700"}>
      {/* Header */}
      <div className={s.tabSectionHeader}>
        <div
          className={cn(
            s.tabHeaderIconBox,
            "bg-amber-500/10 border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.15)]",
          )}
        >
          <Layers className="w-8 h-8 text-amber-400 animate-pulse" />
        </div>
        <div className="text-left">
          <h2 className={s.tabSectionTitle}>Composition Suite</h2>
          <p className={s.tabSectionSubtitle}>
            Scene timeline, visual moodboard, and spatial arrangement
          </p>
        </div>
      </div>

      {/* Scene Timeline */}
      {scenes.length > 0 ? (
        <SceneTimeline scenes={scenes} />
      ) : (
        <div className="py-10 text-center">
          <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">
            No scenes found — generate a script and parse the storyboard first.
          </p>
        </div>
      )}

      {/* Moodboard + Soundscape side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-white/5">
        <Moodboard />
        <SoundscapeLibrary />
      </div>
    </div>
  );
};

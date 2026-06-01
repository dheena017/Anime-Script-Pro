import React from "react";
import { History, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { worldStyles as s } from "../worldStyles";

interface LoreChronicleProps {
  lore?: string;
}

export const LoreChronicle: React.FC<LoreChronicleProps> = ({ lore }) => {
  // Parse lore milestones if they exist, or use high-quality dynamic placeholders
  const milestones = React.useMemo(() => {
    if (!lore)
      return [
        {
          era: "FOUNDATION",
          label: "Neo-Genesis",
          desc: "The architectural seeds of this reality are awaiting deployment.",
        },
        {
          era: "STRIFE",
          label: "Tension Mapping",
          desc: "Analyzing potential ideological conflicts for this world...",
        },
        {
          era: "THE NOW",
          label: "Initial Point",
          desc: "The starting point of your narrative timeline.",
        },
      ];

    return [
      {
        era: "LEGACY",
        label: "Historical Core",
        desc: "The weight of past events as defined in your lore.",
      },
      {
        era: "CONFLICT",
        label: "Active Friction",
        desc: "The current state of sociopolitical and magical tension.",
      },
      {
        era: "THRESHOLD",
        label: "Current Era",
        desc: "The exact moment where your story begins.",
      },
    ];
  }, [lore]);

  return (
    <div className="chronicle-container">
      <div className="chronicle-header">
        <h3 className="chronicle-title">
          <History className="w-4 h-4 text-cyan-500" />
          The Great Chronicle
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className={cn(s.actionButtonGhost, "px-4 py-2 text-xs")}
        >
          Sync Lore <Sparkles className="w-3 h-3 ml-2" />
        </Button>
      </div>

      <div className="chronicle-timeline">
        <div className="chronicle-line" />

        {milestones.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="chronicle-dot" />
            <div className="space-y-1">
              <span className="chronicle-era">{item.era}</span>
              <h4 className="chronicle-label">{item.label}</h4>
              <p className="chronicle-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            s.actionIconButtonSmall,
            "h-6 w-6 hover:text-cyan-500 hover:border-cyan-500/30 hover:bg-cyan-500/5",
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

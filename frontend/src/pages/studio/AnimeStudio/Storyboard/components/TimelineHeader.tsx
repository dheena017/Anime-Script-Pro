import React from "react";
import { Timer } from "lucide-react";

interface TimelineHeaderProps {
  totalDuration: number;
  seriesPlan?: string;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  totalDuration,
  seriesPlan = "60 Episode Series Plan",
}) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
        <Timer className="w-4 h-4" />
        Production Timeline
      </h3>
      <div className="flex items-center gap-4 text-xs font-bold text-studio/60 uppercase tracking-widest">
        <span>{totalDuration}s Estimated</span>
        <div className="w-[1px] h-3 bg-zinc-800" />
        <span>{seriesPlan}</span>
      </div>
    </div>
  );
};

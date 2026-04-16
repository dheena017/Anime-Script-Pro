import React from 'react';
import { Flag, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Beat {
  id: string;
  label: string;
  lineIndex: number;
}

interface BeatBoardProps {
  beats: Beat[];
  onBeatClick: (lineIndex: number) => void;
  activeLineIndex?: number;
}

export function BeatBoard({ beats, onBeatClick, activeLineIndex = 0 }: BeatBoardProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
        <Flag className="w-3.5 h-3.5 text-red-500" /> Story Beat Board
      </h3>
      <div className="space-y-1 bg-black/20 rounded-xl p-2 border border-white/5">
        {beats.length === 0 ? (
          <p className="text-[10px] text-zinc-600 italic px-2 py-4 text-center">No structural beats detected.</p>
        ) : (
          beats.map((beat) => (
            <button
              key={beat.id}
              onClick={() => onBeatClick(beat.lineIndex)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left group",
                Math.abs(activeLineIndex - beat.lineIndex) < 5 
                  ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                  : "hover:bg-zinc-900/50 text-zinc-500"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  Math.abs(activeLineIndex - beat.lineIndex) < 5 ? "bg-red-500 animate-pulse" : "bg-zinc-800"
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest">{beat.label}</span>
              </div>
              <ChevronRight className={cn(
                "w-3 h-3 transition-transform",
                Math.abs(activeLineIndex - beat.lineIndex) < 5 ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              )} />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

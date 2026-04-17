import React from 'react';
import { cn } from '@/lib/utils';

interface SentimentHeatmapProps {
  sentimentMap: string[];
}

export function SentimentHeatmap({ sentimentMap }: SentimentHeatmapProps) {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-1 flex flex-col pointer-events-none">
      {sentimentMap.map((tone, idx) => (
        <div
          key={idx}
          className={cn(
            "flex-1 w-full opacity-40 transition-all duration-500",
            tone === 'action' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
            tone === 'sad' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
            tone === 'comedy' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
            'bg-transparent'
          )}
        />
      ))}
    </div>
  );
}

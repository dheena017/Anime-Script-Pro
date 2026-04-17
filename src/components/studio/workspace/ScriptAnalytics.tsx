import React from 'react';
import { ProductionAnalytics } from './ProductionAnalytics';
import { BeatBoard } from './BeatBoard';
import { SentimentHeatmap } from './SentimentHeatmap';
import { Beat } from '../scriptWorkspaceUtils';

interface ScriptAnalyticsProps {
  charStats: Array<{name: string, count: number}>;
  sentimentMap: string[];
  totalLines: number;
  characterVoices: Record<string, string>;
  onAssignVoice: (char: string, voice: string) => void;
  beats: Beat[];
  onBeatClick: (index: number) => void;
  activeLineIndex: number;
}

export function ScriptAnalytics({
  charStats,
  sentimentMap,
  totalLines,
  characterVoices,
  onAssignVoice,
  beats,
  onBeatClick,
  activeLineIndex
}: ScriptAnalyticsProps) {
  return (
    <div className="space-y-6">
      <ProductionAnalytics 
        characterStats={charStats}
        sentimentMap={sentimentMap}
        totalLines={totalLines}
        characterVoices={characterVoices}
        onAssignVoice={onAssignVoice}
      />
      <BeatBoard 
        beats={beats} 
        onBeatClick={onBeatClick} 
        activeLineIndex={activeLineIndex}
      />
      <SentimentHeatmap sentimentMap={sentimentMap} />
    </div>
  );
}

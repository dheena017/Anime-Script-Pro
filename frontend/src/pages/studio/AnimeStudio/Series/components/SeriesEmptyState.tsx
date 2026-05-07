import React from 'react';
import { Map, Layout, List, Calendar, TrendingUp, Package, Layout as LayoutGrid } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface SeriesEmptyStateProps {
  onLaunch: () => void;
  onLoadDemo: () => void;
  isGenerating: boolean;
}

export const SeriesEmptyState: React.FC<SeriesEmptyStateProps> = ({
  onLaunch,
  onLoadDemo,
  isGenerating
}) => {
  const features = [
    { icon: Layout, title: 'Strategic Blueprint', description: 'Technical breakdown of pacing and production goals', color: 'cyan' },
    { icon: Map, title: 'Series Roadmap', description: 'Holistic multi-season vision and thematic pillars', color: 'amber' },
    { icon: List, title: 'Episode Matrix', description: 'Granular loglines and beat sheets for all episodes', color: 'emerald' },
    { icon: Calendar, title: 'Dynamic Timeline', description: 'Chronological event tracking and world-state evolution', color: 'rose' },
    { icon: TrendingUp, title: 'Narrative Arcs', description: 'Emotional resonance mapping and intensity scaling', color: 'fuchsia' },
    { icon: Package, title: 'Asset Library', description: 'Automated extraction of locations and requirements', color: 'indigo' }
  ];

  return (
    <StudioEmptyState
      icon={LayoutGrid}
      title="No Series Plan"
      description="The narrative roadmap for your production is missing. Generate a multi-episode blueprint to see your story mapped out."
      actionLabel={isGenerating ? "Structuring Your Series..." : "Create Series Plan"}
      onAction={onLaunch}
      isLoading={isGenerating}
      secondaryActionLabel="Load Aetheria Sample Production"
      onSecondaryAction={onLoadDemo}
      features={features}
      accentColor="amber"
    />
  );
};





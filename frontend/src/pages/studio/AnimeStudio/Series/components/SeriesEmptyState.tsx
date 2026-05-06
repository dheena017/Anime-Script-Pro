import React from 'react';
import { Layout as LayoutGrid, TrendingUp, GitBranch, Layers } from 'lucide-react';
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
    { icon: TrendingUp, title: 'Arc Synthesis', description: 'AI maps character growth and plot intensity over multiple episodes' },
    { icon: GitBranch, title: 'Branching Narratives', description: 'Identifies potential plot points for future seasons' },
    { icon: Layers, title: 'Structural Integrity', description: 'Ensures thematic consistency across the entire series' }
  ];

  return (
    <div className="space-y-12">
      <StudioEmptyState
        icon={LayoutGrid}
        title="No Series Plan"
        description="The narrative roadmap for your production is missing. Generate a multi-episode blueprint to see your story mapped out."
        actionLabel="Create Series Plan"
        loadingLabel="Structuring Your Series..."
        onAction={onLaunch}
        isLoading={isGenerating}
        features={features}
        accentColor="amber"
      />
      
      <div className="flex flex-col items-center gap-4 pt-8 border-t border-white/5">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Quick Start Visualization</p>
        <button 
          onClick={onLoadDemo}
          className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-all duration-300"
        >
          Load Aetheria Sample Production
        </button>
      </div>
    </div>
  );
};





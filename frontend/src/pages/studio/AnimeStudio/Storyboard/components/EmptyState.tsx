import React from 'react';
import { Layout, Sparkles, Zap, Box } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface EmptyStateProps {
  onLaunch: () => void;
  isGenerating?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onLaunch, isGenerating = false }) => {
  const features = [
    { icon: Sparkles, title: 'Visual Synthesis', description: 'AI maps script sequences to cinematic frames' },
    { icon: Zap, title: 'Scene Flow', description: 'Ensures visual continuity across sequences' },
    { icon: Box, title: 'Asset Injection', description: 'Seamlessly integrates custom visual assets' }
  ];

  return (
    <StudioEmptyState
      icon={Layout}
      title="Void Terminal"
      description="Storyboard buffer is empty. Initiate Production Core or inject a manual unit to begin visualization."
      actionLabel="Inject Scene"
      loadingLabel="Rendering Optics..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="studio"
    />
  );
};





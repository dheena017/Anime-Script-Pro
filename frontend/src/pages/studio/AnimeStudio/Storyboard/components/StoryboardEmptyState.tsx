import React from 'react';
import { Layout, Box, Play, Camera } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface StoryboardEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const StoryboardEmptyState: React.FC<StoryboardEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: Box, title: 'Spatial Rendering', description: 'AI maps 3D coordinates for cinematic depth' },
    { icon: Play, title: 'Dynamic Flow', description: 'Ensures visual continuity between frames' },
    { icon: Camera, title: 'Shot Composition', description: 'Auto-generates professional camera angles' }
  ];

  return (
    <StudioEmptyState
      icon={Layout}
      title="Optics Not Synthesized"
      description="The visual flow of your production is currently invisible. Initialize the Storyboard Engine to render cinematic frames based on your script."
      actionLabel="Initialize Storyboard"
      loadingLabel="Rendering Optics..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="rose"
    />
  );
};





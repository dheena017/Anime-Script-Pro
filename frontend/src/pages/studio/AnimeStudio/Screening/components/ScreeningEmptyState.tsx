import React from 'react';
import { Play, Film, Mic, Monitor } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface ScreeningEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const ScreeningEmptyState: React.FC<ScreeningEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: Film, title: 'Final Assembly', description: 'AI combines visual frames, script timing, and transitions' },
    { icon: Mic, title: 'Audio Synthesis', description: 'Synchronizes character voices, foley, and score' },
    { icon: Monitor, title: 'Quality Mastering', description: 'Applies final cinematic filters and resolution scaling' }
  ];

  return (
    <StudioEmptyState
      icon={Play}
      title="Projector Inactive"
      description="The final assembly of your anime assets has not been synthesized. Initialize the Screening Room to combine script, storyboard, and audio into a final production."
      actionLabel="Initialize Screening"
      loadingLabel="Synthesizing Final Cut..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="emerald"
    />
  );
};





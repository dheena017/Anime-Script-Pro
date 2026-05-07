import React from 'react';
import { Globe, Map, Book, Shield } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface WorldEmptyStateProps {
  onLaunch: () => void;
  onLoadDemo?: () => void;
  isGenerating: boolean;
}

export const WorldEmptyState: React.FC<WorldEmptyStateProps> = ({
  onLaunch,
  onLoadDemo,
  isGenerating
}) => {
  const features = [
    { 
      icon: Map, 
      title: 'Geographic Synthesis', 
      description: 'AI manifests terrain, climates, and strategic points', 
      color: 'cyan' 
    },
    { 
      icon: Book, 
      title: 'Lore Generation', 
      description: 'Auto-generates historical timelines and cultural norms', 
      color: 'fuchsia' 
    },
    { 
      icon: Shield, 
      title: 'Rule Definition', 
      description: 'Defines the metaphysical and physical laws of reality', 
      color: 'amber' 
    }
  ];

  return (
    <StudioEmptyState
      icon={Globe}
      title="Build Your World"
      description="Your story's foundation is currently empty. Generate your world to see its history, geography, and laws come to life."
      actionLabel={isGenerating ? "Crafting Your World..." : "Create My World"}
      onAction={onLaunch}
      isLoading={isGenerating}
      secondaryActionLabel="Load Aetheria Demo World"
      onSecondaryAction={onLoadDemo}
      features={features}
      accentColor="studio"
    />
  );
};





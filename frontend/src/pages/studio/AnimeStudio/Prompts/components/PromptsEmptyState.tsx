import React from 'react';
import { Terminal, Code, Cpu, Command } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface PromptsEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const PromptsEmptyState: React.FC<PromptsEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: Code, title: 'Technical Syntax', description: 'AI formats prompts for best results with each model' },
    { icon: Cpu, title: 'Compute Efficiency', description: 'Reduces token overhead while maintaining visual fidelity' },
    { icon: Command, title: 'Directives Sync', description: 'Ensures prompts align with script technical notes' }
  ];

  return (
    <StudioEmptyState
      icon={Terminal}
      title="No Prompts Available"
      description="Your production is missing generation prompts. Create optimized prompts to guide visual and audio generation engines."
      actionLabel="Generate Prompts"
      loadingLabel="Writing Prompts..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="cyan"
    />
  );
};





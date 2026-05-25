import React from 'react';
import { FileText, MessageSquare, PenTool, Terminal } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface ScriptEmptyStateProps {
  onLaunch: () => void;
  onLoadDemo?: () => void;
  isGenerating: boolean;
}

export const ScriptEmptyState: React.FC<ScriptEmptyStateProps> = ({
  onLaunch,
  onLoadDemo,
}) => {
  const features = [
    { icon: MessageSquare, title: 'Dynamic Dialogue', description: 'AI synthesizes character-specific speech patterns' },
    { icon: PenTool, title: 'Technical Directives', description: 'Auto-generates cinematic staging and instructions' },
    { icon: Terminal, title: 'Logic Validation', description: 'Ensures narrative consistency across scenes' }
  ];

  return (
    <StudioEmptyState
      icon={FileText}
      title="Empty Script"
      description="Your project has a story, but the script is unwritten. Generate a comprehensive script with dialogue, scenes, and stage directions."
      secondaryActionLabel="Load Aetheria Script Demo"
      onSecondaryAction={onLoadDemo}
      features={features}
      accentColor="studio"
    />
  );
};





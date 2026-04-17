import React from 'react';
import { Palette } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

interface PromptsHeaderProps {
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
  children?: React.ReactNode;
}

export function PromptsTopBar({ onGenerate, isLoading, disabled, children }: PromptsHeaderProps) {
  return (
    <StudioModuleWrapper
      title="IMAGE ENGINE"
      subtitle="Visual Synthesis"
      description="Advanced architectural drafting of visual prompts, lighting specs, and cinematic composition data."
      icon={<Palette className="w-4 h-4" />}
      onAction={onGenerate}
      isActionLoading={isLoading}
      actionDisabled={disabled}
      actionLabel={isLoading ? 'SYNTHESIZING...' : 'BEGIN SYNTHESIS'}
    >
      {children}
    </StudioModuleWrapper>
  );
}

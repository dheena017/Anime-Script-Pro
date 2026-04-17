import React from 'react';
import { Users } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

interface CastHeaderProps {
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
  children?: React.ReactNode;
}

export function CastTopBar({ onGenerate, isLoading, disabled, children }: CastHeaderProps) {
  return (
    <StudioModuleWrapper
      title="CHARACTER ENGINE"
      subtitle="Personnel Archive"
      description="Neural architecture specialized in archetype construction, psychological depth, and visual design specs."
      icon={<Users className="w-3 h-3" />}
      onAction={onGenerate}
      isActionLoading={isLoading}
      actionDisabled={disabled}
    >
      {children}
    </StudioModuleWrapper>
  );
}

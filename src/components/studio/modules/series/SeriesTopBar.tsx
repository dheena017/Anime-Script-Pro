import React from 'react';
import { Map } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

interface SeriesHeaderProps {
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
  actionLabel: string;
  children?: React.ReactNode;
}

export function SeriesTopBar({ 
  onGenerate, 
  isLoading, 
  disabled, 
  actionLabel, 
  children 
}: SeriesHeaderProps) {
  return (
    <StudioModuleWrapper
      title="SERIES BIBLE"
      subtitle="World Architecture"
      description="The neural repository for your world's laws, factions, and visual history. Continuity is non-negotiable."
      icon={<Map className="w-3 h-3" />}
      onAction={onGenerate}
      isActionLoading={isLoading}
      actionDisabled={disabled}
      actionLabel={actionLabel}
    >
      {children}
    </StudioModuleWrapper>
  );
}

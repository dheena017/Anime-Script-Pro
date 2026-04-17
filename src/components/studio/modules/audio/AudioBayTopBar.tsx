import React from 'react';
import { Mic } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

interface AudioBayHeaderProps {
  onAction: () => void;
  isLoading?: boolean;
  actionDisabled?: boolean;
  actionLabel?: string;
  children?: React.ReactNode;
}

export function AudioBayTopBar({ onAction, isLoading, actionDisabled, actionLabel, children }: AudioBayHeaderProps) {
  return (
    <StudioModuleWrapper
      title="AUDIO BAY"
      subtitle="Acoustic Engineering"
      description="Symphonic orchestration for the modern era. Narrative table reads, neural sound design, and lip-sync synchronization sequences."
      icon={<Mic className="w-3 h-3" />}
      onAction={onAction}
      isActionLoading={isLoading}
      actionDisabled={actionDisabled}
      actionLabel={actionLabel}
    >
      {children}
    </StudioModuleWrapper>
  );
}

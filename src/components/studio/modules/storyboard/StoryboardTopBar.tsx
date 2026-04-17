import React from 'react';
import { Layout } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

interface StoryboardHeaderProps {
  children?: React.ReactNode;
}

export function StoryboardTopBar({ children }: StoryboardHeaderProps) {
  return (
    <StudioModuleWrapper
      title="DIRECTOR STORYBOARD"
      subtitle="Visual Sequencing"
      description="The neural canvas for scene orchestration, visual pacing, and animatic previews. Frame your vision with absolute precision."
      icon={<Layout className="w-4 h-4" />}
    >
      {children}
    </StudioModuleWrapper>
  );
}

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

export function FrameworkTopBar({ children }: { children?: React.ReactNode }) {
  return (
    <StudioModuleWrapper
      title="NEURAL FRAMEWORK"
      subtitle="Operational Logic"
      description="The definitive scene-by-scene methodology for high-velocity production and narrative scaling."
      icon={<LayoutGrid className="w-4 h-4" />}
    >
      {children}
    </StudioModuleWrapper>
  );
}

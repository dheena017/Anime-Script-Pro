import React from 'react';
import { Play } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

export function ExampleTopBar({ children }: { children?: React.ReactNode }) {
  return (
    <StudioModuleWrapper
      title="REFERENCE MASTERPIECE"
      subtitle="Excellence Benchmark"
      description="A high-fidelity production script demonstrating optimal pacing, dialogue density, and thematic depth."
      icon={<Play className="w-4 h-4" />}
    >
      {children}
    </StudioModuleWrapper>
  );
}

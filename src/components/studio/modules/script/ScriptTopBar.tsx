import React from 'react';
import { Sparkles } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

export function ScriptTopBar({ children }: { children?: React.ReactNode }) {
  return (
    <StudioModuleWrapper
      title="PRODUCTION SCRIPT"
      subtitle="Neural Scripting"
      description="The neural engine for multi-path script generation, scene architectural consistency, and dialogue optimization."
      icon={<Sparkles className="w-4 h-4" />}
    >
      {children}
    </StudioModuleWrapper>
  );
}

import React from 'react';
import { ScrollText } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

export function TemplateTopBar({ children }: { children?: React.ReactNode }) {
  return (
    <StudioModuleWrapper
      title="PRODUCTION TEMPLATE"
      subtitle="Structural Integrity"
      description="The definitive blueprint for high-impact anime screenplays. Optimized for neural generation and production flow."
      icon={<ScrollText className="w-4 h-4" />}
    >
      {children}
    </StudioModuleWrapper>
  );
}

import React from 'react';
import { Globe } from 'lucide-react';
import { StudioModuleWrapper } from '@/components/studio/core/StudioModuleWrapper';

interface SEOHeaderProps {
  children?: React.ReactNode;
}

export function SEOTopBar({ children }: SEOHeaderProps) {
  return (
    <StudioModuleWrapper
      title="SEO OPTIMIZER"
      subtitle="Distribution Intelligence"
      description="Strategic metadata generation for platform saturation, high-retention discovery, and global search dominance."
      icon={<Globe className="w-4 h-4" />}
    >
      {children}
    </StudioModuleWrapper>
  );
}

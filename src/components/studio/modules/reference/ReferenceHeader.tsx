import React from 'react';
import { StudioModuleWrapper } from '@/components/studio/StudioModuleWrapper';

interface ReferenceHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export function ReferenceHeader({ 
  title, 
  subtitle, 
  description, 
  icon, 
  children 
}: ReferenceHeaderProps) {
  return (
    <StudioModuleWrapper
      title={title}
      subtitle={subtitle}
      description={description}
      icon={icon}
    >
      {children}
    </StudioModuleWrapper>
  );
}

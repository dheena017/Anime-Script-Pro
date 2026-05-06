import React from 'react';
import { ProtectedRoute } from '@/pages/auth/components/ProtectedRoute';
import { GeneratorProvider as GlobalGeneratorProvider } from '@/contexts/GeneratorContext';
import { GeneratorProvider as ModularGeneratorProvider } from '@/contexts/generator';

interface StudioContextWrapperProps {
  children: React.ReactNode;
}

export function StudioContextWrapper({ children }: StudioContextWrapperProps) {
  return (
    <ProtectedRoute>
      <GlobalGeneratorProvider>
        <ModularGeneratorProvider>
          {children}
        </ModularGeneratorProvider>
      </GlobalGeneratorProvider>
    </ProtectedRoute>
  );
}

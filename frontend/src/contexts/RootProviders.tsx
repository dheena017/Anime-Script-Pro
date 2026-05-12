import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { GeneratorProvider as GlobalGeneratorProvider } from '@/contexts/GeneratorContext';
import { GeneratorProvider as ModularGeneratorProvider } from '@/contexts/generator';
import { LogProvider } from '@/contexts/LogContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MotionConfig } from 'framer-motion';

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <AuthProvider>
          <NotificationProvider>
            <TooltipProvider>
              <LogProvider>
                <GlobalGeneratorProvider>
                  <ModularGeneratorProvider>
                    {children}
                  </ModularGeneratorProvider>
                </GlobalGeneratorProvider>
              </LogProvider>
            </TooltipProvider>
          </NotificationProvider>
        </AuthProvider>
      </AppProvider>
    </MotionConfig>
  );
}

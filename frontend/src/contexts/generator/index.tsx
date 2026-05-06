import React from 'react';
import { EngineProvider } from './EngineContext';
import { WorldProvider } from './WorldContext';
import { CastProvider } from './CastContext';
import { SEOProvider } from './SEOContext';
import { StoryboardProvider } from './StoryboardContext';

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  return (
    <EngineProvider>
      <WorldProvider>
        <CastProvider>
          <SEOProvider>
            <StoryboardProvider>
              {children}
            </StoryboardProvider>
          </SEOProvider>
        </CastProvider>
      </WorldProvider>
    </EngineProvider>
  );
}

export * from './EngineContext';
export * from './WorldContext';
export * from './CastContext';
export * from './SEOContext';
export * from './StoryboardContext';

import React from 'react';
import { EngineProvider } from './EngineContext';
import { WorldProvider } from './WorldContext';
import { CharacterProvider } from './CharacterContext';
import { SEOProvider } from './SEOContext';
import { StoryboardProvider } from './StoryboardContext';

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  return (
    <EngineProvider>
      <WorldProvider>
        <CharacterProvider>
          <SEOProvider>
            <StoryboardProvider>
              {children}
            </StoryboardProvider>
          </SEOProvider>
        </CharacterProvider>
      </WorldProvider>
    </EngineProvider>
  );
}

export * from './EngineContext';
export * from './WorldContext';
export * from './CharacterContext';
export * from './SEOContext';
export * from './StoryboardContext';

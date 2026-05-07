import React from 'react';

/**
 * Storyboard Command Center
 * Visualizes the cinematic flow, keyframes, and scene composition.
 */

export interface StoryboardDataContextType {
  frames: any[];
  isRendering: boolean;
  handlers: {
    generateFrames: () => Promise<void>;
    exportStoryboard: () => void;
    syncStoryboard: () => Promise<void>;
  };
}

export const StoryboardCommandCenterContext = React.createContext<StoryboardDataContextType | null>(null);

export const useStoryboardCommandCenter = () => {
  const context = React.useContext(StoryboardCommandCenterContext);
  if (!context) {
    throw new Error('useStoryboardCommandCenter must be used within a StoryboardCommandCenterProvider');
  }
  return context;
};

export const StoryboardCommandCenterProvider: React.FC<{children: React.ReactNode, frames: any[], handlers: any}> = ({ 
  children, 
  frames,
  handlers 
}) => {
  const value: StoryboardDataContextType = {
    frames: frames || [],
    isRendering: false,
    handlers: {
      generateFrames: handlers.generateFrames || (async () => {}),
      exportStoryboard: handlers.exportStoryboard || (() => {}),
      syncStoryboard: handlers.syncStoryboard || (async () => {}),
    }
  };

  return (
    <StoryboardCommandCenterContext.Provider value={value}>
      {children}
    </StoryboardCommandCenterContext.Provider>
  );
};

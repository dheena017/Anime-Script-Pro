import React from 'react';
import { useDiagnostic } from '../../Diagnostic/context/DiagnosticCommandCenter';

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
  const { updateModuleStatus, updateModuleMetrics } = useDiagnostic();

  React.useEffect(() => {
    if (frames && frames.length > 0) {
      updateModuleStatus('storyboard', 'healthy');
    }
  }, [frames, updateModuleStatus]);

  const value: StoryboardDataContextType = {
    frames: frames || [],
    isRendering: false,
    handlers: {
      generateFrames: async () => {
        updateModuleStatus('storyboard', 'syncing');
        const start = performance.now();
        try {
          await (handlers.generateFrames || (async () => {}))();
          updateModuleMetrics('storyboard', { loadTime: Math.round(performance.now() - start) });
          updateModuleStatus('storyboard', 'healthy');
        } catch (e) {
          updateModuleStatus('storyboard', 'error');
          throw e;
        }
      },
      exportStoryboard: handlers.exportStoryboard || (() => {}),
      syncStoryboard: async () => {
        updateModuleStatus('storyboard', 'syncing');
        try {
          await (handlers.syncStoryboard || (async () => {}))();
          updateModuleStatus('storyboard', 'healthy');
        } catch (e) {
          updateModuleStatus('storyboard', 'error');
          throw e;
        }
      },
    }
  };

  return (
    <StoryboardCommandCenterContext.Provider value={value}>
      {children}
    </StoryboardCommandCenterContext.Provider>
  );
};

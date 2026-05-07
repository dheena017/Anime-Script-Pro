import React from 'react';
import { useDiagnostic } from '../../Diagnostic/context/DiagnosticCommandCenter';

/**
 * Prompts Command Center
 * Central library for image prompts, visual DNA, and model configurations.
 */

export interface PromptsDataContextType {
  prompts: any[];
  currentModel: string;
  handlers: {
    generatePrompts: () => Promise<void>;
    savePrompt: (prompt: string) => void;
    syncPrompts: () => Promise<void>;
  };
}

export const PromptsCommandCenterContext = React.createContext<PromptsDataContextType | null>(null);

export const usePromptsCommandCenter = () => {
  const context = React.useContext(PromptsCommandCenterContext);
  if (!context) {
    throw new Error('usePromptsCommandCenter must be used within a PromptsCommandCenterProvider');
  }
  return context;
};

export const PromptsCommandCenterProvider: React.FC<{children: React.ReactNode, prompts: any[], handlers: any}> = ({ 
  children, 
  prompts,
  handlers 
}) => {
  const { updateModuleStatus, updateModuleMetrics } = useDiagnostic();

  React.useEffect(() => {
    if (prompts && prompts.length > 0) {
      updateModuleStatus('prompts', 'healthy');
    }
  }, [prompts, updateModuleStatus]);

  const value: PromptsDataContextType = {
    prompts: prompts || [],
    currentModel: 'Stable Diffusion XL / Midjourney v6',
    handlers: {
      generatePrompts: async () => {
        updateModuleStatus('prompts', 'syncing');
        const start = performance.now();
        try {
          await (handlers.generatePrompts || (async () => {}))();
          updateModuleMetrics('prompts', { loadTime: Math.round(performance.now() - start) });
          updateModuleStatus('prompts', 'healthy');
        } catch (e) {
          updateModuleStatus('prompts', 'error');
          throw e;
        }
      },
      savePrompt: handlers.savePrompt || (() => {}),
      syncPrompts: async () => {
        updateModuleStatus('prompts', 'syncing');
        try {
          await (handlers.syncPrompts || (async () => {}))();
          updateModuleStatus('prompts', 'healthy');
        } catch (e) {
          updateModuleStatus('prompts', 'error');
          throw e;
        }
      },
    }
  };

  return (
    <PromptsCommandCenterContext.Provider value={value}>
      {children}
    </PromptsCommandCenterContext.Provider>
  );
};

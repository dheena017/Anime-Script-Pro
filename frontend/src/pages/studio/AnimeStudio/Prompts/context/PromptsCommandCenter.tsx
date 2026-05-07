import React from 'react';

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
  const value: PromptsDataContextType = {
    prompts: prompts || [],
    currentModel: 'Stable Diffusion XL / Midjourney v6',
    handlers: {
      generatePrompts: handlers.generatePrompts || (async () => {}),
      savePrompt: handlers.savePrompt || (() => {}),
      syncPrompts: handlers.syncPrompts || (async () => {}),
    }
  };

  return (
    <PromptsCommandCenterContext.Provider value={value}>
      {children}
    </PromptsCommandCenterContext.Provider>
  );
};

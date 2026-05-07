import { CastTab } from '../Tabs/CastTabs';
import { useDiagnostic } from '../../Diagnostic/context/DiagnosticCommandCenter';
import React from 'react';

/**
 * Cast Command Center
 * Manages character DNA, relationships, and vocal profiles for the production.
 */

export interface CastDataContextType {
  activeTab: CastTab;
  generatedCharacters: string | null;
  characters: any[];
  relationships: any[];
  handlers: {
    generateCharacter: () => Promise<void>;
    updateRelationship: (id1: string, id2: string, type: string) => void;
    syncCast: () => Promise<void>;
  };
}

export const CastCommandCenterContext = React.createContext<CastDataContextType | null>(null);

export const useCastCommandCenter = () => {
  const context = React.useContext(CastCommandCenterContext);
  if (!context) {
    throw new Error('useCastCommandCenter must be used within a CastCommandCenterProvider');
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
  activeTab: CastTab;
  generatedCharacters: string | null;
  characters: any[];
  relationships: any[];
  handlers: any;
}

export const CastCommandCenterProvider: React.FC<ProviderProps> = ({ 
  children, 
  activeTab, 
  generatedCharacters,
  characters,
  relationships,
  handlers 
}) => {
  const { updateModuleStatus, updateModuleMetrics } = useDiagnostic();

  React.useEffect(() => {
    if (characters && characters.length > 0) {
      updateModuleStatus('cast', 'healthy');
    }
  }, [characters, updateModuleStatus]);

  const value: CastDataContextType = {
    activeTab,
    generatedCharacters,
    characters: characters || [],
    relationships: relationships || [],
    handlers: {
      generateCharacter: async () => {
        updateModuleStatus('cast', 'syncing');
        const start = performance.now();
        try {
          await (handlers.generateCharacter || (async () => {}))();
          updateModuleMetrics('cast', { loadTime: Math.round(performance.now() - start) });
          updateModuleStatus('cast', 'healthy');
        } catch (e) {
          updateModuleStatus('cast', 'error');
          throw e;
        }
      },
      updateRelationship: handlers.updateRelationship || (() => {}),
      syncCast: async () => {
        updateModuleStatus('cast', 'syncing');
        try {
          await (handlers.syncCast || (async () => {}))();
          updateModuleStatus('cast', 'healthy');
        } catch (e) {
          updateModuleStatus('cast', 'error');
          throw e;
        }
      },
    }
  };

  return (
    <CastCommandCenterContext.Provider value={value}>
      {children}
    </CastCommandCenterContext.Provider>
  );
};


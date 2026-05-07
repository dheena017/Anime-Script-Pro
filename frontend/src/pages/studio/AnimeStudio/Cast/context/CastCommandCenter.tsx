import React from 'react';
import { CastTab } from '../Tabs/CastTabs';

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
  const value: CastDataContextType = {
    activeTab,
    generatedCharacters,
    characters: characters || [],
    relationships: relationships || [],
    handlers: {
      generateCharacter: handlers.generateCharacter || (async () => {}),
      updateRelationship: handlers.updateRelationship || (() => {}),
      syncCast: handlers.syncCast || (async () => {}),
    }
  };

  return (
    <CastCommandCenterContext.Provider value={value}>
      {children}
    </CastCommandCenterContext.Provider>
  );
};


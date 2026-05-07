import React from 'react';

/**
 * World Command Center
 * Synchronizes lore, factions, atlas, and systems across the world-building suite.
 */

export type WorldTab = 'manifest' | 'lore' | 'history' | 'factions' | 'powers' | 'architecture' | 'atlas' | 'culture' | 'systems';

export interface WorldDataContextType {
  activeTab: WorldTab;
  isSyncing: boolean;
  worldData: {
    manifest: any;
    factions: any[];
    locations: any[];
    powerSystems: any[];
  };
  handlers: {
    syncWorld: () => Promise<void>;
    generateLore: (module: string) => Promise<void>;
    exportLore: () => void;
  };
}

export const WorldCommandCenterContext = React.createContext<WorldDataContextType | null>(null);

export const useWorldCommandCenter = () => {
  const context = React.useContext(WorldCommandCenterContext);
  if (!context) {
    throw new Error('useWorldCommandCenter must be used within a WorldCommandCenterProvider');
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
  activeTab: WorldTab;
  worldData: any;
  handlers: any;
}

export const WorldCommandCenterProvider: React.FC<ProviderProps> = ({ 
  children, 
  activeTab, 
  worldData,
  handlers 
}) => {
  const [isSyncing] = React.useState(false);

  const value: WorldDataContextType = {
    activeTab,
    isSyncing,
    worldData: {
      manifest: worldData?.manifest || {},
      factions: worldData?.factions || [],
      locations: worldData?.locations || [],
      powerSystems: worldData?.powers || [],
    },
    handlers: {
      syncWorld: handlers.syncWorld || (async () => {}),
      generateLore: handlers.generateLore || (async () => {}),
      exportLore: handlers.exportLore || (() => {}),
    }
  };

  return (
    <WorldCommandCenterContext.Provider value={value}>
      {children}
    </WorldCommandCenterContext.Provider>
  );
};

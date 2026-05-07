import React from 'react';

/**
 * Assets Command Center
 * Manages the production library, props, and environment assets.
 */

export interface AssetsDataContextType {
  library: any[];
  diskUsage: string;
  handlers: {
    importAsset: (file: File) => Promise<void>;
    generateProp: (prompt: string) => Promise<void>;
    syncAssets: () => Promise<void>;
  };
}

export const AssetsCommandCenterContext = React.createContext<AssetsDataContextType | null>(null);

export const useAssetsCommandCenter = () => {
  const context = React.useContext(AssetsCommandCenterContext);
  if (!context) {
    throw new Error('useAssetsCommandCenter must be used within a AssetsCommandCenterProvider');
  }
  return context;
};

export const AssetsCommandCenterProvider: React.FC<{children: React.ReactNode, library: any[], handlers: any}> = ({ 
  children, 
  library,
  handlers 
}) => {
  const value: AssetsDataContextType = {
    library: library || [],
    diskUsage: '1.2 GB / 50 GB',
    handlers: {
      importAsset: handlers.importAsset || (async () => {}),
      generateProp: handlers.generateProp || (async () => {}),
      syncAssets: handlers.syncAssets || (async () => {}),
    }
  };

  return (
    <AssetsCommandCenterContext.Provider value={value}>
      {children}
    </AssetsCommandCenterContext.Provider>
  );
};

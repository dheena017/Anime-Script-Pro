import React from 'react';
import { useDiagnostic } from '../../Diagnostic/context/DiagnosticCommandCenter';

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
  const { updateModuleStatus, updateModuleMetrics } = useDiagnostic();

  React.useEffect(() => {
    if (library && library.length > 0) {
      updateModuleStatus('assets', 'healthy');
    }
  }, [library, updateModuleStatus]);

  const value: AssetsDataContextType = {
    library: library || [],
    diskUsage: '1.2 GB / 50 GB',
    handlers: {
      importAsset: async (file: File) => {
        updateModuleStatus('assets', 'syncing');
        try {
          await (handlers.importAsset || (async () => {}))(file);
          updateModuleStatus('assets', 'healthy');
        } catch (e) {
          updateModuleStatus('assets', 'error');
          throw e;
        }
      },
      generateProp: async (prompt: string) => {
        updateModuleStatus('assets', 'syncing');
        try {
          await (handlers.generateProp || (async () => {}))(prompt);
          updateModuleStatus('assets', 'healthy');
        } catch (e) {
          updateModuleStatus('assets', 'error');
          throw e;
        }
      },
      syncAssets: async () => {
        updateModuleStatus('assets', 'syncing');
        const start = performance.now();
        try {
          await (handlers.syncAssets || (async () => {}))();
          updateModuleMetrics('assets', { loadTime: Math.round(performance.now() - start) });
          updateModuleStatus('assets', 'healthy');
        } catch (e) {
          updateModuleStatus('assets', 'error');
          throw e;
        }
      },
    }
  };

  return (
    <AssetsCommandCenterContext.Provider value={value}>
      {children}
    </AssetsCommandCenterContext.Provider>
  );
};

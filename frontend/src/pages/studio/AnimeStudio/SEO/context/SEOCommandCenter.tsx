import React from 'react';
import { useDiagnostic } from '../../Diagnostic/context/DiagnosticCommandCenter';

/**
 * SEO Command Center
 * Manages marketing metadata, discovery metrics, and audience analytics.
 */

export interface SEODataContextType {
  metadata: any;
  keywords: string[];
  handlers: {
    generateSEO: () => Promise<void>;
    updateMetadata: (data: any) => void;
    syncSEO: () => Promise<void>;
  };
}

export const SEOCommandCenterContext = React.createContext<SEODataContextType | null>(null);

export const useSEOCommandCenter = () => {
  const context = React.useContext(SEOCommandCenterContext);
  if (!context) {
    throw new Error('useSEOCommandCenter must be used within a SEOCommandCenterProvider');
  }
  return context;
};

export const SEOCommandCenterProvider: React.FC<{children: React.ReactNode, metadata: any, handlers: any}> = ({ 
  children, 
  metadata,
  handlers 
}) => {
  const { updateModuleStatus, updateModuleMetrics } = useDiagnostic();

  React.useEffect(() => {
    if (metadata && Object.keys(metadata).length > 0) {
      updateModuleStatus('seo', 'healthy');
    }
  }, [metadata, updateModuleStatus]);

  const value: SEODataContextType = {
    metadata: metadata || {},
    keywords: metadata?.keywords || [],
    handlers: {
      generateSEO: async () => {
        updateModuleStatus('seo', 'syncing');
        const start = performance.now();
        try {
          await (handlers.generateSEO || (async () => {}))();
          updateModuleMetrics('seo', { loadTime: Math.round(performance.now() - start) });
          updateModuleStatus('seo', 'healthy');
        } catch (e) {
          updateModuleStatus('seo', 'error');
          throw e;
        }
      },
      updateMetadata: handlers.updateMetadata || (() => {}),
      syncSEO: async () => {
        updateModuleStatus('seo', 'syncing');
        try {
          await (handlers.syncSEO || (async () => {}))();
          updateModuleStatus('seo', 'healthy');
        } catch (e) {
          updateModuleStatus('seo', 'error');
          throw e;
        }
      },
    }
  };

  return (
    <SEOCommandCenterContext.Provider value={value}>
      {children}
    </SEOCommandCenterContext.Provider>
  );
};

import React from 'react';

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
  const value: SEODataContextType = {
    metadata: metadata || {},
    keywords: metadata?.keywords || [],
    handlers: {
      generateSEO: handlers.generateSEO || (async () => {}),
      updateMetadata: handlers.updateMetadata || (() => {}),
      syncSEO: handlers.syncSEO || (async () => {}),
    }
  };

  return (
    <SEOCommandCenterContext.Provider value={value}>
      {children}
    </SEOCommandCenterContext.Provider>
  );
};

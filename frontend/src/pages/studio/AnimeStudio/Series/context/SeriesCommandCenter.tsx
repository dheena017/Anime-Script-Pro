import React from 'react';
import { useDiagnostic } from '../../Diagnostic/context/DiagnosticCommandCenter';

/**
 * Series Command Center
 * Orchestrates season planning, episode flow, and distribution strategy.
 */

export interface SeriesDataContextType {
  seriesPlan: any[];
  currentEpisode: number;
  totalEpisodes: number;
  handlers: {
    generateSeriesPlan: () => Promise<void>;
    updateEpisode: (ep: number, data: any) => void;
    syncSeries: () => Promise<void>;
  };
}

export const SeriesCommandCenterContext = React.createContext<SeriesDataContextType | null>(null);

export const useSeriesCommandCenter = () => {
  const context = React.useContext(SeriesCommandCenterContext);
  if (!context) {
    throw new Error('useSeriesCommandCenter must be used within a SeriesCommandCenterProvider');
  }
  return context;
};

export const SeriesCommandCenterProvider: React.FC<{children: React.ReactNode, seriesPlan: any[], handlers: any}> = ({ 
  children, 
  seriesPlan,
  handlers 
}) => {
  const { updateModuleStatus, updateModuleMetrics } = useDiagnostic();

  React.useEffect(() => {
    if (seriesPlan && seriesPlan.length > 0) {
      updateModuleStatus('series', 'healthy');
    }
  }, [seriesPlan, updateModuleStatus]);

  const value: SeriesDataContextType = {
    seriesPlan: seriesPlan || [],
    currentEpisode: 1,
    totalEpisodes: seriesPlan?.length || 12,
    handlers: {
      generateSeriesPlan: async () => {
        updateModuleStatus('series', 'syncing');
        const start = performance.now();
        try {
          await (handlers.generateSeriesPlan || (async () => {}))();
          updateModuleMetrics('series', { loadTime: Math.round(performance.now() - start) });
          updateModuleStatus('series', 'healthy');
        } catch (e) {
          updateModuleStatus('series', 'error');
          throw e;
        }
      },
      updateEpisode: handlers.updateEpisode || (() => {}),
      syncSeries: async () => {
        updateModuleStatus('series', 'syncing');
        try {
          await (handlers.syncSeries || (async () => {}))();
          updateModuleStatus('series', 'healthy');
        } catch (e) {
          updateModuleStatus('series', 'error');
          throw e;
        }
      },
    }
  };

  return (
    <SeriesCommandCenterContext.Provider value={value}>
      {children}
    </SeriesCommandCenterContext.Provider>
  );
};

import React from 'react';

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
  const value: SeriesDataContextType = {
    seriesPlan: seriesPlan || [],
    currentEpisode: 1,
    totalEpisodes: seriesPlan?.length || 12,
    handlers: {
      generateSeriesPlan: handlers.generateSeriesPlan || (async () => {}),
      updateEpisode: handlers.updateEpisode || (() => {}),
      syncSeries: handlers.syncSeries || (async () => {}),
    }
  };

  return (
    <SeriesCommandCenterContext.Provider value={value}>
      {children}
    </SeriesCommandCenterContext.Provider>
  );
};

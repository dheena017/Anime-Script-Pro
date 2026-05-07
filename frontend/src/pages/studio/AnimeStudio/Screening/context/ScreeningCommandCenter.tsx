import React from 'react';

/**
 * Screening Command Center
 * Final review terminal for rendered episodes and cinematic sequences.
 */

export interface ScreeningDataContextType {
  playlist: any[];
  activeVideo: any | null;
  handlers: {
    playVideo: (video: any) => void;
    downloadVideo: (id: string) => void;
    syncScreening: () => Promise<void>;
  };
}

export const ScreeningCommandCenterContext = React.createContext<ScreeningDataContextType | null>(null);

export const useScreeningCommandCenter = () => {
  const context = React.useContext(ScreeningCommandCenterContext);
  if (!context) {
    throw new Error('useScreeningCommandCenter must be used within a ScreeningCommandCenterProvider');
  }
  return context;
};

export const ScreeningCommandCenterProvider: React.FC<{children: React.ReactNode, playlist: any[], handlers: any}> = ({ 
  children, 
  playlist,
  handlers 
}) => {
  const [activeVideo, setActiveVideo] = React.useState(null);

  const value: ScreeningDataContextType = {
    playlist: playlist || [],
    activeVideo,
    handlers: {
      playVideo: (video) => setActiveVideo(video),
      downloadVideo: handlers.downloadVideo || (() => {}),
      syncScreening: handlers.syncScreening || (async () => {}),
    }
  };

  return (
    <ScreeningCommandCenterContext.Provider value={value}>
      {children}
    </ScreeningCommandCenterContext.Provider>
  );
};

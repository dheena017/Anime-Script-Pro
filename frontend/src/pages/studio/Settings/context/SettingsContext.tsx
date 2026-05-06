import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDirty, setIsDirty] = useState(false);

  const saveSettings = async () => {
    // API call mock
    await new Promise(res => setTimeout(res, 500));
    setIsDirty(false);
  };

  const resetSettings = () => {
    setIsDirty(false);
  };

  return (
    <SettingsContext.Provider value={{ isDirty, setIsDirty, saveSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

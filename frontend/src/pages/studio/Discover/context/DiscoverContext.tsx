import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DiscoverContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTag: string;
  setActiveTag: (tag: string) => void;
}

const DiscoverContext = createContext<DiscoverContextType | undefined>(undefined);

export const DiscoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('Trending');

  return (
    <DiscoverContext.Provider value={{ searchQuery, setSearchQuery, activeTag, setActiveTag }}>
      {children}
    </DiscoverContext.Provider>
  );
};

export const useDiscover = () => {
  const context = useContext(DiscoverContext);
  if (context === undefined) {
    throw new Error('useDiscover must be used within a DiscoverProvider');
  }
  return context;
};

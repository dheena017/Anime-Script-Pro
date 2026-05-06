import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CommunityContextType {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  createNewTopic: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCategory, setActiveCategory] = useState('All Discussions');

  const createNewTopic = () => {
    console.log('Open create topic modal');
  };

  return (
    <CommunityContext.Provider value={{ activeCategory, setActiveCategory, createNewTopic }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

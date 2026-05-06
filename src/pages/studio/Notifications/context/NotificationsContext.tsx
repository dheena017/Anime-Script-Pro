import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationsContextType {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  markAllRead: () => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [unreadCount, setUnreadCount] = useState(2);

  const markAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationsContext.Provider value={{ activeFilter, setActiveFilter, markAllRead, unreadCount, setUnreadCount }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

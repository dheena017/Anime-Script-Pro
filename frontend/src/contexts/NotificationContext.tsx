import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService, Notification } from '@/services/api/notifications';
import { useAuth } from '@/hooks/useAuth';
import { studioLog } from '@/lib/studio-logger';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const markAsRead = async (id: number) => {
    const success = await notificationService.markAsRead(id);
    if (success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      studioLog('NOTIFY', `Signal [${id}] marked as read.`, 'success');
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    if (unread.length === 0) return;
    
    await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    studioLog('NOTIFY', `All ${unread.length} signals synchronized.`, 'success');
  };

  const deleteNotification = async (id: number) => {
    const success = await notificationService.deleteNotification(id);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      studioLog('NOTIFY', `Signal [${id}] purged from vault.`, 'warn');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading, 
      fetchNotifications, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

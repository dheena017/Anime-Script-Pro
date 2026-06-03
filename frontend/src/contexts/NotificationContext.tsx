import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService, Notification } from '@/services/api/notifications';
import { useAuth } from '@/hooks/useAuth';
import { studioLog } from '@/lib/dev-console-logs';
import { getBackendWsUrl, isBackendOnline } from '@/lib/api-utils';

let notificationProviderStarted = false;

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
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const markAsRead = async (id: number) => {
    const success = await notificationService.markAsRead(id);
    if (success) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      studioLog('NOTIFY', `Signal [${id}] marked as read.`, 'success');
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;

    await Promise.all(unread.map((n) => notificationService.markAsRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    studioLog('NOTIFY', `All ${unread.length} signals synchronized.`, 'success');
  };

  const deleteNotification = async (id: number) => {
    const success = await notificationService.deleteNotification(id);
    if (success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      studioLog('NOTIFY', `Signal [${id}] purged from vault.`, 'warn');
    }
  };

  useEffect(() => {
    // Prevent duplicate side-effects (WS connections + initial fetch) when React remounts providers.
    if (notificationProviderStarted) return;
    notificationProviderStarted = true;

    let cancelled = false;

    // Prevent request storms if WS + React both trigger fetch.
    let inflight = false;
    let queued = false;

    const safeFetch = async (source: string) => {
      if (cancelled) return;
      if (inflight) {
        queued = true;
        return;
      }
      inflight = true;
      try {
        // Debug: see exactly why/when notifications are fetched
        studioLog('NOTIFY_DBG', `fetchNotifications() triggered. source=${source}`, 'info');
        await fetchNotifications();
      } finally {
        inflight = false;
        if (!cancelled && queued) {
          queued = false;
          setTimeout(() => {
            void safeFetch(source);
          }, 0);
        }
      }

    };

    const start = async () => {
      const online = await isBackendOnline();
      if (cancelled) return;

      if (!online) return;

      await safeFetch('init');
      if (cancelled) return;

      const wsUrl = getBackendWsUrl('/ws/templates/notifications');

      const connect = () => {
        if (cancelled) return;

        let ws: WebSocket | null = null;
        try {
          ws = new WebSocket(wsUrl);

          ws.onerror = () => {
            if (cancelled) return;
            setTimeout(() => connect(), 5000);
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data?.type === 'NEW_NOTIFICATION') {
                void safeFetch('ws.NEW_NOTIFICATION');
              }
            } catch {
              // ignore non-JSON / keep-alive messages
            }
          };

          ws.onclose = () => {
            if (cancelled) return;
            setTimeout(() => connect(), 5000);
          };
        } catch {
          if (!cancelled) setTimeout(() => connect(), 15000);
        }
      };

      connect();
    };

    void start();

    return () => {
      cancelled = true;
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
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


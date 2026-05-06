import React, { useEffect, useRef, useState } from 'react';
import { NotificationItem } from './NotificationItem';
import { NotificationsEmptyState } from './NotificationsEmptyState';
import { notificationService, Notification } from '@/services/api/notifications';
import { useAuth } from '@/hooks/useAuth';

const POLL_INTERVAL = 15_000; // 15 seconds

export const NotificationFeed: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifs = async () => {
    if (!user?.id) return;
    try {
      const data = await notificationService.getNotifications(user.id);
      setItems(data);
    } catch (err) {
      console.error('[NotificationFeed] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    fetchNotifs();
    intervalRef.current = setInterval(fetchNotifs, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user?.id]);

  const handleRead = async (id: number) => {
    await notificationService.markAsRead(id);
    setItems(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  if (loading) return <div className="p-8 text-center text-white/40">Loading feed...</div>;
  if (items.length === 0) return <NotificationsEmptyState />;

  return (
    <div className="flex flex-col">
      {items.map(item => (
        <NotificationItem
          time={''} key={item.id}
          {...item}
          read={item.is_read}
          onRead={() => handleRead(item.id)}        />
      ))}
    </div>
  );
};

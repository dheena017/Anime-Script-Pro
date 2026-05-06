import React from 'react';
import { NotificationItem } from './NotificationItem';
import { NotificationsEmptyState } from './NotificationsEmptyState';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'activity' | 'alert' | 'info' | 'warning' | 'success';
  read: boolean;
  timestamp: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onMarkRead }) => {
  if (notifications.length === 0) return <NotificationsEmptyState />;

  return (
    <div className="flex flex-col">
      {notifications.map(n => (
        <NotificationItem 
          key={n.id} 
          id={n.id}
          title={n.title}
          message={n.message}
          type={n.type === 'system' ? 'info' : n.type === 'activity' ? 'success' : n.type as any}
          time={n.timestamp}
          read={n.read}
          onRead={onMarkRead}
        />
      ))}
    </div>
  );
};

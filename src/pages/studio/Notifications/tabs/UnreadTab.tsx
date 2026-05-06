import React from 'react';
import { NotificationsPanel } from '../components/NotificationsPanel';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'activity' | 'alert';
  read: boolean;
  timestamp: string;
}

interface UnreadTabProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const UnreadTab: React.FC<UnreadTabProps> = (props) => {
  const unreadNotifications = props.notifications.filter(n => !n.read);
  return <NotificationsPanel {...props} notifications={unreadNotifications} />;
};

export default UnreadTab;

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

interface SystemTabProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SystemTab: React.FC<SystemTabProps> = (props) => {
  const systemNotifications = props.notifications.filter(n => n.type === 'system' || n.type === 'alert');
  return <NotificationsPanel {...props} notifications={systemNotifications} />;
};

export default SystemTab;

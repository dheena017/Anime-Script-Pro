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

interface ActivityTabProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ActivityTab: React.FC<ActivityTabProps> = (props) => {
  const activityNotifications = props.notifications.filter(n => n.type === 'activity');
  return <NotificationsPanel {...props} notifications={activityNotifications} />;
};

export default ActivityTab;

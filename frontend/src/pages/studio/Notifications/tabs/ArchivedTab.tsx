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

interface ArchivedTabProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ArchivedTab: React.FC<ArchivedTabProps> = (props) => {
  // Placeholder for archived notifications logic
  return <NotificationsPanel {...props} notifications={[]} />;
};

export default ArchivedTab;

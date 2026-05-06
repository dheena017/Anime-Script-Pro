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

interface AllTabProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AllTab: React.FC<AllTabProps> = (props) => {
  return <NotificationsPanel {...props} />;
};

export default AllTab;

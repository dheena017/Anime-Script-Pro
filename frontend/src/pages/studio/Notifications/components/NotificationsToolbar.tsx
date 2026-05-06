import React from 'react';
import { CheckCheck, Filter } from 'lucide-react';

interface NotificationsToolbarProps {
  onMarkAllRead: () => void;
}

export const NotificationsToolbar: React.FC<NotificationsToolbarProps> = ({ onMarkAllRead }) => {
  return (
    <div className="p-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
      <button className="text-sm text-white/60 hover:text-white flex items-center gap-2">
        <Filter className="w-4 h-4" /> Filter
      </button>
      <button onClick={onMarkAllRead} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors">
        <CheckCheck className="w-4 h-4" /> Mark all as read
      </button>
    </div>
  );
};

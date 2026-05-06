import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationsHeader: React.FC = () => {
  return (
    <header className="p-6 border-b border-white/5 bg-black/40 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-indigo-400" />
        <h1 className="text-2xl font-bold text-white">Inbox</h1>
      </div>
    </header>
  );
};

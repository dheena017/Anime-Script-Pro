import React from 'react';
import { BellOff } from 'lucide-react';

export const NotificationsEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <BellOff className="w-8 h-8 text-white/20" />
      </div>
      <h3 className="text-lg font-bold text-white/80 mb-1">You're all caught up!</h3>
      <p className="text-sm text-white/50">No new notifications right now.</p>
    </div>
  );
};

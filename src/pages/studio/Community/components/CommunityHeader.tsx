import React from 'react';
import { Users } from 'lucide-react';

export const CommunityHeader: React.FC = () => {
  return (
    <header className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <Users className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Community Forums</h1>
          <p className="text-sm text-white/50">Discuss lore, share scripts, and collaborate.</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors">
        New Topic
      </button>
    </header>
  );
};

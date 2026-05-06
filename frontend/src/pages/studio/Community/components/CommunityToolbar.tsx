import React from 'react';
import { MessageSquare, Hash } from 'lucide-react';

export const CommunityToolbar: React.FC = () => {
  return (
    <div className="p-3 border-b border-white/5 bg-black/20 flex gap-4 overflow-x-auto">
      <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm text-white/90 whitespace-nowrap">
        <MessageSquare className="w-4 h-4" /> All Discussions
      </button>
      {['Scripting Help', 'Character Design', 'World Building', 'Feedback'].map(cat => (
        <button key={cat} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded-full text-sm text-white/50 transition-colors whitespace-nowrap">
          <Hash className="w-3.5 h-3.5" /> {cat}
        </button>
      ))}
    </div>
  );
};

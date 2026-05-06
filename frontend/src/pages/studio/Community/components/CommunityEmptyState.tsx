import React from 'react';
import { MessageSquareDashed } from 'lucide-react';

export const CommunityEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <MessageSquareDashed className="w-16 h-16 text-white/10 mb-4" />
      <h3 className="text-xl font-bold text-white/80 mb-2">No Discussions Yet</h3>
      <p className="text-sm text-white/50 max-w-sm">Be the first to start a conversation in this category!</p>
      <button className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors">
        Start a Topic
      </button>
    </div>
  );
};

import React from 'react';
import { Search } from 'lucide-react';

export const DiscoverToolbar: React.FC = () => {
  return (
    <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-4">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input 
          type="text" 
          placeholder="Search trending scripts, genres, or creators..." 
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        {['Trending', 'New', 'Top Rated'].map(tag => (
          <button key={tag} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70 transition-colors border border-white/10">
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

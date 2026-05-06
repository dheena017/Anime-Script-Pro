import React from 'react';
import { Compass } from 'lucide-react';

export const DiscoverHeader: React.FC = () => {
  return (
    <header className="p-8 pb-4 border-b border-white/5 bg-gradient-to-b from-black/80 to-black/20">
      <div className="flex items-center gap-3 mb-2">
        <Compass className="w-8 h-8 text-fuchsia-500" />
        <h1 className="text-3xl font-black tracking-tight text-white">Discover</h1>
      </div>
      <p className="text-white/60 max-w-2xl">Explore community-created anime scripts, character arcs, and world lore. Get inspired by top creators worldwide.</p>
    </header>
  );
};

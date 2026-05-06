import React from 'react';
import { Telescope } from 'lucide-react';

export const DiscoverEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Telescope className="w-16 h-16 text-white/20 mb-6" />
      <h3 className="text-xl font-bold text-white/80 mb-2">No Discoveries Made</h3>
      <p className="text-sm text-white/50 max-w-sm">We couldn't load the trending feed right now. Check your connection or try again later.</p>
    </div>
  );
};

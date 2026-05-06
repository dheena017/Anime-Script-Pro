import React from 'react';
import { SearchX } from 'lucide-react';

export const SettingsEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-white/50">
      <SearchX className="w-12 h-12 mb-4 text-white/20" />
      <p>No settings matched your search query.</p>
    </div>
  );
};

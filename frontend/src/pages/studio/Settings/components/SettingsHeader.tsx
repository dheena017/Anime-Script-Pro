import React from 'react';
import { Settings } from 'lucide-react';

export const SettingsHeader: React.FC = () => {
  return (
    <header className="p-6 border-b border-white/5 bg-black/40">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-zinc-800 rounded-xl border border-white/10">
          <Settings className="w-6 h-6 text-white/80" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Preferences</h1>
          <p className="text-sm text-white/50">Manage your studio configuration and account settings.</p>
        </div>
      </div>
    </header>
  );
};

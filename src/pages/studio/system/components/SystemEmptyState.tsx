import React from 'react';
import { ActivitySquare } from 'lucide-react';

export const SystemEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full">
      <ActivitySquare className="w-16 h-16 text-white/10 mb-4" />
      <h3 className="text-xl font-black tracking-widest text-white/60 mb-2">NO DATA LOGS</h3>
      <p className="text-sm text-white/40 max-w-sm font-mono">The system telemetry streams are currently dry. Run a process to see output.</p>
    </div>
  );
};

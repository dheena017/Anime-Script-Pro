import React from 'react';
import { Activity } from 'lucide-react';

interface SystemHeaderProps {
  title?: string;
  status?: 'online' | 'degraded' | 'offline';
}

export const SystemHeader: React.FC<SystemHeaderProps> = ({ title = "SYSTEM CORE", status = 'online' }) => {
  const statusColors = {
    online: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    degraded: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    offline: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  return (
    <header className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <Activity className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">{title}</h1>
          <p className="text-xs text-white/50 font-mono mt-1">CORE INFRASTRUCTURE CONTROL</p>
        </div>
      </div>
      <div className={`px-4 py-1.5 rounded-full border ${statusColors[status]} flex items-center gap-2`}>
        <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
        <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
      </div>
    </header>
  );
};

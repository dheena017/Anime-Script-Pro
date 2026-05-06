import React from 'react';
import { RefreshCcw, Terminal, AlertTriangle } from 'lucide-react';

export const SystemToolbar: React.FC = () => {
  return (
    <div className="p-3 border-b border-white/5 bg-black/20 flex gap-2">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-white/70 transition-colors">
        <RefreshCcw className="w-3.5 h-3.5" /> RESTART KERNEL
      </button>
      <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-white/70 transition-colors">
        <Terminal className="w-3.5 h-3.5" /> CLEAR LOGS
      </button>
      <div className="flex-1" />
      <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-xs font-mono text-red-400 border border-red-500/20 transition-colors">
        <AlertTriangle className="w-3.5 h-3.5" /> EMERGENCY STOP
      </button>
    </div>
  );
};

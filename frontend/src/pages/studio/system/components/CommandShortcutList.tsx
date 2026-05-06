import React from 'react';
import { Command } from 'lucide-react';

export const CommandShortcutList: React.FC = () => {
  const shortcuts = [
    { key: 'Ctrl + K', desc: 'Open Command Palette' },
    { key: 'Ctrl + S', desc: 'Save active state' },
    { key: 'Alt + T', desc: 'Toggle Terminal' },
  ];

  return (
    <div className="p-4 rounded-xl border border-white/5 bg-black/20">
      <h3 className="flex items-center gap-2 text-sm font-bold text-white/80 mb-4">
        <Command className="w-4 h-4" /> Quick Commands
      </h3>
      <div className="space-y-2">
        {shortcuts.map((s, i) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <span className="text-white/50">{s.desc}</span>
            <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-white/80 border border-white/20">{s.key}</kbd>
          </div>
        ))}
      </div>
    </div>
  );
};

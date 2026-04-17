import React from 'react';
import { Download } from 'lucide-react';

interface SfxArchiveItemProps {
  label: string;
}

export function SfxArchiveItem({ label }: SfxArchiveItemProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex items-center justify-between group">
      <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors truncate max-w-[120px]">{label}</span>
      <Download className="w-3 h-3 text-zinc-800 group-hover:text-red-500 transition-colors cursor-pointer" />
    </div>
  );
}

import React from 'react';
import { Shield, Zap, History, Scroll } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LoreEntry } from '../bibleUtils';

interface LoreEntryCardProps {
  entry: LoreEntry;
}

export function LoreEntryCard({ entry }: LoreEntryCardProps) {
  const getIcon = () => {
    switch (entry.category) {
      case 'factions': return <Shield className="w-4 h-4 text-emerald-500" />;
      case 'magic': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'rules': return <Scroll className="w-4 h-4 text-red-500" />;
      default: return <History className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBg = () => {
    switch (entry.category) {
      case 'factions': return 'bg-emerald-500/5 border-emerald-500/10';
      case 'magic': return 'bg-amber-500/5 border-amber-500/10';
      case 'rules': return 'bg-red-500/5 border-red-500/10';
      default: return 'bg-blue-500/5 border-blue-500/10';
    }
  };

  return (
    <Card className={`p-6 rounded-[24px] border ${getBg()} space-y-3 hover:scale-[1.02] transition-transform cursor-pointer`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
          {getIcon()}
        </div>
        <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-200">{entry.title}</h4>
      </div>
      <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed line-clamp-4">
        {entry.content}
      </p>
      <div className="pt-2 flex items-center justify-between">
         <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">{entry.category}</span>
         <div className="w-1 h-1 rounded-full bg-zinc-800" />
      </div>
    </Card>
  );
}

import React from 'react';
import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RecentScript {
  id: string;
  title: string;
  date: string;
  script: string;
}

interface RecentScriptsPanelProps {
  history: RecentScript[];
  onSelect: (script: RecentScript) => void;
}

export function RecentScriptsPanel({ history, onSelect }: RecentScriptsPanelProps) {
  return (
    <Card className="studio-panel border-white/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white/[0.02] border-b border-white/5">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-red-500" /> Recent Archive
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] px-6 py-4">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <button 
                  key={item.id || idx}
                  className="w-full text-left group transition-all"
                  onClick={() => onSelect(item)}
                >
                  <p className="text-[11px] font-bold text-zinc-300 group-hover:text-red-500 transition-colors line-clamp-1 uppercase tracking-tight">
                    {item.title}
                  </p>
                  <p className="text-[9px] text-zinc-600 font-medium uppercase tracking-widest mt-1">
                    {item.date}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="w-8 h-8 mx-auto mb-3 text-zinc-800 opacity-20" />
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No history found</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

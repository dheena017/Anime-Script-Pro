import React from 'react';
import { History, ChevronRight, FileText, Clock, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { motion } from 'motion/react';

interface StudioRecentHistoryProps {
  history: any[];
  onSelect: (item: any) => void;
}

export function StudioRecentHistory({ history, onSelect }: StudioRecentHistoryProps) {
  return (
    <Card className="bg-zinc-950/40 border-zinc-800/80 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-2xl group">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-red-500 transition-colors">
                    <History className="w-5 h-5" />
                </div>
                <div>
                   <CardTitle className="text-sm font-black tracking-tight uppercase">Recent Terminal Logs</CardTitle>
                   <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-0.5">Your production history</p>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[250px] px-8 py-4">
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <motion.button 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx}
                  className="w-full text-left group/item p-4 rounded-2xl bg-zinc-900/50 border border-transparent hover:border-zinc-800 hover:bg-zinc-900 transition-all flex items-center justify-between gap-4"
                  onClick={() => onSelect(item)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800 flex-shrink-0 group-hover/item:border-red-500/30 transition-colors">
                       <FileText className="w-4 h-4 text-zinc-600 group-hover/item:text-red-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white hover:text-red-500 transition-colors line-clamp-1 uppercase tracking-tight">{item.title || 'Untitled Session'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {item.date}
                         </span>
                         <span className="w-1 h-1 rounded-full bg-zinc-800" />
                         <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">v2.4</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-800 group-hover/item:text-white transition-all transform group-hover/item:translate-x-1" />
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                 <History className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-sm font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">No active logs</h3>
              <p className="text-[10px] text-zinc-700 font-medium italic max-w-[180px] mx-auto">
                Select a template or type a prompt to begin your first production log.
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

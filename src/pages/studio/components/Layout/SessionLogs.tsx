import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';

interface SessionLogsProps {
  history: any[];
  setPrompt: (p: string) => void;
  setTone: (t: string) => void;
  setAudience: (a: string) => void;
  setEpisode: (e: string) => void;
  setSession: (s: string) => void;
  setContentType: (c: string) => void;
  setSelectedModel: (m: string) => void;
  setGeneratedMetadata: (m: any) => void;
}

export const SessionLogs: React.FC<SessionLogsProps> = ({
  history,
  setPrompt,
  setTone,
  setAudience,
  setEpisode,
  setSession,
  setContentType,
  setSelectedModel,
  setGeneratedMetadata
}) => {
  return (
    <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />
      <CardHeader className="p-5 border-b border-zinc-800/50 relative z-10 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-2 text-cyan-100">
          <History className="w-4 h-4 text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" /> Active Session Logs
        </CardTitle>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.15)]">
          {history.length} Entries
        </span>
      </CardHeader>
      <CardContent className="p-0 relative z-10">
        <ScrollArea className="h-48 w-full">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 py-10">
              <History className="w-10 h-10 mb-4 opacity-20" />
              <p className="text-xs uppercase tracking-widest font-semibold">No active terminal logs.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {history.map((record, index) => (
                <div 
                  key={index} 
                  className="p-4 hover:bg-cyan-900/10 transition-colors cursor-pointer group flex items-start gap-4"
                  onClick={() => {
                    setPrompt(record.prompt);
                    setTone(record.tone || 'Hype/Energetic');
                    setAudience(record.audience || 'General Fans');
                    setEpisode(record.episode || '1');
                    setSession(record.session || '1');
                    setContentType(record.contentType || 'youtube');
                    setSelectedModel(record.model || 'gemini-3-flash-preview');
                    if (record.metadata) setGeneratedMetadata(record.metadata);
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all">
                    <span className="text-[10px] font-mono text-cyan-500/70 group-hover:text-cyan-300">{(history.length - index).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-xs text-zinc-300 font-medium line-clamp-1 group-hover:text-cyan-200 transition-colors">
                      {record.prompt}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-widest">
                      {record.timestamp && (
                        <span className="text-zinc-500 font-mono bg-black/50 px-1.5 py-0.5 rounded border border-zinc-800">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                      <span className="text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">{record.model || 'Flash'}</span>
                      <span className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">{record.tone || 'Action'}</span>
                      <span className="text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">{record.audience || 'General'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

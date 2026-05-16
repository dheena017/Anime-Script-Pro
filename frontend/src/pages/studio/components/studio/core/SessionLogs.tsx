import React from 'react';
import { History, Cpu, Activity } from 'lucide-react';
import { useLogs, LogEntry } from '@/contexts/LogContext';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';


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
  theme?: 'cyan' | 'violet' | 'amber';
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
  setGeneratedMetadata,
  theme = 'cyan'
}) => {
  const { masterLogs: realtimeLogs } = useLogs();

  const themeMap = {
    cyan: { primary: 'text-cyan-400', accent: 'text-cyan-500', border: 'border-cyan-500/20', bg: 'bg-cyan-950/20', shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.1)]' },
    violet: { primary: 'text-violet-400', accent: 'text-violet-500', border: 'border-violet-500/20', bg: 'bg-violet-950/20', shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.1)]' },
    amber: { primary: 'text-amber-400', accent: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-amber-950/20', shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.1)]' },
  };

  const colors = themeMap[theme] || themeMap.cyan;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      {/* 1. NEURAL STREAM (REALTIME) - 8 columns */}
      <Card className={cn("md:col-span-8 bg-[#050505] border rounded-[2rem] overflow-hidden relative group", colors.border, colors.shadow)}>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
        <CardHeader className={cn("p-6 border-b relative z-10 flex flex-row items-center justify-between bg-white/[0.01]", colors.border)}>
          <CardTitle className={cn("text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3", colors.primary)}>
            <div className="p-1.5 rounded-lg bg-studio/10 border border-studio/20">
               <Cpu className={cn("w-3.5 h-3.5 animate-pulse", colors.accent)} />
            </div>
            AI Thinking Stream
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 h-1.5 rounded-full animate-ping", colors.accent.replace('text', 'bg'))} />
            <span className={cn("text-xs font-black uppercase tracking-widest opacity-60", colors.primary)}>Live Link</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <ScrollArea className="h-60 w-full font-mono">
            {realtimeLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-700 py-16 opacity-40">
                <Activity className="w-10 h-10 mb-4 animate-pulse" />
                <p className="text-xs uppercase tracking-[0.3em] font-black">Awaiting System Activity...</p>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {realtimeLogs.map((log: LogEntry) => (
                  <div key={log.id} className="flex items-start gap-4 text-xs group/log animate-in fade-in slide-in-from-left-2">
                    <span className="text-zinc-700 shrink-0 mt-0.5 tabular-nums">[{new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    <span className={cn("font-black uppercase tracking-tighter shrink-0 mt-0.5 min-w-[70px]", colors.accent)}>{log.module}</span>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                       <div className="flex items-center gap-3">
                          <span className={cn(
                            "font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded text-xs border transition-all duration-300",
                            log.status === 'COMPLETED' || log.status === 'SUCCESS' || log.status === 'READY' || log.status === 'SYNCED' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            log.status === 'STARTING' || log.status === 'INITIALIZED' || log.status === 'GENERATING' || log.status === 'SYNTHESIZING' || log.status === 'PROCESSED' || log.status === 'SYNCING'
                              ? 'bg-studio/10 text-studio border-studio/20 animate-pulse' :
                            log.status === 'RETRYING' || log.status === 'WARNING'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          )}>
                            {log.status}
                          </span>
                          <span className="text-zinc-400 font-bold tracking-wide truncate group-hover/log:text-white transition-colors">{log.message}</span>
                       </div>
                       {log.model_used && (
                          <div className="flex items-center gap-2">
                             <div className="w-1 h-px bg-zinc-800" />
                             <span className="text-zinc-600 italic truncate opacity-60 text-xs font-bold uppercase tracking-tighter">Engine: {log.model_used}</span>
                          </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>


      {/* 2. PRODUCTION HISTORY - 4 columns */}
      <Card className="md:col-span-4 bg-[#050505] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative group/archive">
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />
        <CardHeader className="p-6 border-b border-white/5 relative z-10 flex flex-row items-center justify-between bg-white/[0.01]">
          <CardTitle className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 text-zinc-500">
             <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                <History className="w-3.5 h-3.5 text-zinc-600 group-hover/archive:text-zinc-400 transition-colors" />
             </div>
             Production Archive
          </CardTitle>
          <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-500 text-xs font-black tracking-widest uppercase">
            {history.length}
          </span>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <ScrollArea className="h-60 w-full">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-800 py-16 opacity-30">
                <History className="w-10 h-10 mb-4" />
                <p className="text-xs uppercase tracking-[0.3em] font-black">Archive Empty</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.03]">
                {history.map((record, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "p-5 transition-all cursor-pointer group/item flex items-start gap-4", 
                      theme === 'violet' ? 'hover:bg-violet-500/5' : theme === 'amber' ? 'hover:bg-amber-500/5' : 'hover:bg-studio/5'
                    )}
                    onClick={() => {
                      setPrompt(record.prompt);
                      setTone(record.vibe || 'Hype/Energetic');
                      setAudience(record.audience || 'General Fans');
                      setEpisode(record.episode || '1');
                      setSession(record.session || '1');
                      setContentType(record.contentType || 'Anime');
                      setSelectedModel(record.modelUsed || 'gemini-1.5-flash');
                      if (record.metadata) setGeneratedMetadata(record.metadata);
                    }}
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <p className={cn(
                        "text-xs text-zinc-400 font-black line-clamp-1 transition-colors uppercase tracking-[0.15em]", 
                        theme === 'violet' ? 'group-hover/item:text-violet-400' : theme === 'amber' ? 'group-hover/item:text-amber-400' : 'group-hover/item:text-studio'
                      )}>
                        {record.prompt}
                      </p>
                      <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-40 group-hover/item:opacity-80 transition-opacity">
                        <span className={colors.primary}>{record.modelUsed?.split('-').pop() || 'FLASH'}</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="text-zinc-500">{record.vibe?.split('/')[0] || 'ACTION'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

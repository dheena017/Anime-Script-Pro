import { useRealtimeLogs } from '@/hooks/useRealtimeLogs';
import { History, Cpu, Zap, Activity } from 'lucide-react';
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
  const realtimeLogs = useRealtimeLogs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* 1. NEURAL STREAM (REALTIME) */}
      <Card className="bg-gradient-to-br from-[#0c0e12] to-[#050505] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)] relative group">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />
        <CardHeader className="p-4 border-b border-cyan-500/10 relative z-10 flex flex-row items-center justify-between bg-cyan-950/20">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-cyan-400">
            <Cpu className="w-3 h-3 text-cyan-500 animate-pulse" /> Neural Thinking Stream
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[9px] font-bold text-cyan-500/60 uppercase tracking-widest">Live</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <ScrollArea className="h-48 w-full font-mono">
            {realtimeLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 py-10 opacity-50">
                <Activity className="w-8 h-8 mb-2 animate-pulse" />
                <p className="text-[9px] uppercase tracking-widest">Waiting for neural activity...</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {realtimeLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 text-[10px] animate-in fade-in slide-in-from-left-1">
                    <span className="text-zinc-600 shrink-0">[{new Date(log.created_at).toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="text-cyan-500 font-bold uppercase tracking-tighter shrink-0">{log.module}:</span>
                    <span className={cn(
                      "font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-sm text-[9px]",
                      log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      log.status === 'Generating' || log.status === 'Synthesizing' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    )}>
                      {log.status}
                    </span>
                    {log.model_used && <span className="text-zinc-500 italic truncate opacity-50 text-[8px]">{log.model_used}</span>}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 2. PRODUCTION HISTORY */}
      <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />
        <CardHeader className="p-4 border-b border-zinc-800/50 relative z-10 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-zinc-400">
            <History className="w-3 h-3 text-zinc-500" /> Production Archive
          </CardTitle>
          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 text-[9px] font-bold tracking-widest uppercase">
            {history.length} Saved
          </span>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <ScrollArea className="h-48 w-full">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 py-10 opacity-50">
                <History className="w-8 h-8 mb-2" />
                <p className="text-[9px] uppercase tracking-widest">No archived scripts.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {history.map((record, index) => (
                  <div 
                    key={index} 
                    className="p-3 hover:bg-cyan-900/10 transition-colors cursor-pointer group flex items-start gap-3"
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
                    <div className="space-y-1.5 flex-1">
                      <p className="text-[11px] text-zinc-300 font-bold line-clamp-1 group-hover:text-cyan-200 transition-colors uppercase tracking-wider">
                        {record.prompt}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[8px] font-bold uppercase tracking-widest opacity-60">
                        <span className="text-cyan-500">{record.model || 'Flash'}</span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-purple-400">{record.tone || 'Action'}</span>
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

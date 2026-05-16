import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Trash2, Search, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AI_EVENTS, AIMetadata } from '@/services/generators/core';

interface LogEntry {
  id: string;
  type: 'info' | 'warn' | 'error' | 'success';
  message: string;
  timestamp: string;
  details?: any;
}

export const EngineConsole: FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAIComplete = (e: any) => {
      const metadata = e.detail as AIMetadata;
      addLog({
        type: 'success',
        message: `Generation Complete: ${metadata.model} (${metadata.latency.toFixed(0)}ms)`,
        details: metadata.text
      });
    };

    const handleAIFallback = (e: any) => {
      addLog({
        type: 'warn',
        message: `Model Switch: ${e.detail.failedModel} -> ${e.detail.nextModel}`,
        details: e.detail.error
      });
    };

    const handleAIStart = (e: any) => {
      addLog({
        type: 'info',
        message: `Content Engine Initialized: ${e.detail.model}`,
      });
    };

    AI_EVENTS.addEventListener('ai_generation_complete', handleAIComplete);
    AI_EVENTS.addEventListener('ai_fallback', handleAIFallback);
    AI_EVENTS.addEventListener('ai_generation_start', handleAIStart);

    return () => {
      AI_EVENTS.removeEventListener('ai_generation_complete', handleAIComplete);
      AI_EVENTS.removeEventListener('ai_fallback', handleAIFallback);
      AI_EVENTS.removeEventListener('ai_generation_start', handleAIStart);
    };
  }, []);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(prev => [...prev, newLog].slice(-100));
  };

  const clearLogs = () => setLogs([]);

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) || 
    (log.details && JSON.stringify(log.details).toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-[600px] bg-[#050505] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">System Console</h3>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Real-time Generation Activity</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
            <input 
              type="text" 
              placeholder="SEARCH LOGS..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 focus:border-emerald-500/50 transition-all outline-none w-48"
            />
          </div>
          <button 
            onClick={clearLogs}
            className="p-2.5 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20"
            title="Clear Console"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 font-mono text-xs space-y-3 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-700 opacity-50">
              <Terminal className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-black uppercase tracking-[0.3em] text-xs">Awaiting Activity...</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex gap-4 p-3 rounded-xl border transition-colors",
                  log.type === 'info' && "bg-blue-500/5 border-blue-500/10 text-blue-400/80",
                  log.type === 'warn' && "bg-amber-500/5 border-amber-500/10 text-amber-400/80",
                  log.type === 'error' && "bg-red-500/5 border-red-500/10 text-red-400/80",
                  log.type === 'success' && "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/80"
                )}
              >
                <span className="opacity-40 shrink-0 select-none">[{log.timestamp}]</span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    {log.type === 'info' && <Info className="w-3 h-3" />}
                    {log.type === 'warn' && <AlertCircle className="w-3 h-3" />}
                    {log.type === 'success' && <CheckCircle2 className="w-3 h-3" />}
                    {log.message}
                  </div>
                  {log.details && (
                    <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-xs text-zinc-500 whitespace-pre-wrap break-all overflow-hidden max-h-40 overflow-y-auto custom-scrollbar">
                      {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Link Active</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
            {filteredLogs.length} LOGS CAPTURED
          </span>
        </div>
        
        <button 
          onClick={() => setAutoScroll(!autoScroll)}
          className={cn(
            "text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all",
            autoScroll ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-zinc-900 border-white/5 text-zinc-500"
          )}
        >
          Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};




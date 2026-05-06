import React from 'react';
import { Terminal, X, ChevronDown, Activity, Cpu, Zap, Database, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { signalBus, NeuralSignalEvent } from '@/lib/api-utils';
import { StudioLogEvent } from '@/lib/studio-logger';

interface EnhancedLog extends StudioLogEvent {
  id: string;
  type: 'neural' | 'studio';
}

export function NeuralConsole() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<EnhancedLog[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  React.useEffect(() => {
    const handleSignal = (e: any) => {
      const { signalId, method, url, status, duration } = e.detail as NeuralSignalEvent;
      const cleanUrl = url.split('?')[0].slice(0, 30);
      
      const newLog: EnhancedLog = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'neural',
        module: 'NETWORK',
        message: `[${signalId}] ${method} ${cleanUrl} -> ${status} (${duration}ms)`,
        level: status >= 400 ? 'error' : (status >= 200 && status < 300 ? 'success' : 'info'),
        timestamp: new Date().toLocaleTimeString(),
      };

      setLogs(prev => [...prev.slice(-49), newLog]);
    };

    const handleStudioLog = (e: any) => {
      const detail = e.detail as StudioLogEvent;
      const newLog: EnhancedLog = {
        ...detail,
        id: Math.random().toString(36).substr(2, 9),
        type: 'studio'
      };
      setLogs(prev => [...prev.slice(-49), newLog]);
    };

    signalBus.addEventListener('neural_signal', handleSignal);
    signalBus.addEventListener('studio_log', handleStudioLog);

    return () => {
      signalBus.removeEventListener('neural_signal', handleSignal);
      signalBus.removeEventListener('studio_log', handleStudioLog);
    };
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'anime': return 'text-cyan-400';
      case 'manhwa': return 'text-purple-400';
      case 'comic': return 'text-amber-400';
      case 'system': return 'text-red-400';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-500 font-bold';
      default: return 'text-zinc-400';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'system': return <Cpu className="w-2.5 h-2.5" />;
      case 'anime':
      case 'manhwa':
      case 'comic': return <Zap className="w-2.5 h-2.5" />;
      case 'success': return <Activity className="w-2.5 h-2.5" />;
      case 'error': return <Database className="w-2.5 h-2.5" />;
      default: return <Globe className="w-2.5 h-2.5" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, width: 320, opacity: 0, scale: 0.95, y: 20 }}
            animate={{ height: 400, width: 450, opacity: 1, scale: 1, y: 0 }}
            exit={{ height: 0, width: 320, opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl mb-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-studio/10 rounded-lg">
                  <Terminal className="w-4 h-4 text-studio" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Neural Monitor</h3>
                  <p className="text-[8px] text-zinc-500 font-medium uppercase tracking-widest">v2.4.0-OVERSIGHT</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Live</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="px-4 py-2 border-b border-white/5 bg-black/40 flex items-center gap-6 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest text-nowrap">CPU LOAD</span>
                <span className="text-[9px] font-mono text-studio">12.4%</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest text-nowrap">MEM ALLOC</span>
                <span className="text-[9px] font-mono text-cyan-400">248MB</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest text-nowrap">NET LATENCY</span>
                <span className="text-[9px] font-mono text-emerald-400">42ms</span>
              </div>
            </div>

            {/* Logs Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 font-mono text-[10px] space-y-3 overflow-y-auto no-scrollbar scroll-smooth"
            >
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-3">
                  <Activity className="w-8 h-8 text-zinc-500" />
                  <span className="text-[10px] uppercase tracking-[0.3em]">Awaiting Signals...</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="group relative flex flex-col gap-1 border-l border-white/5 pl-3 hover:border-studio/30 transition-colors">
                    <div className="flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5", getLevelColor(log.level))}>
                          {log.module}
                        </span>
                        <span className="text-[8px] text-zinc-600 font-bold">{log.timestamp}</span>
                      </div>
                      <div className={cn("flex items-center gap-1", getLevelColor(log.level))}>
                        {getLevelIcon(log.level)}
                        <span className="text-[7px] font-bold uppercase tracking-widest">{log.level}</span>
                      </div>
                    </div>
                    <div className={cn("text-[10px] leading-relaxed break-all", log.level === 'error' ? 'text-red-400' : 'text-zinc-300')}>
                      {log.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-black flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <div className="w-1 h-3 bg-studio/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ height: ["20%", "80%", "40%"] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-full bg-studio" 
                    />
                  </div>
                  <div className="w-1 h-3 bg-cyan-500/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ height: ["60%", "30%", "90%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-full bg-cyan-500" 
                    />
                  </div>
                  <div className="w-1 h-3 bg-emerald-500/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ height: ["40%", "70%", "20%"] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-full bg-emerald-500" 
                    />
                  </div>
                </div>
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Signal Integrity: 100%</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-700">#6E7D65E7</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative group overflow-hidden",
          isOpen ? "bg-studio text-white scale-90" : "bg-black border border-white/10 text-zinc-500 hover:border-studio/50 hover:text-studio"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-studio/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <ChevronDown className="w-6 h-6 relative z-10" /> : <Terminal className="w-6 h-6 relative z-10" />}
        
        {/* Unread indicator / Notification pulse */}
        {!isOpen && logs.length > 0 && (
          <div className="absolute top-3 right-3 w-2 h-2 bg-studio rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse" />
        )}

        {!isOpen && (
          <div className="absolute right-full mr-4 px-4 py-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-2xl">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">System Console</span>
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Monitor System Activity</span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}





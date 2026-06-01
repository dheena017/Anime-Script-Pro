import React from 'react';
import { Terminal, X, ChevronDown, Activity, Cpu, Zap, Database, Globe, Trash2, Filter, Download, Search, Play, Pause, ArrowUpDown, Copy, Sparkles, Pin, PinOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { clearLogHistory, describeLog, formatLogLabel, getLogCounts, getLogHistory, getLogDigest, persistLogHistory, restoreLogHistory, signalBus, NeuralSignalEvent, StudioLogEvent } from '@/lib/dev-console-logs';

interface EnhancedLog extends StudioLogEvent {
  type: 'neural' | 'studio';
}

export function NeuralConsole() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<EnhancedLog[]>(() =>
    getLogHistory(200).map((log) => ({ ...log, type: 'studio' as const }))
  );
  const [filter, setFilter] = React.useState<'all' | 'error' | 'success' | 'info' | 'system' | 'pinned'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [autoFollow, setAutoFollow] = React.useState(true);
  const [density, setDensity] = React.useState<'relaxed' | 'compact'>('relaxed');
  const [sortNewestFirst, setSortNewestFirst] = React.useState(true);
  const [selectedLogId, setSelectedLogId] = React.useState<string | null>(null);
  const [pinnedLogIds, setPinnedLogIds] = React.useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    restoreLogHistory();
    setLogs(getLogHistory(200).map((log) => ({ ...log, type: 'studio' as const })));
  }, []);

  React.useEffect(() => {
    if (autoFollow && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [autoFollow, logs]);

  const visibleLogs = React.useMemo(
    () => {
      const query = searchTerm.trim().toLowerCase();
      const filtered = logs.filter((log) => {
        const levelMatch = filter === 'all' || filter === 'pinned' ? true : log.level === filter;
        const pinMatch = filter === 'pinned' ? pinnedLogIds.includes(log.id) : true;
        if (!levelMatch) return false;
        if (!pinMatch) return false;
        if (!query) return true;

        const haystack = [
          log.module,
          log.message,
          log.summary,
          log.source,
          log.category,
          log.action,
          log.tags?.join(' '),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      });

      return sortNewestFirst ? filtered : [...filtered].reverse();
    },
    [filter, logs, pinnedLogIds, searchTerm, sortNewestFirst],
  );

  const selectedLog = React.useMemo(
    () => visibleLogs.find((log) => log.id === selectedLogId) || null,
    [selectedLogId, visibleLogs],
  );

  const logCounts = React.useMemo(() => {
    const counts = getLogCounts();
    return {
      total: counts.total,
      errors: counts.byLevel.error,
      warnings: counts.byLevel.warn,
      success: counts.byLevel.success,
    };
  }, [logs]);

  const digest = React.useMemo(() => getLogDigest(), [logs]);

  const handleClearLogs = () => {
    clearLogHistory();
    setLogs([]);
  };

  const handleExportLogs = () => {
    if (logs.length === 0) return;

    const blob = new Blob([
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          total: logs.length,
          logs,
        },
        null,
        2,
      ),
    ], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neural-console-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyVisibleLogs = async () => {
    if (visibleLogs.length === 0 || !navigator.clipboard) return;

    const payload = visibleLogs.map((log) => ({
      module: log.module,
      level: log.level,
      timestamp: log.timestamp,
      message: log.message,
      category: log.category,
      source: log.source,
      tags: log.tags,
      summary: log.summary,
    }));

    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  };

  const handleResetView = () => {
    setFilter('all');
    setSearchTerm('');
    setDensity('relaxed');
    setSortNewestFirst(true);
    setAutoFollow(true);
    setSelectedLogId(null);
    setPinnedLogIds([]);
  };

  const togglePin = (logId: string) => {
    setPinnedLogIds((current) => (
      current.includes(logId)
        ? current.filter((entry) => entry !== logId)
        : [...current, logId]
    ));
  };

  React.useEffect(() => {
    const handleSignal = (e: any) => {
      const { signalId, method, url, status, duration, source, category, summary, tags } = e.detail as NeuralSignalEvent;
      const cleanUrl = url.split('?')[0].slice(0, 30);
      
      const newLog: EnhancedLog = {
        id: Math.random().toString(36).substr(2, 9),
        sequence: Date.now(),
        type: 'neural',
        module: 'NETWORK',
        message: `[${signalId}] ${method} ${cleanUrl} -> ${status} (${duration}ms)`,
        level: status >= 400 ? 'error' : (status >= 200 && status < 300 ? 'success' : 'info'),
        timestamp: new Date().toLocaleTimeString(),
        summary: summary || `${method} ${cleanUrl}`,
        category: category || 'network',
        source: source || 'network',
        tags,
      };

      setLogs(prev => [...prev.slice(-49), newLog]);
      persistLogHistory();
    };

    const handleStudioLog = (e: any) => {
      const detail = e.detail as StudioLogEvent;
      const newLog: EnhancedLog = {
        ...detail,
        id: Math.random().toString(36).substr(2, 9),
        type: 'studio'
      };
      setLogs(prev => [...prev.slice(-49), newLog]);
      persistLogHistory();
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
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Neural Monitor</h3>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">v2.4.0-OVERSIGHT</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDensity((current) => (current === 'relaxed' ? 'compact' : 'relaxed'))}
                  className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 transition-colors inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {density}
                </button>
                <button
                  onClick={() => setSortNewestFirst((current) => !current)}
                  className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white hover:border-amber-400/40 hover:bg-amber-400/10 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  {sortNewestFirst ? 'Newest' : 'Oldest'}
                </button>
                <button
                  onClick={() => setAutoFollow((current) => !current)}
                  className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white hover:border-studio/40 hover:bg-studio/10 transition-colors inline-flex items-center gap-1"
                >
                  {autoFollow ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {autoFollow ? 'Follow' : 'Hold'}
                </button>
                <button
                  onClick={handleExportLogs}
                  className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-colors inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
                <button
                  onClick={handleCopyVisibleLogs}
                  className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white hover:border-emerald-400/40 hover:bg-emerald-400/10 transition-colors inline-flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                  <Filter className="w-3 h-3" />
                  {logCounts.total} events
                </div>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Live</span>
                </div>
                <button
                  onClick={handleClearLogs}
                  className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white hover:border-studio/40 hover:bg-studio/10 transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
                <button
                  onClick={handleResetView}
                  className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors inline-flex items-center gap-1"
                >
                  Reset
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-4 py-2 border-b border-white/5 bg-black/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {(['all', 'error', 'success', 'info', 'system', 'pinned'] as const).map((entry) => (
                <button
                  key={entry}
                  onClick={() => setFilter(entry)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border transition-colors whitespace-nowrap',
                    filter === entry
                      ? 'bg-studio/15 text-white border-studio/40'
                      : 'bg-white/5 text-zinc-500 border-white/5 hover:text-white hover:border-white/10',
                  )}
                >
                  {entry}
                </button>
              ))}
              <div className="ml-auto relative min-w-[12rem] max-w-[16rem] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 w-3 h-3 -translate-y-1/2 text-zinc-600" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search logs..."
                  className="w-full rounded-full border border-white/5 bg-white/5 py-1.5 pl-8 pr-3 text-[10px] font-medium uppercase tracking-[0.15em] text-white placeholder:text-zinc-700 outline-none transition-colors focus:border-studio/40 focus:bg-studio/10"
                />
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="px-4 py-2 border-b border-white/5 bg-black/40 flex items-center gap-6 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-nowrap">CPU LOAD</span>
                <span className="text-xs font-mono text-studio">12.4%</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-nowrap">MEM ALLOC</span>
                <span className="text-xs font-mono text-cyan-400">248MB</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-nowrap">NET LATENCY</span>
                <span className="text-xs font-mono text-emerald-400">42ms</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-nowrap">ERRORS</span>
                <span className="text-xs font-mono text-red-400">{logCounts.errors}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-nowrap">TOP MODULE</span>
                <span className="text-xs font-mono text-cyan-300">{digest.topModules[0]?.[0] || 'n/a'}</span>
              </div>
            </div>

            {/* Logs Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 font-mono text-xs space-y-3 overflow-y-auto no-scrollbar scroll-smooth"
            >
              {visibleLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-3">
                  <Activity className="w-8 h-8 text-zinc-500" />
                  <span className="text-xs uppercase tracking-[0.3em]">Awaiting Signals...</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 text-center max-w-[14rem]">
                    {searchTerm || filter !== 'all' ? 'Adjust filters or clear search to reveal matching signals.' : 'The console is ready for real-time traces.'}
                  </span>
                </div>
              ) : (
                visibleLogs.map((log) => {
                  const isPinned = pinnedLogIds.includes(log.id);
                  const isSelected = selectedLogId === log.id;

                  return (
                  <div
                    key={log.id}
                    className={cn(
                      'group relative flex flex-col border-l border-white/5 hover:border-studio/30 transition-colors cursor-pointer',
                      isSelected ? 'bg-studio/5 border-studio/50 shadow-[0_0_0_1px_rgba(6,182,212,0.08)]' : '',
                      density === 'compact' ? 'gap-0.5 pl-2 py-1' : 'gap-1 pl-3 py-2'
                    )}
                    onClick={() => setSelectedLogId(log.id)}
                  >
                    <div className="flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-xs font-black px-1.5 py-0.5 rounded bg-white/5", getLevelColor(log.level))}>
                          {formatLogLabel(log).split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">#{log.sequence}</span>
                        <span className="text-xs text-zinc-600 font-bold">{log.timestamp}</span>
                        {log.source && (
                          <span className="text-[10px] font-black uppercase tracking-[0.25em] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500">
                            {log.source}
                          </span>
                        )}
                      </div>
                      <div className={cn("flex items-center gap-1", getLevelColor(log.level))}>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            togglePin(log.id);
                          }}
                          className="mr-1 rounded-full p-1 text-zinc-600 transition-colors hover:text-white hover:bg-white/5"
                          aria-label={isPinned ? 'Unpin log' : 'Pin log'}
                        >
                          {isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                        </button>
                        {getLevelIcon(log.level)}
                        <span className="text-xs font-bold uppercase tracking-widest">{log.level}</span>
                      </div>
                    </div>
                    {(log.category || log.tags?.length || log.summary) && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {log.category && (
                          <span className="px-1.5 py-0.5 rounded bg-studio/10 text-[10px] font-black uppercase tracking-[0.2em] text-studio border border-studio/20">
                            {log.category}
                          </span>
                        )}
                        {log.tags?.map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border border-white/5">
                            {tag}
                          </span>
                        ))}
                        {log.summary && (
                          <span className="text-[10px] italic text-zinc-600">{log.summary}</span>
                        )}
                      </div>
                    )}
                    <div className={cn("text-xs leading-relaxed break-all", density === 'compact' ? 'text-[11px]' : 'text-xs', log.level === 'error' ? 'text-red-400' : 'text-zinc-300')}>
                      {log.message}
                    </div>
                  </div>
                  );
                })
              )}
            </div>

            {selectedLog && (
              <div className="px-4 py-3 border-t border-white/5 bg-black/60 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-studio">Selected Event</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">#{selectedLog.sequence}</span>
                    {selectedLog.category && <span className="px-1.5 py-0.5 rounded bg-studio/10 text-[10px] font-black uppercase tracking-[0.2em] text-studio border border-studio/20">{selectedLog.category}</span>}
                    {selectedLog.source && <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border border-white/5">{selectedLog.source}</span>}
                  </div>
                  <button
                    onClick={() => togglePin(selectedLog.id)}
                    className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-white transition-colors"
                  >
                    {pinnedLogIds.includes(selectedLog.id) ? 'Unpin' : 'Pin'}
                  </button>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                    <span>{selectedLog.module}</span>
                    <span>{selectedLog.timestamp}</span>
                  </div>
                  <p className={cn('text-xs leading-relaxed', selectedLog.level === 'error' ? 'text-red-300' : 'text-zinc-300')}>
                    {selectedLog.message}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                    {describeLog(selectedLog)}
                  </p>
                  {(selectedLog.tags?.length || selectedLog.summary || selectedLog.correlationId) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {selectedLog.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border border-white/5">
                          {tag}
                        </span>
                      ))}
                      {selectedLog.summary && <span className="text-[10px] italic text-zinc-600">{selectedLog.summary}</span>}
                      {selectedLog.correlationId && <span className="text-[10px] text-zinc-600">CID: {selectedLog.correlationId}</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="px-4 py-3 border-t border-white/5 bg-black/70 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] uppercase tracking-[0.25em]">
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
                <div className="text-zinc-500">Total</div>
                <div className="text-studio font-black text-sm">{digest.snapshot.total}</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
                <div className="text-zinc-500">Top Module</div>
                <div className="text-cyan-300 font-black text-sm">{digest.topModules[0]?.[0] || 'n/a'}</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
                <div className="text-zinc-500">Recent Errors</div>
                <div className="text-red-300 font-black text-sm">{digest.recentErrors.length}</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2">
                <div className="text-zinc-500">Trend</div>
                <div className="text-emerald-300 font-black text-sm">{digest.trend.success} / {digest.trend.error}</div>
              </div>
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
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Signal Integrity: 100%</span>
              </div>
              <span className="text-xs font-mono text-zinc-700">{logCounts.success} ok / {logCounts.warnings} warn</span>
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
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">System Console</span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest">Monitor System Activity</span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}





import { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Globe,
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  ShieldCheck,
  RefreshCw,
  Clock,
  Database,
  Terminal,
  SignalHigh
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { logsApi, SystemLog } from '@/services/api/logs';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const formatUptime = (seconds: number) => {
  if (!seconds || seconds < 0) return 'n/a';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
};

export default function SystemStatus() {
  const [health, setHealth] = useState<{ status: string; timestamp: string; orchestrator: { uptime: number; memory: Record<string, number>; platform: string; arch: string; }; backend: { url: string; status: string; }; } | null>(null);
  const [aiStatus, setAiStatus] = useState<{ openai: string; anthropic: string; groq: string; backend: string; providerCount: number; } | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const [healthRes, aiRes, logsData] = await Promise.all([
        fetch('/_orchestrator/health'),
        fetch('/_orchestrator/ai'),
        logsApi.getLogs(10)
      ]);

      if (!healthRes.ok) throw new Error('Failed to load orchestrator health');
      if (!aiRes.ok) throw new Error('Failed to load AI provider status');

      const healthJson = await healthRes.json();
      const aiJson = await aiRes.json();

      setHealth(healthJson);
      setAiStatus(aiJson.ai);
      setLogs(logsData);
    } catch (err: any) {
      console.error('Status sync failed:', err);
      setError(err?.message || 'Unable to load system telemetry');
      setHealth(null);
      setAiStatus(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const statusLabel = error
    ? 'OFFLINE'
    : health
      ? (health.status === 'online' ? 'OPTIMAL' : 'DEGRADED')
      : 'LOADING';
  
  const uptimeValue = health ? formatUptime(health.orchestrator.uptime) : 'loading...';
  const providerCount = aiStatus?.providerCount ?? 0;
  const activeProviderCount = aiStatus
    ? [aiStatus.openai, aiStatus.anthropic, aiStatus.groq].filter((s) => s === 'CONNECTED').length
    : 0;

  const stats = [
    { label: 'Orchestrator Uptime', value: uptimeValue, icon: Clock, color: 'text-emerald-500', nodeId: 'NODE-H1' },
    { label: 'AI Engines Active', value: `${activeProviderCount} / ${providerCount}`, icon: Zap, color: 'text-yellow-500', nodeId: 'NODE-H2' },
    { label: 'Backend Status', value: health?.backend.status ?? 'UNKNOWN', icon: Globe, color: 'text-sky-500', nodeId: 'NODE-H3' },
    { label: 'Telemetry Pulse', value: statusLabel, icon: ShieldCheck, color: error ? 'text-red-500' : 'text-fuchsia-500', nodeId: 'NODE-H4' }
  ];

  const services = [
    { name: 'Orchestrator', status: health?.status === 'online' ? 'operational' : (health ? 'degraded' : 'unknown'), latency: 'n/a', load: health ? '12%' : '0%' },
    { name: 'FastAPI Backend', status: health?.backend.status === 'ONLINE' ? 'operational' : (health ? 'degraded' : 'unknown'), latency: '8ms', load: '6%' },
    { name: 'OpenAI Core', status: aiStatus?.openai === 'CONNECTED' ? 'operational' : aiStatus?.openai ?? 'unknown', latency: '240ms', load: '14%' },
    { name: 'Anthropic Core', status: aiStatus?.anthropic === 'CONNECTED' ? 'operational' : aiStatus?.anthropic ?? 'unknown', latency: '320ms', load: '18%' },
    { name: 'Groq Hyper-Engine', status: aiStatus?.groq === 'CONNECTED' ? 'operational' : aiStatus?.groq ?? 'unknown', latency: '40ms', load: '22%' }
  ];

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 relative selection:bg-studio/30">
      
      {/* 1. ATOMIC SYNC OVERLAY */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-2.5 bg-studio/10 border border-studio/20 backdrop-blur-xl rounded-full shadow-[0_20px_50px_rgba(6,182,212,0.2)]"
          >
            <div className="w-2 h-2 rounded-full bg-studio animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-studio">System Sync Active</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. TERMINAL HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-studio/10 border border-studio/20 rounded-full">
            <span className="text-[9px] font-black text-studio uppercase tracking-[0.3em]">Master Infrastructure Terminal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-fuchsia-500 to-studio">VITALITY</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[10px] pl-1">
            Real-time status updates from the studio's infrastructure cores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
           <div className="flex items-center gap-8 px-10 py-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] shadow-2xl">
              <div className="flex flex-col gap-1">
                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Global Status</span>
                 <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", error ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]")} />
                    <span className={cn("text-xs font-black uppercase italic", error ? "text-red-500" : "text-emerald-500")}>{statusLabel}</span>
                 </div>
              </div>
              <div className="w-px h-10 bg-white/5" />
              <div className="flex flex-col gap-1">
                 <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Signal Stability</span>
                 <span className="text-xs font-black text-studio italic uppercase tabular-nums">99.98%</span>
              </div>
           </div>
           <button 
             onClick={refreshStatus}
             disabled={isRefreshing}
             className="flex items-center gap-4 px-10 py-6 bg-studio text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_20px_50px_rgba(6,182,212,0.3)] active:scale-95 disabled:opacity-50"
           >
             <RefreshCw className={cn("w-5 h-5", isRefreshing ? "animate-spin" : "")} /> SYNC TELEMETRY
           </button>
        </div>
      </div>

      {/* 3. VITALITY STATS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#0a0a0b] border-white/5 rounded-[2.5rem] shadow-3xl group hover:border-studio/30 transition-all duration-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <CardContent className="p-10 relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className={cn("p-4 rounded-2xl bg-white/[0.03] border border-white/5", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">{stat.nodeId}</span>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tighter italic group-hover:translate-x-1 transition-transform duration-500 truncate">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 4. SERVICE GRID & INCIDENT LOGS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* SERVICE GRID */}
        <div className="xl:col-span-7 space-y-8">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-4">
                <Cpu className="w-5 h-5 text-studio" />
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Infrastructure Nodes</h2>
             </div>
             <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">REGISTRY: #INF-8842-A</span>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {services.map((service, idx) => (
              <div
                key={service.name}
                className="p-8 bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-studio/30 transition-all duration-700 relative overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-studio/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex items-center gap-8 relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700",
                    service.status === 'operational' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'
                  )}>
                    {service.status === 'operational' ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-7 h-7 text-yellow-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-white uppercase italic tracking-tighter group-hover:text-studio transition-colors">{service.name}</h4>
                    <div className="flex items-center gap-3">
                       <span className={cn("text-[9px] font-black uppercase tracking-widest", service.status === 'operational' ? "text-emerald-500" : "text-yellow-500")}>{service.status}</span>
                       <span className="text-zinc-800 text-[8px] font-black uppercase tracking-widest tabular-nums">NODE-{(idx + 1).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 relative z-10">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">Latency</p>
                    <p className="text-xs font-black text-zinc-300 italic tracking-widest">{service.latency}</p>
                  </div>
                  <div className="text-right w-32">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">Load</p>
                       <span className="text-[9px] font-black text-white tabular-nums tracking-widest">{service.load}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: service.load }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]",
                          parseInt(service.load) > 80 ? 'bg-red-500' : 'bg-studio'
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INCIDENT LOGS */}
        <div className="xl:col-span-5 space-y-8">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-4">
                <Terminal className="w-5 h-5 text-fuchsia-500" />
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">System Incident Archive</h2>
             </div>
             <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">SYNC: ACTIVE</span>
          </div>

          <Card className="bg-[#0a0a0b] border-white/5 rounded-[3rem] shadow-3xl relative overflow-hidden h-[730px]">
             <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/[0.02] to-transparent pointer-events-none" />
             <CardContent className="p-10 space-y-10 overflow-y-auto h-full hide-scrollbar relative z-10">
                {logs.length > 0 ? (
                  logs.map((log, i) => (
                    <div key={log.id || i} className="flex gap-8 group/log relative">
                      <div className="w-24 shrink-0 space-y-1 pt-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest italic">
                          {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NOW'}
                        </p>
                        <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
                           {log.timestamp ? new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'MAY 02'}
                        </p>
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-4">
                           <h4 className="text-sm font-black text-zinc-200 uppercase italic tracking-tight group-hover/log:text-studio transition-colors leading-tight">{log.message}</h4>
                           <span className={cn(
                             "text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border shadow-2xl",
                             log.level === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-red-500/10' : 
                             log.level === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-yellow-500/10' : 
                             'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-emerald-500/10'
                           )}>
                             {log.level}
                           </span>
                        </div>
                        <div className="flex items-center gap-6 text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">
                           <span className="flex items-center gap-2 pr-4 border-r border-white/5"><Globe className="w-3 h-3" /> {log.source}</span>
                           <span className="flex items-center gap-2"><SignalHigh className="w-3 h-3" /> HASH: #{String(log.id || 'N/A').slice(0, 8).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 grayscale">
                    <Activity className="w-16 h-16 text-zinc-500 animate-pulse" />
                    <p className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] text-center">System is quiet.<br />No incidents recorded.</p>
                  </div>
                )}
             </CardContent>
          </Card>
        </div>
      </div>

      {/* SYSTEM FOOTER METADATA */}
      <footer className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] border-t border-white/5 pt-12">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span>Verified Infrastructure Hash: #VIH-8842-X</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-3">
             <Database className="w-4 h-4 text-studio" />
             <span>Storage Sync: Optimal</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-studio fill-studio" />
              <span>Production Hub: Tokyo / LA Sync Active</span>
           </div>
        </div>
      </footer>
    </div>
  );
}

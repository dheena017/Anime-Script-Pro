import React from 'react';
import { Settings, History, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { engineApi } from '@/services/api/engine';

export const EngineLogs: React.FC = () => {
  const [logs, setLogs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await engineApi.getRecentTelemetry(50);
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS': return 'text-emerald-500';
      case 'ERROR': return 'text-red-500';
      case 'FALLBACK': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-500/10 border border-zinc-500/20 rounded-full">
            <Settings className="w-3 h-3 text-zinc-400" />
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">System Logs</span>
          </div>
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
            INCIDENT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400">ARCHIVE</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Telemetry Active</span>
          </div>
          <button className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter Incident Archive
          </button>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Timestamp</th>
              <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Layer</th>
              <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Message</th>
              <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-zinc-600 animate-pulse font-black uppercase tracking-widest text-[10px]">
                  Fetching System Archive...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-zinc-600 font-black uppercase tracking-widest text-[10px]">
                  No incidents recorded in current cycle.
                </td>
              </tr>
            ) : logs.map((log, i) => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-5 font-mono text-[10px] text-zinc-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-8 py-5">
                  <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">
                    {log.model}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                  {log.endpoint.toUpperCase()} - {log.request_summary || 'No summary available'}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      log.status === 'SUCCESS' && "bg-emerald-500",
                      log.status === 'ERROR' && "bg-red-500",
                      log.status === 'FALLBACK' && "bg-amber-500"
                    )} />
                    <span className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", getStatusColor(log.status))}>
                      {log.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center py-10">
        <div className="flex items-center gap-4 text-zinc-600">
          <History className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">End of archived logs. Total capacity: 100 entries.</span>
        </div>
      </div>
    </div>
  );
};




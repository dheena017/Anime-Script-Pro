import { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Activity, 
  RefreshCw, 
  Clock, 
  Server, 
  Database, 
  Network 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const SystemHealthTab: React.FC = () => {
  const [lastSync, setLastSync] = useState(new Date());

  const metrics = [
    { label: "AI Core", value: "V3.24-S", icon: Cpu, color: "text-emerald-500", status: "Operational" },
    { label: "System Load", value: "14%", icon: Zap, color: "text-cyan-500", status: "Optimal" },
    { label: "Global Edge", value: "128ms", icon: Network, color: "text-blue-500", status: "Active" },
    { label: "Security", value: "Level 9", icon: ShieldCheck, color: "text-indigo-500", status: "Encrypted" },
    { label: "Orchestrator", value: "Node-B", icon: Server, color: "text-purple-500", status: "Online" },
    { label: "Storage Grid", value: "99.99%", icon: Database, color: "text-amber-500", status: "Ready" },
  ];

  return (
    <div className="space-y-10">
      {/* Diagnostics Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-zinc-950/50 border border-white/5 p-8 rounded-[2.5rem]">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">System Diagnostics</h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Real-time telemetry and health monitoring across global nodes</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Last Sync</div>
            <div className="text-xs text-emerald-500 font-mono flex items-center gap-2 justify-end">
              <Clock className="w-3.5 h-3.5" />
              {lastSync.toLocaleTimeString()}
            </div>
          </div>
          <button 
            onClick={() => setLastSync(new Date())}
            className="p-3 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-zinc-950 border border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center group hover:border-[#bd4a4a]/30 transition-all"
          >
            <div className={cn("p-3 rounded-xl bg-zinc-900 border border-white/5 mb-4 group-hover:bg-zinc-900 transition-colors")}>
              <m.icon className={cn("w-5 h-5", m.color)} />
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-lg font-black text-white italic mb-2">{m.value}</p>
            <span className={cn("text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border", m.color.replace('text-', 'border-').replace('500', '500/20'), m.color.replace('text-', 'bg-').replace('500', '500/10'))}>
              {m.status}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Detailed Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Activity className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Pulse Telemetry</h3>
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Direct stream from AI Synthesis Core</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Live Flow</span>
            </div>
          </div>
          <div className="h-48 w-full flex items-end gap-1">
            {Array.from({ length: 45 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: "10%" }}
                animate={{ height: `${20 + Math.random() * 80}%` }}
                transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse", delay: i * 0.03 }}
                className="flex-1 bg-gradient-to-t from-emerald-500/5 to-emerald-500/30 rounded-t-sm group-hover:to-emerald-500/50 transition-all"
              />
            ))}
          </div>
        </div>

        <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <Network className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Node Infrastructure</h3>
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Distributed Global Edge Network</p>
              </div>
            </div>
            <span className="text-[9px] text-blue-500 font-black uppercase tracking-widest">12 Active Nodes</span>
          </div>
          <div className="space-y-3">
            {[
              { id: 'TYO-P1', location: 'Tokyo-Prime-01', uptime: '99.99%', status: 'Stable' },
              { id: 'LON-A4', location: 'London-Alpha-04', uptime: '99.95%', status: 'Stable' },
              { id: 'NYC-G9', location: 'US-East-Gamma-09', uptime: '99.98%', status: 'Active' },
            ].map((node, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{node.location}</span>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">{node.id} // SECURE</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">{node.uptime}</div>
                  <div className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">{node.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthTab;

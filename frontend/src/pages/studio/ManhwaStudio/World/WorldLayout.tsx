import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { StudioRealtimeDataState } from '@/hooks/useStudioRealtimeData';

export default function WorldLayout() {
  const realtimeData = useOutletContext<StudioRealtimeDataState>();

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4 border-b border-violet-500/20 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/30">
          <Globe className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Manhwa World Builder</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Environment & Narrative Foundations</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2rem] bg-black/40 border border-violet-500/10 h-64 flex flex-col items-center justify-center text-center space-y-4"
        >
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">System Analysis Active</p>
          <h3 className="text-zinc-400 text-xs font-bold px-8">The Manhwa World Synthesis module is initializing. Define your concept in the Creative Engine to begin.</h3>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[2rem] bg-black/40 border border-violet-500/10 h-64 flex flex-col justify-center space-y-3"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-300/70">Live API Data</p>
          <p className="text-sm font-bold text-white">{realtimeData?.isLoading ? 'Syncing world data...' : 'World page is receiving live studio state.'}</p>
          <p className="text-xs text-zinc-500">
            {realtimeData?.lastSyncedAt ? `Last sync ${new Date(realtimeData.lastSyncedAt).toLocaleTimeString()}` : 'Waiting for API sync'}
          </p>
          <p className="text-xs text-zinc-500">Recent logs: {realtimeData?.recentLogs.length ?? 0}</p>
        </motion.div>
      </div>
    </div>
  );
}

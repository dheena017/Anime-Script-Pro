import React from 'react';
import { Box, User, Image, Music, Map, Database, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SeriesEmptyTab } from '../components/SeriesEmptyTab';

interface AssetsTabProps {
  plan: any[];
}

export const AssetsTab: React.FC<AssetsTabProps> = ({ plan }) => {
  if (!plan || plan.length === 0) {
    return (
      <SeriesEmptyTab 
        icon={Database}
        title="Asset Matrix Empty"
        description="No production assets have been cataloged yet. A series plan is required to map the resource matrix."
        accentColor="emerald"
      />
    );
  }
  // Extract real metrics from the plan
  const characterSet = new Set<string>();
  const environmentSet = new Set<string>();
  let totalScenes = 0;
  
  plan.forEach(ep => {
    ep.focus_characters?.forEach((c: string) => characterSet.add(c));
    if (ep.setting) environmentSet.add(ep.setting);
    totalScenes += parseInt(ep.asset_matrix?.scene_count || "0");
  });

  const metrics = [
    { label: 'Cast Members', icon: User, count: characterSet.size, status: characterSet.size > 0 ? 'Active Focus' : 'Awaiting Data', color: 'text-blue-400' },
    { label: 'Master Sets', icon: Map, count: environmentSet.size, status: environmentSet.size > 0 ? 'Unique Locations' : 'Awaiting Data', color: 'text-amber-400' },
    { label: 'Key Visuals', icon: Image, count: plan.reduce((acc, ep) => acc + (ep.asset_matrix?.image ? 1 : 0), 0), status: 'Manifest Matrix', color: 'text-rose-400' },
    { label: 'Audio Suites', icon: Music, count: plan.reduce((acc, ep) => acc + (ep.asset_matrix?.sound ? 1 : 0), 0), status: 'Manifest Matrix', color: 'text-emerald-400' }
  ];

  return (
    <div className="py-8 space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-12">
        <motion.div 
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
          <Box className="w-12 h-12 text-emerald-400" />
        </motion.div>
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Asset <span className="text-emerald-500">Matrix</span></h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">Cross-episode resource manifesting and structural tracking</p>
        </div>
        <div className="md:ml-auto flex gap-4">
            <div className="px-6 py-3 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4">
                <Database className="w-4 h-4 text-emerald-500/60" />
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Total Scene Units</span>
                    <span className="text-xl font-black text-white font-mono">{totalScenes}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-[#080808] border border-white/5 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <item.icon className="w-32 h-32" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center transition-transform group-hover:scale-110 border border-emerald-500/20">
               <item.icon className={cn("w-7 h-7", item.color)} />
            </div>
            
            <div className="space-y-1 relative z-10">
               <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{item.label}</h3>
               <p className="text-5xl font-black text-white font-mono tracking-tighter">{item.count}</p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/60">{item.status}</span>
               <ScanLine className="w-3 h-3 text-zinc-800" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Asset List Preview */}
      <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 mt-12">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Environment Catalog Preview
          </h4>
          <div className="flex flex-wrap gap-3">
              {Array.from(environmentSet).map((env, i) => (
                  <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:border-emerald-500/20 hover:text-emerald-400 transition-all cursor-default">
                      {env}
                  </span>
              ))}
          </div>
      </div>
    </div>
  );
};





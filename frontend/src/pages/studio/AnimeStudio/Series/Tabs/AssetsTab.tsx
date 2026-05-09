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
    <div className="space-y-20 pb-20">
      {/* Cinematic Header Section */}
      <div className="relative border-b border-white/5 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-30" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="inline-block px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] uppercase tracking-[0.5em] text-emerald-400 font-black shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-md"
            >
              Resource Matrix // Inventory v1.0.4
            </motion.div>
            <div className="space-y-2">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none"
              >
                Asset <span className="text-emerald-500 italic">Matrix</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] max-w-xl leading-loose"
              >
                Cross-episode resource manifesting and structural tracking for physical and digital assets.
              </motion.p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="px-8 py-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-6 backdrop-blur-md">
              <Database className="w-6 h-6 text-emerald-500/60" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Scene Units</span>
                <span className="text-3xl font-black text-white font-mono leading-none">{totalScenes}</span>
              </div>
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

      {/* Character Roster */}
      <div className="space-y-6">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3 px-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              Manifested Cast DNA
          </h4>
          <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] backdrop-blur-md">
            <div className="flex flex-wrap gap-4">
                {Array.from(characterSet).map((char, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-6 py-3 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-[11px] font-black text-blue-400 uppercase tracking-widest hover:border-blue-500/40 hover:bg-blue-500/10 transition-all cursor-pointer flex items-center gap-3"
                    >
                        <User className="w-3.5 h-3.5" />
                        {char}
                    </motion.div>
                ))}
            </div>
          </div>
      </div>

      {/* Environment Catalog */}
      <div className="space-y-6">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3 px-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              Master Set Locations
          </h4>
          <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] backdrop-blur-md">
            <div className="flex flex-wrap gap-4">
                {Array.from(environmentSet).map((env, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-6 py-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-[11px] font-black text-amber-400 uppercase tracking-widest hover:border-amber-500/40 hover:bg-amber-500/10 transition-all cursor-pointer flex items-center gap-3"
                    >
                        <Map className="w-3.5 h-3.5" />
                        {env}
                    </motion.div>
                ))}
            </div>
          </div>
      </div>

      {/* Episode Asset Breakdown */}
      <div className="space-y-8">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3 px-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
              Episode Resource Distribution
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plan.map((ep, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-rose-500/30 transition-all group backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <h5 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-rose-500 transition-colors">
                      Episode {ep.episode_number || idx + 1}
                    </h5>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{ep.title || 'Untitled Archive'}</p>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Units</span>
                      <span className="text-xl font-black text-rose-500 font-mono">{ep.asset_matrix?.scene_count || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Runtime</span>
                      <span className="text-xl font-black text-rose-500 font-mono">{ep.asset_matrix?.estimated_minutes || 0}m</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Visual DNA</span>
                    <div className={cn("h-1.5 w-full rounded-full overflow-hidden bg-white/5")}>
                       <div className={cn("h-full bg-rose-500/40", ep.asset_matrix?.image ? "w-full" : "w-0")} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Audio Forge</span>
                    <div className={cn("h-1.5 w-full rounded-full overflow-hidden bg-white/5")}>
                       <div className={cn("h-full bg-rose-500/40", ep.asset_matrix?.sound ? "w-full" : "w-0")} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Manifest</span>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase truncate">{ep.setting || 'Not Set'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
      </div>
    </div>
  );
};





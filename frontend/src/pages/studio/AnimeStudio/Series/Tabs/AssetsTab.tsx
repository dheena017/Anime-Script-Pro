import React from 'react';
import { Box, User, Image, Music, Map, Database, ScanLine, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SeriesEmptyTab } from '../components/SeriesEmptyTab';

interface AssetsTabProps {
  plan: any[];
}

/**
 * AssetsTab - The Neural Resource Manifest
 * A diagnostic view of all project resources across the series.
 */
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

  const characterSet = new Set<string>();
  const environmentSet = new Set<string>();
  
  plan.forEach(ep => {
    ep.focus_characters?.forEach((c: string) => characterSet.add(c));
    if (ep.setting) environmentSet.add(ep.setting);
  });

  const metrics = [
    { label: 'Cast Members', icon: User, count: characterSet.size, status: characterSet.size > 0 ? 'Active Focus' : 'Awaiting Data', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
    { label: 'Master Sets', icon: Map, count: environmentSet.size, status: environmentSet.size > 0 ? 'Unique Locations' : 'Awaiting Data', color: 'text-amber-400', glow: 'shadow-amber-500/20' },
    { label: 'VFX Units', icon: Box, count: plan.reduce((acc, ep) => acc + (ep.asset_matrix?.scene_count || 0), 0), status: 'Complex Logic', color: 'text-studio', glow: 'shadow-studio/20' },
    { label: 'Audio Suites', icon: Music, count: plan.reduce((acc, ep) => acc + (ep.asset_matrix?.sound ? 1 : 0), 0), status: 'Manifest Matrix', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' }
  ];

  return (
    <div className="space-y-24 pb-24">

      {/* High-Impact Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-10 bg-[#050505]/60 backdrop-blur-xl border border-white/5 rounded-[3rem] space-y-6 hover:border-white/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity">
                <item.icon className="w-32 h-32" />
            </div>

            <div className={cn(
              "w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-white/20 shadow-xl",
              item.glow
            )}>
               <item.icon className={cn("w-8 h-8", item.color)} />
            </div>
            
            <div className="space-y-1 relative z-10">
               <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">{item.label}</h3>
               <p className="text-3xl font-black text-white font-mono tracking-tighter leading-none">{item.count}</p>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
               <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">{item.status}</span>
               <ScanLine className="w-4 h-4 text-zinc-800" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Production Palette Breakdown */}
      <div className="space-y-8">
          <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4 px-4">
              <div className="w-1.5 h-1.5 rounded-full bg-studio shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              Master Production Palette
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plan.map((ep, idx) => ep.production_palette && (
              <div key={idx} className="p-8 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] space-y-6 hover:border-studio/30 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.4em]">Unit {ep.episode}</span>
                  <div className="flex gap-1.5">
                    {ep.production_palette.dominant_colors?.map((c: string, ci: number) => (
                      <div key={ci} className="w-4 h-4 rounded-full border border-black/50 shadow-lg" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-studio/60" />
                    <p className="text-xs font-black text-studio uppercase tracking-widest">Leitmotif</p>
                  </div>
                  <p className="text-[13px] text-zinc-300 font-bold truncate tracking-tight">{ep.production_palette.audio_leitmotif || 'N/A'}</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-zinc-500 leading-relaxed italic line-clamp-2">"{ep.production_palette.lighting_setup || 'Standard production lighting'}"</p>
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Resource Intensity Grid */}
      <div className="space-y-8">
          <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-4 px-4">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
              Resource Intensity Manifest
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plan.map((ep, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="p-10 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-[3rem] hover:border-rose-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                   <Activity className="w-40 h-40" />
                </div>

                <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
                  <div className="space-y-2">
                    <span className="text-xs font-black text-rose-500/60 uppercase tracking-[0.4em]">Node {ep.episode}</span>
                    <h5 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-rose-500 transition-colors">
                      {ep.title}
                    </h5>
                  </div>
                  <div className="flex gap-10">
                    <div className="text-center">
                      <p className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-1">Units</p>
                      <p className="text-3xl font-black text-white font-mono leading-none">{ep.asset_matrix?.scene_count || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-1">Mins</p>
                      <p className="text-3xl font-black text-white font-mono leading-none">{ep.asset_matrix?.estimated_minutes || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                  <div className="space-y-3">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Visual DNA
                    </span>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                       <div className={cn("h-full bg-purple-500/40 transition-all duration-1000", ep.asset_matrix?.image ? "w-full" : "w-0")} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Audio Forge
                    </span>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                       <div className={cn("h-full bg-blue-500/40 transition-all duration-1000", ep.asset_matrix?.sound ? "w-full" : "w-0")} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Environment
                    </span>
                    <p className="text-[12px] font-bold text-zinc-300 uppercase truncate leading-none">{ep.setting || 'Locked'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
      </div>
    </div>
  );
};

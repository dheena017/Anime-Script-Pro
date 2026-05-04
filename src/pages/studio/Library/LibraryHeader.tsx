import React from 'react';
import { Library, Database, Cloud, Activity, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const LibraryHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 mb-12 pt-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#bd4a4a] blur-2xl opacity-20 animate-pulse" />
            <div className="relative p-5 bg-zinc-950 border border-[#bd4a4a]/30 rounded-[2rem] shadow-[0_0_40px_rgba(189,74,74,0.15)]">
              <Library className="w-8 h-8 text-[#bd4a4a]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#bd4a4a]/10 border border-[#bd4a4a]/20 rounded-full text-[8px] font-black text-[#bd4a4a] uppercase tracking-widest">
                Version 4.2.0
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">System Online</span>
              </div>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
              Library <span className="text-zinc-800">/</span> <span className="text-[#bd4a4a]">Vault</span>
            </h1>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-3">
              Neural asset indexing & production archives
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {[
            { icon: Activity, label: "Indexing", value: "98.2%", color: "text-blue-400" },
            { icon: ShieldCheck, label: "Security", value: "Verified", color: "text-emerald-400" },
            { icon: Zap, label: "Latency", value: "12ms", color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-950/50 border border-white/5 rounded-2xl px-5 py-3 flex flex-col gap-1 min-w-[120px]">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-3 h-3 ${stat.color}`} />
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-8 py-4 border-y border-white/5">
        <div className="flex items-center gap-3">
          <Database className="w-4 h-4 text-zinc-600" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Archive Size</span>
            <span className="text-[10px] font-bold text-white">42.8 GB / 1.2 TB</span>
          </div>
        </div>
        <div className="h-8 w-px bg-white/5" />
        <div className="flex items-center gap-3">
          <Cloud className="w-4 h-4 text-[#bd4a4a]/50" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Cloud Sync</span>
            <span className="text-[10px] font-bold text-white">Continuous Protection Active</span>
          </div>
        </div>
        <div className="h-8 w-px bg-white/5" />
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 ring-1 ring-white/10 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-[#bd4a4a] flex items-center justify-center text-[10px] font-black text-white ring-1 ring-[#bd4a4a]/50">
              +12
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Active Contributors</span>
        </div>
      </div>
    </div>
  );
};





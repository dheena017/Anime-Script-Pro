import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Cpu, 
  Shield, 
  Globe, 
  Activity, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { CORE_FEATURES, PRODUCTION_STATS } from '../constants';

const iconMap = {
  Cpu: Cpu,
  Shield: Shield,
  Globe: Globe,
  Zap: Zap,
  Activity: Activity,
  Layers: Layers
};

export const Features: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-32 px-6">
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col items-center text-center mb-24 space-y-4">
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-studio/5 border border-studio/20">
           <Layers className="w-3.5 h-3.5 text-studio" />
           <span className="text-xs font-black text-studio uppercase tracking-[0.3em]">Core Production Matrix</span>
        </div>
        <h2 className="text-4xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
          Architectural <span className="text-studio">Sovereignty</span>
        </h2>
        <p className="text-zinc-500 max-w-2xl uppercase text-xs font-bold tracking-widest leading-relaxed">
          The most advanced autonomous production engine ever built for the anime industry. Optimized for global collaboration.
        </p>
      </div>

      {/* 2. PRODUCTION LAYERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {CORE_FEATURES.map((feature, i) => {
          const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Zap;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col p-10 rounded-[3rem] bg-[#0a0a0b] border border-white/5 hover:border-studio/30 transition-all duration-500 overflow-hidden shadow-2xl"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-studio/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                {/* Header Node */}
                <div className="flex items-center justify-between mb-10">
                   <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-studio group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-500 group-hover:-rotate-6">
                      <IconComponent className="w-8 h-8 text-zinc-500 group-hover:text-black transition-colors" />
                   </div>
                   <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                         <Activity className="w-3 h-3 text-studio animate-pulse" />
                         <span className="text-xs font-black text-white uppercase tracking-widest">Active</span>
                      </div>
                      <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">{feature.category}</span>
                   </div>
                </div>

                {/* Content Layer */}
                <div className="space-y-4 mb-10">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-studio transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase tracking-widest group-hover:text-zinc-300 transition-colors">
                    {feature.desc}
                  </p>
                </div>

                {/* Telemetry Readout */}
                <div className="mt-auto pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">Efficiency</span>
                      <div className="text-xs font-black text-emerald-500 uppercase italic">99.8% Sync</div>
                   </div>
                   <div className="space-y-1 text-right">
                      <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">Latency</span>
                      <div className="text-xs font-black text-studio uppercase italic">{PRODUCTION_STATS.latency}</div>
                   </div>
                </div>

                {/* Action protocol */}
                <button className="mt-8 flex items-center gap-2 text-xs font-black text-zinc-600 uppercase tracking-[0.3em] hover:text-white transition-colors group/btn no-underline">
                   View Protocol <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. PERFORMANCE INDEX BANNER */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-center gap-12 lg:gap-24"
      >
         <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">Total Transmissions</span>
            <span className="text-3xl font-black text-white italic">1.2M+</span>
         </div>
         <div className="w-[1px] h-12 bg-white/5 hidden md:block" />
         <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">Production Nodes</span>
            <span className="text-3xl font-black text-studio italic">842</span>
         </div>
         <div className="w-[1px] h-12 bg-white/5 hidden md:block" />
         <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">System Uptime</span>
            <span className="text-3xl font-black text-emerald-500 italic">99.9%</span>
         </div>
      </motion.div>
    </section>
  );
};



import React from 'react';
import { BookOpen, Zap, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const TutorialsHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#bd4a4a] blur-2xl opacity-20 animate-pulse" />
            <div className="relative p-5 bg-zinc-950 border border-[#bd4a4a]/30 rounded-[2rem] shadow-[0_0_40px_rgba(189,74,74,0.15)]">
              <BookOpen className="w-8 h-8 text-[#bd4a4a]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#bd4a4a]/10 border border-[#bd4a4a]/20 rounded-full text-xs font-black text-[#bd4a4a] uppercase tracking-widest">
                Creator Academy
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Mastery Level: 42</span>
              </div>
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">
              Knowledge <span className="text-zinc-800">/</span> <span className="text-[#bd4a4a]">Vault</span>
            </h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mt-3">
              Master the art of storytelling and production
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {[
            { icon: Activity, label: "Progress", value: "68%", color: "text-blue-400" },
            { icon: ShieldCheck, label: "Certification", value: "Level 2", color: "text-emerald-400" },
            { icon: Zap, label: "Sync Speed", value: "Instant", color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-950/50 border border-white/5 rounded-2xl px-5 py-3 flex flex-col gap-1 min-w-[120px]">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-3 h-3 ${stat.color}`} />
                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

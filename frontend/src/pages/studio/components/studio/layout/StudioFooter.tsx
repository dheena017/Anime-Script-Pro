import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGeneratorState } from '@/hooks/useGenerator';
import { Loader2 } from 'lucide-react';

const StatusIndicator = ({ label, status, colorClass, glowColor }: { label: string, status: string, colorClass: string, glowColor: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-[7px] font-black text-zinc-700 tracking-widest mb-1.5 uppercase">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-1 h-1 ${colorClass} rounded-full`} style={{ boxShadow: `0 0 8px ${glowColor}` }} />
      <span className="text-[8px] font-black text-zinc-500 tracking-wider uppercase">{status}</span>
    </div>
  </div>
);

export const StudioFooter: React.FC = () => {
  const { isSaving } = useGeneratorState();

  return (
    <footer className="bg-[#030303] py-8 px-10 relative z-50 overflow-hidden border-t border-white/5">
      {/* Decorative System Top Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Identity Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]" />
              </div>
              <div className="flex flex-col">
                 <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                   PRODUCTION <span className="text-emerald-500">STUDIO</span>
                 </h2>
                 <span className="text-[8px] font-black text-zinc-600 tracking-[0.5em] uppercase mt-1">Professional Content Creation Platform</span>
              </div>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed max-w-sm font-medium tracking-wide uppercase opacity-90">
              The next-generation production environment for creators. 
              Advanced technology to bring stories to life. 
              Built for unlimited creative expression and professional workflows.
            </p>
            <div className="flex gap-4">
               {['Twitter', 'Discord', 'Github'].map(social => (
                 <Link key={social} to="#" className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:border-white/10 transition-all text-[8px] font-black uppercase tracking-widest">
                    {social[0]}
                 </Link>
               ))}
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-white tracking-[0.4em] uppercase border-b border-white/5 pb-4">Features</h3>
              <ul className="space-y-4">
                {['Discover', 'Community', 'Library', 'Dashboard'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-[10px] font-bold text-zinc-500 hover:text-emerald-400 transition-all uppercase tracking-[0.2em] flex items-center gap-2 group">
                      <div className="w-0 h-px bg-emerald-500 group-hover:w-3 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-white tracking-[0.4em] uppercase border-b border-white/5 pb-4">Settings</h3>
              <ul className="space-y-4">
                {['Documentation', 'Status', 'Reports', 'Logs'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em] flex items-center gap-2 group">
                      <div className="w-0 h-px bg-white group-hover:w-3 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* System Metrics & Synchronization */}
          <div className="lg:col-span-3 flex flex-col items-end justify-between gap-10">
            <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
              <StatusIndicator label="ENGINE" status="STABLE" colorClass="bg-emerald-500" glowColor="rgba(16,185,129,0.8)" />
              <StatusIndicator label="SYNC" status="ACTIVE" colorClass="bg-blue-500" glowColor="rgba(59,130,246,0.8)" />
              <StatusIndicator label="SYSTEM" status={isSaving ? "SAVING" : "IDLE"} colorClass={isSaving ? "bg-amber-500" : "bg-red-500"} glowColor={isSaving ? "rgba(245,158,11,0.8)" : "rgba(239,68,68,0.8)"} />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(16,185,129,0.05)' }}
              whileTap={{ scale: 0.98 }}
              disabled={isSaving}
              className="w-full lg:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-white/[0.01] border border-white/10 rounded-2xl group transition-all duration-500 disabled:opacity-50 hover:border-emerald-500/40"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              ) : (
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              )}
              <span className="text-[11px] font-black text-white tracking-[0.4em] uppercase">
                {isSaving ? "Synchronizing..." : "CODE SYNCHRONIZED"}
              </span>
            </motion.button>

            <div className="text-right space-y-1">
              <span className="block text-[9px] font-black text-zinc-700 tracking-[0.5em] uppercase">Design/Operate</span>
              <span className="block text-1xl font-black text-zinc-300 tracking-[0.1em] uppercase">TKO-PRIME-V3</span>
            </div>
          </div>
        </div>

        {/* Global Metadata Strip */}
        <div className="pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-10">
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.2em]">© 2026 STUDIO ARCHITECT, ENGINEERED FOR CREATORS.</span>
            <div className="hidden md:flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500/20 rounded-full" />
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">GLOBAL UPTIME: 99.99%</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-500/20 rounded-full" />
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">CONNECTION: ACTIVE</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em]">Build: MAIN-ROOT</span>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">V3.22.5.Free</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.3em]">Legacy Protocol</span>
              <span className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest underline decoration-emerald-500/10">EndOfFile_Act.214</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


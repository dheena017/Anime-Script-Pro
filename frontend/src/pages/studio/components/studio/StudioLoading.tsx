import { Activity, Cpu, Zap, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface StudioLoadingProps {
  message?: string;
  submessage?: string;
  fullPage?: boolean;
  progress?: number;
}

const BOOT_LOGS = [
  "Synchronizing lore vectors...",
  "Initializing cast DNA matrix...",
  "Calibrating neural narrative engine...",
  "Establishing secure production uplink...",
  "Mapping world architecture nodes...",
  "Synthesizing creative protocols...",
  "Linking storyboard visual buffers...",
  "Warming up script generation nodes..."
];

export function StudioLoading({ 
  message = "Loading...", 
  fullPage = true,
  progress
}: StudioLoadingProps) {
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % BOOT_LOGS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const containerClasses = fullPage 
    ? 'fixed inset-0 z-[999] bg-[#020205] flex flex-col items-center justify-center overflow-hidden'
    : 'w-full py-20 flex flex-col items-center justify-center relative overflow-hidden';

  return (
    <div className={containerClasses}>
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] animate-pulse" />
      
      <div className="flex flex-col items-center space-y-12 relative z-10">
        {/* Core Neural Icon */}
        <div className="relative">
          <div className="w-20 h-20 border border-cyan-500/30 rounded-3xl flex items-center justify-center bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <Brain className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
          </div>
          
          <div className="absolute -inset-4 border border-dashed border-cyan-500/10 rounded-full" />
          <div className="absolute -inset-8 border border-dashed border-fuchsia-500/10 rounded-full" />
        </div>

        {/* Clean Typography */}
        <div className="text-center space-y-4">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black tracking-[0.4em] text-white uppercase"
          >
            {message}
          </motion.h3>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={logIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center justify-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              <p className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
                {BOOT_LOGS[logIndex]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-64 space-y-2">
          <div className="flex justify-between items-end px-1">
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" /> System Health: Nominal
            </span>
            {typeof progress === 'number' && (
              <span className="text-[10px] font-black text-cyan-500 tracking-widest">{progress}%</span>
            )}
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: typeof progress === 'number' ? `${progress}%` : "100%" }}
              transition={{ 
                duration: typeof progress === 'number' ? 0.3 : 2, 
                repeat: typeof progress === 'number' ? 0 : Infinity,
                ease: "easeInOut"
              }}
              className="h-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-10 left-10 opacity-20"><Zap className="w-4 h-4 text-cyan-500" /></div>
      <div className="absolute bottom-10 right-10 opacity-20"><Cpu className="w-4 h-4 text-fuchsia-500" /></div>
    </div>
  );
}


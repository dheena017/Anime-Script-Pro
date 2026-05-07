import React, { useState } from 'react';
import { useDiagnostic } from '../context/DiagnosticCommandCenter';
import { motion, AnimatePresence } from 'framer-motion';

export const StudioDiagnosticHUD: React.FC = () => {
  const { modules, systemIntegrity } = useDiagnostic();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-full border backdrop-blur-xl flex items-center gap-3 transition-all duration-300 ${
          isOpen 
            ? 'bg-studio/20 border-studio text-studio shadow-[0_0_20px_rgba(var(--studio-rgb),0.3)]' 
            : 'bg-black/80 border-white/10 text-zinc-400 hover:border-studio/50 hover:text-white'
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${systemIntegrity > 80 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'} shadow-[0_0_8px_currentColor]`} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Integrity: {systemIntegrity}%</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 bg-[#050505]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-studio to-transparent" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Command Center Diagnostics</h3>
              <span className="text-[9px] text-zinc-500">v2.4.0</span>
            </div>

            <div className="space-y-4">
              {Object.values(modules).map((module) => (
                <div key={module.id} className="group flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-300 group-hover:text-studio transition-colors">{module.name}</span>
                    <span className="text-[8px] text-zinc-600 uppercase tracking-wider">{module.version}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {module.loadTime > 0 && (
                      <span className="text-[8px] text-zinc-500">{module.loadTime}ms</span>
                    )}
                    <div className={`text-[8px] px-2 py-0.5 rounded-full border uppercase font-black tracking-tighter ${
                      module.status === 'healthy' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                      module.status === 'syncing' ? 'border-studio/20 text-studio bg-studio/5 animate-pulse' :
                      module.status === 'error' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                      'border-zinc-800 text-zinc-600'
                    }`}>
                      {module.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Neural Link</span>
                <span className="text-[9px] text-emerald-500 font-black">ENCRYPTED_STABLE</span>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="text-[9px] text-zinc-400 hover:text-white transition-colors underline decoration-zinc-800 underline-offset-4"
              >
                FORCED_REBOOT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

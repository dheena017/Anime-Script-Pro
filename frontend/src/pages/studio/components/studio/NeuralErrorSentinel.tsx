import { useEffect, useState } from 'react';
import { X, ShieldAlert, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signalBus } from '@/lib/api-utils';

export function NeuralErrorSentinel() {
  const [activeError, setActiveError] = useState<{ message: string, signalId: string, status: number } | null>(null);

  useEffect(() => {
    const handleSignal = (e: any) => {
      const { status, signalId } = e.detail;
      if (status >= 400) {
        // Find a more descriptive message if possible
        const message = status === 404 ? "Target Resource Not Found" :
          status === 401 ? "Authentication Required" :
            status === 422 ? "Invalid Data Format" :
              "Unexpected System Error";

        setActiveError({ message, signalId, status });

        // Auto-clear after 8 seconds
        setTimeout(() => {
          setActiveError(prev => prev?.signalId === signalId ? null : prev);
        }, 8080);
      }
    };

    signalBus.addEventListener('neural_signal', handleSignal);
    return () => signalBus.removeEventListener('neural_signal', handleSignal);
  }, []);

  return (
    <div className="fixed top-20 right-6 z-[9999] pointer-events-none">
      <AnimatePresence>
        {activeError && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="w-80 bg-red-950/40 backdrop-blur-md border border-red-500/30 rounded-2xl p-5 shadow-[0_0_40px_rgba(239,68,68,0.2)] pointer-events-auto overflow-hidden group"
          >


            <div className="relative z-10 flex items-start gap-4">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Error Encountered</h3>
                  <button onClick={() => setActiveError(null)} className="text-red-500/50 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs font-bold text-white uppercase tracking-tight">{activeError.message}</p>

                <div className="flex items-center gap-2 pt-2">
                  <div className="px-2 py-0.5 bg-black/40 rounded border border-red-500/20">
                    <span className="text-[8px] font-mono text-red-400 uppercase tracking-tighter">Event: {activeError.signalId}</span>
                  </div>
                  <div className="px-2 py-0.5 bg-black/40 rounded border border-red-500/20">
                    <span className="text-[8px] font-mono text-red-400 uppercase tracking-tighter">Code: {activeError.status}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 mt-4 text-[9px] font-black text-red-500/80 uppercase tracking-widest hover:text-red-400 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Restart System
                </button>
              </div>
            </div>


          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




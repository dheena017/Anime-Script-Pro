import { useEffect, useState } from 'react';
import { AI_EVENTS, AIMetadata } from '@/services/prompts/core';
import { Zap, AlertCircle, Loader2, CheckCircle2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AITelemetryOverlay() {
  const [activeMetadata, setActiveMetadata] = useState<AIMetadata | null>(null);
  const [fallbackEvent, setFallbackEvent] = useState<{ failedModel: string, error: string, nextModel: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsGenerating(true);
      setActiveMetadata(null);
      setFallbackEvent(null);
    };

    const handleComplete = (e: any) => {
      setIsGenerating(false);
      setActiveMetadata(e.detail);
      setTimeout(() => setActiveMetadata(prev => prev === e.detail ? null : prev), 5000);
    };

    const handleFallback = (e: any) => {
      setFallbackEvent(e.detail);
      setTimeout(() => setFallbackEvent(null), 4000);
    };

    AI_EVENTS.addEventListener('ai_generation_start', handleStart);
    AI_EVENTS.addEventListener('ai_generation_complete', handleComplete);
    AI_EVENTS.addEventListener('ai_fallback', handleFallback);

    return () => {
      AI_EVENTS.removeEventListener('ai_generation_start', handleStart);
      AI_EVENTS.removeEventListener('ai_generation_complete', handleComplete);
      AI_EVENTS.removeEventListener('ai_fallback', handleFallback);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            key="status-generating"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-3 px-4 py-2.5 bg-studio/10 backdrop-blur-md border border-studio/20 rounded-2xl"
          >
            <Loader2 className="w-3.5 h-3.5 text-studio animate-spin" />
            <span className="text-xs font-black text-studio uppercase tracking-widest">Generating Content...</span>
          </motion.div>
        )}

        {fallbackEvent && (
          <motion.div 
            key={`fallback-${fallbackEvent.failedModel}-${Date.now()}`}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="flex items-center gap-3 px-4 py-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl shadow-2xl"
          >
            <div className="p-1.5 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Model Switch</p>
              <p className="text-xs font-bold text-red-200/70 uppercase">
                {fallbackEvent.failedModel} error. Retrying with {fallbackEvent.nextModel}...
              </p>
            </div>
          </motion.div>
        )}

        {activeMetadata && (
          <motion.div 
            key="status-complete"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex items-center gap-4 px-5 py-3 bg-black/80 backdrop-blur-md border border-studio/30 rounded-2xl shadow-[0_0_50px_rgba(192,38,211,0.2)]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-studio/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-studio" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest">Generation Ready</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-yellow-500" />
                    {(activeMetadata.latency / 1000).toFixed(2)}s
                  </span>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1">
                    <History className="w-2.5 h-2.5 text-studio" />
                    {activeMetadata.model}
                  </span>
                </div>
              </div>
            </div>
            
            {activeMetadata.fallbacks.length > 0 && (
              <div className="pl-4 border-l border-zinc-800 flex flex-col gap-1">
                <p className="text-xs font-black text-zinc-600 uppercase tracking-widest italic">Fallbacks used: {activeMetadata.fallbacks.length}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




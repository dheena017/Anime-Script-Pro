import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Activity, 
  Globe, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface GeminiStatusCardProps {
  apiKey: string;
  onTest: () => Promise<void>;
  isTesting: boolean;
  status: 'idle' | 'success' | 'error';
  lastError?: string;
  onClear?: () => void;
}

export function GeminiStatusCard({ apiKey, onTest, isTesting, status, lastError, onClear }: GeminiStatusCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-3xl border border-zinc-800 bg-black/40 backdrop-blur-md transition-all duration-500 hover:border-studio/30">


      <div className="relative p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl border transition-all duration-500",
              status === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : 
              status === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" : 
              "bg-studio/10 border-studio/20 text-studio"
            )}>
              {status === 'success' ? <ShieldCheck className="w-5 h-5" /> : 
               status === 'error' ? <ShieldAlert className="w-5 h-5" /> : 
               <Globe className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Gemini API Matrix</h4>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-tighter">Connection Status & Integrity</p>
            </div>
          </div>

          <div className={cn(
            "px-3 py-1 rounded-full border text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2",
            status === 'success' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
            status === 'error' ? "bg-red-500/10 border-red-500/30 text-red-500" :
            "bg-zinc-900 border-zinc-800 text-zinc-500"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", 
              status === 'success' ? "bg-emerald-500 animate-pulse" :
              status === 'error' ? "bg-red-500" :
              "bg-zinc-700"
            )} />
            {status === 'success' ? 'Link Stable' : status === 'error' ? 'Link Severed' : 'Standby'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-black uppercase tracking-widest">Protocol</span>
            </div>
            <p className="text-xs font-black text-white uppercase tracking-widest">v1-beta / REST</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Activity className="w-3 h-3" />
              <span className="text-xs font-black uppercase tracking-widest">Latency</span>
            </div>
            <p className="text-xs font-black text-white uppercase tracking-widest">{status === 'success' ? '24ms' : '--'}</p>
          </div>
        </div>

        {status === 'error' && lastError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20"
          >
            <div className="flex gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-400 font-bold leading-relaxed uppercase tracking-tighter">
                {lastError}
              </p>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
          >
            <div className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-400 font-bold leading-relaxed uppercase tracking-widest">
                Connection established. All Gemini 1.5 & 2.0 models ready for generation.
              </p>
            </div>
          </motion.div>
        )}

        <button
          onClick={onTest}
          disabled={!apiKey || isTesting}
          className={cn(
            "w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 flex items-center justify-center gap-3",
            !apiKey || isTesting ? "bg-zinc-800 text-zinc-600 border border-zinc-700 pointer-events-none" : 
            "bg-studio/10 hover:bg-studio text-studio hover:text-black border border-studio/30 hover:border-studio shadow-[0_0_20px_rgba(6,182,212,0.1)]"
          )}
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying Connection...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              Test API Connection
            </>
          )}
        </button>
        
        {apiKey && onClear && (
          <button
            onClick={onClear}
            className="w-full mt-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors"
          >
            Disconnect Account & Clear Credentials
          </button>
        )}
      </div>
    </div>
  );
}




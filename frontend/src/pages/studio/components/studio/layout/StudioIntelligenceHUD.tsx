import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useMemo, useState } from 'react';
import { 
  Globe, Users, ChevronLeft, Database, Activity, Zap, Cloud, Terminal, 
  Server, HardDrive, Radio, Radar, Film, Sparkles, MessageSquare, ShieldAlert,
  Clock, ShieldCheck, Settings2
} from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useLogs } from '@/contexts/LogContext';
import { cn } from '@/lib/utils';

export function StudioIntelligenceHUD() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    isIntelligenceOpen: isOpen,
    generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems,
    castList, generatedSeriesPlan, generatedScript, prompt, selectedModel,
    isGeneratingWorld, isGeneratingCharacters, isGeneratingSeries,
    worldGenerationLatency, temperature, maxTokens, topP, isSaving
  } = useGeneratorState();

  const { syncCore, saveLocalSession, setIsIntelligenceOpen } = useGeneratorDispatch();
  const { masterLogs } = useLogs();

  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsIntelligenceOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsIntelligenceOpen]);

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate real context buffer size based on actual string lengths of state values
  const contextBufferSize = useMemo(() => {
    const blobs = [
      generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions,
      generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems,
      generatedScript, JSON.stringify(castList), JSON.stringify(generatedSeriesPlan)
    ];
    const totalBytes = blobs.reduce((acc, b) => acc + (b?.length || 0), 0);
    return (totalBytes / 1024).toFixed(1);
  }, [
    generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions,
    generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems,
    generatedScript, castList, generatedSeriesPlan
  ]);

  const moduleMatrix = [
    { label: 'World Lore', icon: Globe, status: isGeneratingWorld ? 'warning' : (generatedWorld ? 'success' : 'info') },
    { label: 'Cast DNA', icon: Users, status: isGeneratingCharacters ? 'warning' : (castList?.length ? 'success' : 'info') },
    { label: 'Series Plan', icon: Database, status: isGeneratingSeries ? 'warning' : (generatedSeriesPlan?.length ? 'success' : 'info') },
    { label: 'Script Sync', icon: MessageSquare, status: generatedScript ? 'success' : 'info' },
    { label: 'Storyboard', icon: Film, status: 'info' },
    { label: 'VFX & Audio', icon: Sparkles, status: 'info' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsIntelligenceOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md z-[90]"
          />

          <motion.div
            ref={containerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-[500px] bg-black/95 backdrop-blur-3xl border-l border-white/10 shadow-[-60px_0_120px_rgba(0,0,0,0.95)] flex flex-col z-[100] overflow-hidden"
          >
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />
            <div className="absolute right-0 top-0 w-[3px] h-full bg-gradient-to-b from-transparent via-studio/40 to-transparent animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.5)]" />

            {/* Header */}
            <div className="p-8 border-b border-white/5 flex flex-col gap-6 relative z-10 shrink-0 bg-black/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <div className="w-14 h-14 rounded-2xl bg-studio/10 border border-studio/40 flex items-center justify-center relative z-10 overflow-hidden shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
                      <Radar className="w-7 h-7 text-studio animate-spin-slow opacity-90" />
                    </div>
                    <div className="absolute -inset-2 bg-studio/20 blur-xl rounded-2xl animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[16px] font-black uppercase tracking-[0.5em] text-white text-shadow-glow">System Nexus</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-studio animate-ping shadow-[0_0_12px_rgba(6,182,212,1)]" />
                        <p className="text-[10px] font-bold text-studio uppercase tracking-[0.3em]">Live Feed</p>
                      </div>
                      <div className="w-px h-3 bg-white/20" />
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-[11px] font-mono text-zinc-400">{formatUptime(uptime)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsIntelligenceOpen(false)}
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/10 hover:border-white/20 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 rotate-180" />
                </button>
              </div>

              {/* Security Level (Purely visual header) */}
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500 flex-1">Connection Secured</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/50">Encrypted</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide relative z-10">
              
              {/* Telemetry Actions (Real Functional Buttons) */}
              <div className="grid grid-cols-2 gap-4 relative z-30">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); syncCore(); }}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-studio/15 border border-studio/40 hover:bg-studio/25 transition-all group/btn disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.2)] relative z-40 overflow-hidden"
                >
                  <Server className="w-4 h-4 text-studio group-hover:rotate-12 transition-transform relative z-10" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white relative z-10 drop-shadow-md">
                    {isSaving ? 'Syncing...' : 'Manual Sync'}
                  </span>
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); saveLocalSession(); }}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/btn active:scale-95 cursor-pointer relative z-40"
                >
                  <HardDrive className="w-4 h-4 text-zinc-300 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Force Save</span>
                </button>
              </div>

              {/* Core Directive (Real Prompt State) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-studio" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Core Directive</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 relative group/prompt overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-studio shadow-[0_0_10px_rgba(6,182,212,1)]" />
                  <p className="text-[11px] text-zinc-300 leading-relaxed italic line-clamp-4 pl-3">
                    {prompt || "System idle. Awaiting creative override instructions..."}
                  </p>
                </div>
              </div>

              {/* Real API Parameters */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">LLM Parameters</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'TEMP', value: temperature },
                    { label: 'TOKENS', value: maxTokens },
                    { label: 'TOP P', value: topP }
                  ].map((param, i) => (
                    <div key={i} className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col items-center gap-1">
                      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{param.label}</span>
                      <span className="text-[11px] font-black text-white">{param.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Hardware & Context Monitoring */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-zinc-500" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Resource Matrix</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Context Buffer</span>
                      <Cloud className="w-3.5 h-3.5 text-studio" />
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-white leading-none">{contextBufferSize}</span>
                      <span className="text-[10px] font-bold text-zinc-500 mb-1">KB</span>
                    </div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        animate={{ width: `${Math.min(100, (parseFloat(contextBufferSize) / 200) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-studio/50 to-studio rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                      />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">API Latency</span>
                      <Radio className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-white leading-none">{worldGenerationLatency}</span>
                      <span className="text-[10px] font-bold text-zinc-500 mb-1">MS</span>
                    </div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        animate={{ width: `${Math.min(100, (worldGenerationLatency / 1000) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-amber-500/50 to-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Module Integration Statuses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">Module Uplinks</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {moduleMatrix.map((mod, i) => (
                    <div key={i} className={cn(
                      "p-4 rounded-xl border flex items-center justify-between transition-colors shadow-sm",
                      mod.status === 'success' ? 'bg-studio/10 border-studio/40 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]' :
                      mod.status === 'warning' ? 'bg-amber-500/10 border-amber-500/40 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]' :
                      'bg-zinc-900/60 border-white/10'
                    )}>
                      <div className="flex items-center gap-3">
                        <mod.icon className={cn(
                          "w-4 h-4",
                          mod.status === 'success' ? 'text-studio' :
                          mod.status === 'warning' ? 'text-amber-500 animate-pulse' :
                          'text-zinc-600'
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{mod.label}</span>
                      </div>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        mod.status === 'success' ? 'bg-studio shadow-[0_0_10px_rgba(6,182,212,1)]' :
                        mod.status === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)] animate-ping' :
                        'bg-zinc-700'
                      )} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Live Terminal Feed (Actual System Logs) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-studio" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Master Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-studio animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <span className="text-[9px] font-bold text-studio uppercase tracking-widest">Live Trace</span>
                  </div>
                </div>
                
                <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 h-[320px] overflow-y-auto scrollbar-hide font-mono relative shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-white/10 bg-white/[0.02]" />
                  
                  <div className="space-y-5 relative z-10 pl-10">
                    {masterLogs.slice(0, 15).map((log, i) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-2 border-b border-white/5 pb-4 last:border-0 relative"
                      >
                        <div className="absolute -left-10 top-0 text-[9px] text-zinc-600 font-black">{String(i + 1).padStart(2, '0')}</div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] text-zinc-500">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border",
                              log.status === 'ERROR' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                              log.status === 'WARN' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                              'bg-studio/10 border-studio/20 text-studio'
                            )}>{log.module}</span>
                          </div>
                          {log.status === 'ERROR' && <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />}
                        </div>
                        <p className={cn(
                          "text-[11px] leading-relaxed break-words",
                          log.status === 'ERROR' ? 'text-red-400' : 'text-zinc-300'
                        )}>> {log.message || log.status}</p>
                      </motion.div>
                    ))}
                    {masterLogs.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4 mt-16">
                        <Terminal className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] italic uppercase tracking-[0.2em]">Awaiting execution trace...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 bg-studio/10 border-t border-studio/20 relative z-10 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 animate-pulse" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-studio animate-pulse shadow-[0_0_15px_rgba(6,182,212,1)]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-studio">Active Node: {selectedModel}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
}

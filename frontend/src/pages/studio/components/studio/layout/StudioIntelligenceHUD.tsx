import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useMemo, useState } from 'react';
import { 
  Globe, Users, ChevronLeft, Database, Activity, Zap, Cloud, Terminal, 
  Server, HardDrive, Radio, Radar, Film, Sparkles, MessageSquare, ShieldAlert,
  Clock, ShieldCheck, Settings2, Palette, AlertTriangle, Layers, Type, Film as FilmIcon, Eye,
  FolderOpen, Hash, BarChart3, Presentation, PenTool, Image as ImageIcon, AlignLeft, RefreshCw,
  FileText,
  Network, CheckCircle2, Video,
  BrainCircuit
} from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useLogs } from '@/contexts/LogContext';
import { cn } from '@/lib/utils';

export function StudioIntelligenceHUD() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    isIntelligenceOpen: isOpen,
    generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions, generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems,
    characterList, generatedSeriesPlan, generatedScript, prompt, selectedModel,
    isGeneratingWorld, isGeneratingCharacters, isGeneratingSeries,
    worldGenerationLatency, temperature, maxTokens, topP, topK, isSaving,
    activeModelAttempt, fallbackHistory, tone, audience, genre, artStyle,
    isGeneratingLore, isGeneratingPowers, isGeneratingFactions, isGeneratingArchitecture, isGeneratingAtlas, isGeneratingCulture, isGeneratingSystems,
    storyboardScenes, visualData, videoData,
    episode, session, numScenes, numCharacters, numEpisodes, contentType,
    isGeneratingGrowthStrategy, isGeneratingDistribution, seoMetadata, generatedGrowthStrategy, generatedDistributionPlan,
    history,
    isContinuingScript, isGeneratingMetadata, isGeneratingImagePrompts, isGeneratingAltText,
    characterDNA, characterDynamics, characterIntegrity, characterRelationships, isAnalyzingCharacters,
    worldGenerationStatus, worldGenerationError
  } = useGeneratorState();

  const { syncCore, saveLocalSession, setIsIntelligenceOpen } = useGeneratorDispatch();
  const { masterLogs, dbLogs, clearLogs } = useLogs();

  const [activeTerminalTab, setActiveTerminalTab] = useState<'system' | 'intelligence'>('system');
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
      generatedScript, JSON.stringify(characterList), JSON.stringify(generatedSeriesPlan)
    ];
    const totalBytes = blobs.reduce((acc, b) => acc + (b?.length || 0), 0);
    return (totalBytes / 1024).toFixed(1);
  }, [
    generatedWorld, generatedWorldLore, generatedWorldPowers, generatedWorldFactions,
    generatedWorldArchitecture, generatedWorldAtlas, generatedWorldCulture, generatedWorldSystems,
    generatedScript, characterList, generatedSeriesPlan
  ]);

  const tokenLoadEstimate = useMemo(() => {
    const bytes = parseFloat(contextBufferSize) * 1024;
    return Math.floor(bytes / 4).toLocaleString();
  }, [contextBufferSize]);

  const moduleMatrix = [
    { label: 'World Lore', icon: Globe, status: isGeneratingWorld ? 'warning' : (generatedWorld ? 'success' : 'info') },
    { label: 'Cast DNA', icon: Users, status: isGeneratingCharacters ? 'warning' : (characterList?.length ? 'success' : 'info') },
    { label: 'Series Plan', icon: Database, status: isGeneratingSeries ? 'warning' : (generatedSeriesPlan?.length ? 'success' : 'info') },
    { label: 'Script Sync', icon: MessageSquare, status: generatedScript ? 'success' : 'info' },
    { label: 'Storyboard', icon: Film, status: (storyboardScenes && storyboardScenes.length > 0) ? 'success' : 'info' },
    { label: 'VFX & Audio', icon: Sparkles, status: (generatedSeriesPlan && Array.isArray(generatedSeriesPlan) && generatedSeriesPlan.some((ep: any) => ep.detailed_episode_spec && Array.isArray(ep.detailed_episode_spec.acts) && ep.detailed_episode_spec.acts.some((act: any) => Array.isArray(act.scenes) && act.scenes.some((s: any) => s.production_stats?.vfx_heavy)))) ? 'success' : 'info' },
  ];

  const synthesisThreads = [
    { label: 'Lore Manifest', active: isGeneratingLore },
    { label: 'Power Systems', active: isGeneratingPowers },
    { label: 'Factions', active: isGeneratingFactions },
    { label: 'Architecture', active: isGeneratingArchitecture },
    { label: 'Atlas/Geography', active: isGeneratingAtlas },
    { label: 'Culture/Society', active: isGeneratingCulture },
    { label: 'Magic/Tech', active: isGeneratingSystems },
  ];

  const scriptAugmentationThreads = [
    { label: 'Continuity Editor', icon: PenTool, active: isContinuingScript },
    { label: 'Scene Metadata', icon: AlignLeft, active: isGeneratingMetadata },
    { label: 'Image Prompts', icon: ImageIcon, active: isGeneratingImagePrompts },
    { label: 'Alt-Text VQA', icon: Eye, active: isGeneratingAltText },
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
            className="absolute inset-0 bg-black/70 backdrop-blur-md z-[390]"
          />

          <motion.div
            ref={containerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-[500px] bg-black/95 backdrop-blur-3xl border-l border-white/10 shadow-[-60px_0_120px_rgba(0,0,0,0.95)] flex flex-col z-[400] overflow-hidden"
          >
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noiseFilter%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.65%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-40 mix-blend-overlay pointer-events-none" />
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
                    <h3 className="text-[16px] font-black uppercase tracking-[0.5em] text-white text-shadow-glow">Aetheria Nexus v2.{generatedSeriesPlan?.length || 0}.{characterList?.length || 0}</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-studio animate-ping shadow-[0_0_12px_rgba(6,182,212,1)]" />
                        <p className="text-xs font-bold text-studio uppercase tracking-[0.3em]">Live Feed</p>
                      </div>
                      <div className="w-px h-3 bg-white/20" />
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-xs font-mono text-zinc-400">{formatUptime(uptime)}</span>
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
                <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 flex-1">Connection Secured</span>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-500/50">Encrypted</span>
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
                  <span className="text-xs font-black uppercase tracking-widest text-white relative z-10 drop-shadow-md">
                    {isSaving ? 'Syncing...' : 'Manual Sync'}
                  </span>
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); saveLocalSession(); }}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/btn active:scale-95 cursor-pointer relative z-40"
                >
                  <HardDrive className="w-4 h-4 text-zinc-300 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Force Save</span>
                </button>
              </div>

              {/* System Health Status (Real Status) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">System Core Health</span>
                </div>
                {worldGenerationStatus === 'error' || worldGenerationError ? (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-red-500">
                      <ShieldAlert className="w-4 h-4 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest">Neural Failure Detected</span>
                    </div>
                    <p className="text-xs text-red-400/80 font-mono">{worldGenerationError || 'Unknown exception in Neural Core.'}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Neural Core Stable</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  </div>
                )}
              </div>

              {/* Production Scaffolding (Real Production Constraints) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Production Scaffolding</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="p-3 rounded-lg bg-zinc-900/40 border border-white/5 flex flex-col gap-1 items-center justify-center">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Sessions</span>
                    <span className="text-[10px] font-black text-white">{(session && session !== '') ? session : '0'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/40 border border-white/5 flex flex-col gap-1 items-center justify-center">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Episodes</span>
                    <span className="text-[10px] font-black text-white">{(numEpisodes || numEpisodes === 0) ? String(numEpisodes) : '0'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/40 border border-white/5 flex flex-col gap-1 items-center justify-center">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Scenes/Ep</span>
                    <span className="text-[10px] font-black text-white">{(numScenes && numScenes !== '') ? numScenes : '0'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/40 border border-white/5 flex flex-col gap-1 items-center justify-center">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Cast Target</span>
                    <span className="text-[10px] font-black text-white">{(numCharacters || numCharacters === 0) ? String(numCharacters) : '0'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/40 border border-white/5 flex flex-col gap-1 items-center justify-center">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Type</span>
                    <span className="text-[10px] font-black text-white truncate max-w-full uppercase">{contentType ? String(contentType).toUpperCase() : '0'}</span>
                  </div>
                </div>
              </div>

              {/* AETHERIA CORE SYNC (Real Module Status) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-studio" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Aetheria Core Sync</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Manifest', active: !!generatedWorld },
                    { label: 'History', active: !!generatedWorldLore },
                    { label: 'Powers', active: !!generatedWorldPowers },
                    { label: 'Factions', active: !!generatedWorldFactions },
                    { label: 'Atlas', active: !!generatedWorldAtlas },
                    { label: 'Systems', active: !!generatedWorldSystems }
                  ].map((module, i) => (
                    <div key={i} className={cn(
                      "p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all",
                      module.active ? "bg-studio/10 border-studio/30" : "bg-black border-white/5 opacity-40"
                    )}>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", module.active ? "text-studio" : "text-zinc-600")}>{module.label}</span>
                      <span className={cn("text-[8px] font-mono", module.active ? "text-white" : "text-zinc-800")}>{module.active ? 'READY' : 'EMPTY'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Directive (Real Prompt State) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-studio" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Core Directive</span>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 relative group/prompt overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-studio shadow-[0_0_10px_rgba(6,182,212,1)]" />
                  <p className="text-xs text-zinc-300 leading-relaxed italic line-clamp-4 pl-3">
                    {prompt || "System idle. Awaiting creative override instructions..."}
                  </p>
                </div>
              </div>

              {/* Real Model Failover Tracker */}
              {fallbackHistory && fallbackHistory.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">Failover Diagnostics</span>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Attempt:</span>
                      <span className="text-xs font-black text-amber-400">{activeModelAttempt || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Failover Count:</span>
                      <span className="text-xs font-black text-white">{fallbackHistory.length}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Real API Settings & Engine Metaparameters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Engine Metaparameters</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'META_TEMP', value: temperature?.toFixed(2) || '0.00' },
                      { label: 'META_TOKENS', value: maxTokens || '2048' },
                      { label: 'META_TOP_P', value: topP?.toFixed(2) || '0.95' },
                      { label: 'META_TOP_K', value: topK || '40' }
                    ].map((param, i) => (
                      <div key={i} className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center gap-1">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{param.label}</span>
                        <span className="text-[10px] font-black text-white font-mono">{param.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col justify-between">
                     <div className="px-3 py-2 rounded-lg bg-zinc-900/40 border border-white/5 flex items-center justify-between mb-1.5">
                       <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Palette className="w-2.5 h-2.5"/> Art</span>
                       <span className="text-xs font-black text-white uppercase tracking-widest truncate max-w-[80px]">{artStyle || 'Default'}</span>
                     </div>
                     <div className="px-3 py-2 rounded-lg bg-zinc-900/40 border border-white/5 flex items-center justify-between mb-1.5">
                       <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Type className="w-2.5 h-2.5"/> Tone</span>
                       <span className="text-xs font-black text-white uppercase tracking-widest truncate max-w-[80px]">{tone || 'Neutral'}</span>
                     </div>
                     <div className="px-3 py-2 rounded-lg bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                       <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Users className="w-2.5 h-2.5"/> Aud.</span>
                       <span className="text-xs font-black text-white uppercase tracking-widest truncate max-w-[80px]">{audience || 'General'}</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Real Cast Infrastructure Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Cast Infrastructure</span>
                  </div>
                  {isAnalyzingCharacters && <div className="w-1.5 h-1.5 rounded-full bg-studio animate-ping" />}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className={cn("px-4 py-3 rounded-xl border flex flex-col gap-1 transition-colors", characterList?.length > 0 ? "bg-studio/10 border-studio/30" : "bg-black border-white/5")}>
                     <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">DNA Registry</span>
                     <span className={cn("text-[10px] font-black uppercase tracking-widest", characterList?.length > 0 ? "text-studio" : "text-zinc-600")}>{characterList?.length > 0 ? `${characterList.length}_ENTITIES` : 'Empty'}</span>
                  </div>
                  <div className={cn("px-4 py-3 rounded-xl border flex flex-col gap-1 transition-colors", characterDNA ? "bg-studio/10 border-studio/30" : "bg-black border-white/5")}>
                     <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">DNA Profiles</span>
                     <span className={cn("text-[10px] font-black uppercase tracking-widest", characterDNA ? "text-studio" : "text-zinc-600")}>{characterDNA ? 'Materialized' : 'Empty'}</span>
                  </div>
                  <div className={cn("px-4 py-3 rounded-xl border flex flex-col gap-1 transition-colors", characterDynamics ? "bg-studio/10 border-studio/30" : "bg-black border-white/5")}>
                     <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Psych Dynamics</span>
                     <span className={cn("text-[10px] font-black uppercase tracking-widest", characterDynamics ? "text-studio" : "text-zinc-600")}>{characterDynamics ? 'Synced' : 'Empty'}</span>
                  </div>
                  <div className={cn("px-4 py-3 rounded-xl border flex flex-col gap-1 transition-colors", characterIntegrity ? "bg-studio/10 border-studio/30" : "bg-black border-white/5")}>
                     <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Lore Integrity</span>
                     <span className={cn("text-[10px] font-black uppercase tracking-widest", characterIntegrity ? "text-studio" : "text-zinc-600")}>{characterIntegrity ? 'Verified' : 'Unverified'}</span>
                  </div>
                  <div className={cn("px-4 py-3 rounded-xl border flex flex-col gap-1 transition-colors", characterRelationships && characterRelationships !== '[]' && characterRelationships !== '{}' ? "bg-studio/10 border-studio/30" : "bg-black border-white/5")}>
                     <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Social Web</span>
                     <span className={cn("text-[10px] font-black uppercase tracking-widest", (characterRelationships && characterRelationships !== '[]' && characterRelationships !== '{}') ? "text-studio" : "text-zinc-600")}>{(characterRelationships && characterRelationships !== '[]' && characterRelationships !== '{}') ? 'Mapped' : 'Empty'}</span>
                  </div>
                </div>
              </div>

              {/* Real World Engine Active Synthesis Threads */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">World Synthesis Threads</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {synthesisThreads.map((thread, i) => (
                    <div key={i} className={cn(
                      "px-3 py-2 rounded-lg border flex items-center justify-between transition-colors",
                      thread.active ? "bg-studio/10 border-studio/30 shadow-[inset_0_0_10px_rgba(6,182,212,0.15)]" : "bg-black border-white/5"
                    )}>
                      <span className={cn("text-xs font-black uppercase tracking-widest truncate", thread.active ? "text-studio" : "text-zinc-600")}>
                        {thread.label}
                      </span>
                      {thread.active ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-studio animate-ping" />
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Script Augmentation Engine */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Script Augmentation</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {scriptAugmentationThreads.map((thread, i) => (
                    <div key={i} className={cn(
                      "px-3 py-2 rounded-lg border flex items-center gap-2 transition-colors",
                      thread.active ? "bg-amber-500/10 border-amber-500/30 shadow-[inset_0_0_10px_rgba(245,158,11,0.15)]" : "bg-black border-white/5"
                    )}>
                      <thread.icon className={cn("w-3 h-3", thread.active ? "text-amber-500 animate-pulse" : "text-zinc-700")} />
                      <span className={cn("text-xs font-black uppercase tracking-widest flex-1 truncate", thread.active ? "text-amber-500" : "text-zinc-600")}>
                        {thread.label}
                      </span>
                      {thread.active && <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Post-Production & Marketing Pipeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Post-Production Pipeline</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="px-4 py-3 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Presentation className="w-3.5 h-3.5" /> Growth Strategy
                    </span>
                    <div className={cn("px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest border", 
                      isGeneratingGrowthStrategy ? "bg-studio/20 text-studio border-studio/30 animate-pulse" : 
                      generatedGrowthStrategy ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : "bg-zinc-800 text-zinc-500 border-transparent"
                    )}>
                      {isGeneratingGrowthStrategy ? 'Synthesizing...' : generatedGrowthStrategy ? 'Ready' : 'Pending'}
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Distribution Plan
                    </span>
                    <div className={cn("px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest border", 
                      isGeneratingDistribution ? "bg-studio/20 text-studio border-studio/30 animate-pulse" : 
                      generatedDistributionPlan ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : "bg-zinc-800 text-zinc-500 border-transparent"
                    )}>
                      {isGeneratingDistribution ? 'Synthesizing...' : generatedDistributionPlan ? 'Ready' : 'Pending'}
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5" /> SEO Metadata
                    </span>
                    <div className={cn("px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest border", 
                      seoMetadata ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : "bg-zinc-800 text-zinc-500 border-transparent"
                    )}>
                      {seoMetadata ? 'Optimized' : 'Missing'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Storyboard/Visual Matrix */}
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <FilmIcon className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Storyboard Matrix</span>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-zinc-900/30 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-zinc-600" />
                        <div className="flex flex-col gap-0.5">
                           <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Generated Scenes</span>
                           <span className="text-xl font-black text-white">{storyboardScenes?.length || 0}</span>
                        </div>
                     </div>
                     <div className="w-px h-10 bg-white/10" />
                     <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-zinc-600" />
                        <div className="flex flex-col gap-0.5">
                           <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Visual Assets</span>
                           <span className="text-xl font-black text-white">{visualData?.length || 0}</span>
                        </div>
                     </div>
                     <div className="w-px h-10 bg-white/10" />
                     <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-zinc-600" />
                        <div className="flex flex-col gap-0.5">
                           <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Video Assets</span>
                           <span className="text-xl font-black text-white">{videoData?.length || 0}</span>
                        </div>
                     </div>
                  </div>
              </div>

              {/* Real Hardware & Context Monitoring */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Resource Matrix</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 text-zinc-600" />
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">State Mutations: {history?.length || 0}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 p-5 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center justify-between shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Estimated Token Load</span>
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-studio" />
                        <span className="text-2xl font-black text-white">{tokenLoadEstimate}</span>
                      </div>
                    </div>
                    <div className="w-32 h-2 bg-black rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        animate={{ width: `${Math.min(100, (parseFloat(contextBufferSize) / 200) * 100)}%` }}
                        className="h-full bg-gradient-to-r from-studio/50 to-studio rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                      />
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Raw Buffer</span>
                      <Database className="w-3.5 h-3.5 text-studio" />
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-white leading-none">{contextBufferSize}</span>
                      <span className="text-xs font-bold text-zinc-500 mb-1">KB</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-500">API Latency</span>
                      <Radio className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-white leading-none">{worldGenerationLatency}</span>
                      <span className="text-xs font-bold text-zinc-500 mb-1">MS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Production Dashboard (Real Aggregate Data) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Production Dashboard</p>
                    <div className="h-0.5 w-12 bg-studio/30 rounded-full" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Aggregate Neural Data</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { 
                      label: 'Runtime', 
                      val: generatedSeriesPlan?.length ? `${generatedSeriesPlan.reduce((acc: any, ep: any) => acc + (parseInt(ep.runtime) || 24), 0)}m` : '0m', 
                      icon: Clock, 
                      color: 'text-studio', 
                      sub: 'Total Duration' 
                    },
                    { 
                      label: 'Scenes', 
                      val: generatedSeriesPlan?.reduce((acc: any, ep: any) => acc + (ep.asset_matrix?.scene_count || 0), 0) || 0, 
                      icon: Database, 
                      color: 'text-amber-500', 
                      sub: 'Matrix Units' 
                    },
                    { 
                      label: 'VFX Load', 
                      val: generatedSeriesPlan?.reduce((acc: any, ep: any) => acc + (ep.detailed_episode_spec?.acts?.reduce((a: any, act: any) => a + (act.scenes?.filter((s: any) => s.production_stats?.vfx_heavy)?.length || 0), 0) || 0), 0) || 0, 
                      icon: Sparkles, 
                      color: 'text-rose-500', 
                      sub: 'Heavy Assets' 
                    },
                    { 
                      label: 'Consistency', 
                      val: generatedSeriesPlan?.length ? (generatedSeriesPlan.every((ep: any) => ep.neural_audit?.logic_check?.toLowerCase().includes('pass') || ep.neural_audit?.lore_validation?.toLowerCase().includes('confirm')) ? 'PASS' : 'AUDIT') : 'WAIT', 
                      icon: BrainCircuit, 
                      color: 'text-cyan-500', 
                      sub: 'Neural Logic' 
                    },
                  ].map((stat, i) => (
                    <div key={i} className="p-5 bg-zinc-900/40 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-2 group transition-all duration-500 hover:border-studio/30 hover:bg-studio/[0.02] relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-studio/10 transition-colors duration-500" />
                      <stat.icon className={cn("w-5 h-5 mb-1 opacity-40 group-hover:opacity-100 transition-opacity duration-500", stat.color)} />
                      <div className="space-y-1 text-center relative z-10">
                        <p className="text-[14px] font-black text-white font-mono leading-none tracking-tighter uppercase">{stat.val}</p>
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none group-hover:text-zinc-400 transition-colors">{stat.label}</p>
                        <div className="h-[1px] w-4 bg-zinc-800 mx-auto mt-2 group-hover:bg-studio/40 transition-colors" />
                        <p className="text-[7px] text-zinc-700 font-mono uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{stat.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Module Integration Statuses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Module Uplinks</span>
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
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-300">{mod.label}</span>
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
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Master Telemetry</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center p-1 rounded-lg bg-white/5 border border-white/10">
                      <button 
                        onClick={() => setActiveTerminalTab('system')}
                        className={cn(
                          "px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all",
                          activeTerminalTab === 'system' ? "bg-studio text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        System
                      </button>
                      <button 
                        onClick={() => setActiveTerminalTab('intelligence')}
                        className={cn(
                          "px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all",
                          activeTerminalTab === 'intelligence' ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        Intelligence
                      </button>
                    </div>
                    <button 
                      onClick={clearLogs}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-zinc-600 hover:text-red-500 transition-all"
                      title="Clear Logs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-studio animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      <span className="text-xs font-bold text-studio uppercase tracking-widest">Live Trace</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 h-[320px] overflow-y-auto scrollbar-hide font-mono relative shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-white/10 bg-white/[0.02]" />
                  
                  <div className="space-y-5 relative z-10 pl-10">
                    {(activeTerminalTab === 'system' ? masterLogs : dbLogs).slice(0, 30).map((log, i) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-2 border-b border-white/5 pb-4 last:border-0 relative"
                      >
                        <div className="absolute -left-10 top-0 text-xs text-zinc-600 font-black">{String(i + 1).padStart(2, '0')}</div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-500">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                            <span className={cn(
                              "text-xs font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border",
                              log.status === 'ERROR' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                              log.status === 'WARN' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                              activeTerminalTab === 'intelligence' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                              'bg-studio/10 border-studio/20 text-studio'
                            )}>{log.module}</span>
                          </div>
                          {log.status === 'ERROR' && <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />}
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className={cn(
                            "text-xs leading-relaxed break-words",
                            log.status === 'ERROR' ? 'text-red-400' : 'text-zinc-300'
                          )}> {log.message || log.status}</p>
                          {(log as any).latency && (
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-zinc-600" />
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Execution Time: {(log as any).latency}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {(activeTerminalTab === 'system' ? masterLogs : dbLogs).length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4 mt-16">
                        <Terminal className="w-8 h-8 opacity-20" />
                        <span className="text-xs italic uppercase tracking-[0.2em]">Awaiting execution trace...</span>
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
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-studio">Active Node: {selectedModel}</span>
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


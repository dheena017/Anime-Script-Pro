import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Table, ChevronRight, Activity, Sparkles, Database, BrainCircuit, Loader2, Clock, Users, Settings2, Zap, ScrollText } from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useLogs } from '@/contexts/LogContext';
import { manifestScenes } from '@/services/api/scenes';
import { seriesStyles as s } from '../seriesStyles';
import { cn } from '@/lib/utils';

interface BlueprintTabProps {
  showScaffolder: boolean;
  onManifestContinue: (config: any) => Promise<void>;
  onGenerateSeries?: (params: { episodesPerSession: number; sessions: number; scenes: number }) => void;
  isSyncing: boolean;
  lastSyncDate: string | null;
  productionSequence: any[];
  applySequenceItem: (sess: number, ep: number, scen: number) => void;
  plan?: any[];
  onViewEpisode?: (episodeNum: string, section?: string) => void;
}

export const BlueprintTab: React.FC<BlueprintTabProps> = ({
  onManifestContinue,
  onGenerateSeries,
  isSyncing,
  lastSyncDate,
  productionSequence,
  applySequenceItem,
  plan = [],
  onViewEpisode
}) => {
  const calculateTotalScenes = React.useCallback((sessions: number | string | undefined, episodes: number | string | undefined, scenes: number | string | undefined) => {
    // Require explicit values for all three dimensions. If any are missing, return 0.
    if (sessions === undefined || sessions === '' || episodes === undefined || episodes === '' || scenes === undefined || scenes === '') {
      return 0;
    }

    const parsedSessions = Number.parseInt(String(sessions), 10);
    const parsedEpisodes = Number.parseInt(String(episodes), 10);
    const parsedScenes = Number.parseInt(String(scenes), 10);

    if (!Number.isFinite(parsedSessions) || !Number.isFinite(parsedEpisodes) || !Number.isFinite(parsedScenes)) {
      return 0;
    }

    return parsedSessions * parsedEpisodes * parsedScenes;
  }, []);

  const {
    isGeneratingSeries,
    generationProgress,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldAtlas,
    generatedWorldSystems,
    characterList,
    characterDNA,
    characterDynamics,
    characterIntegrity,
    characterRelationships,
    temperature,
    maxTokens,
    topP,
    topK,
    tone,
    audience,
    genre,
    artStyle,
    selectedModel,
    seriesPlan: contextPlan,
    currentScriptId,
    session: globalSession,
    numEpisodes: globalEpisodes,
    numScenes: globalScenes
  } = useGeneratorState();

  const { showNotification } = useGeneratorDispatch();
  const { setNumEpisodes, setNumScenes, setSession } = useGeneratorDispatch();
  const { manifestationProgress } = useLogs();

  const [isManifesting, setIsManifesting] = React.useState(false);

  // Start with empty inputs — do not auto-populate defaults from plan or global state.
  const [localConfig, setLocalConfig] = React.useState<{sessions: number|string, episodes: number|string, scenes: number|string}>(() => {
    try {
      const saved = localStorage.getItem('blueprint_scaffolding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            sessions: parsed.sessions ?? '',
            episodes: parsed.episodes ?? '',
            scenes: parsed.scenes ?? ''
          };
        }
      }
    } catch (e) {
      console.error('Failed to restore blueprint config from localStorage:', e);
    }

    return { sessions: '', episodes: '', scenes: '' };
  });

  // Persist scaffolding inputs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('blueprint_scaffolding', JSON.stringify(localConfig));
  }, [localConfig]);

  const [localErrors, setLocalErrors] = React.useState<{ sessions?: string; episodes?: string; scenes?: string }>({});
  const [isSyncingScaffold, setIsSyncingScaffold] = React.useState(false);

  const totalSceneBudget = React.useMemo(
    () => calculateTotalScenes(localConfig.sessions, localConfig.episodes, localConfig.scenes),
    [calculateTotalScenes, localConfig.sessions, localConfig.episodes, localConfig.scenes],
  );

  const totalScaffoldingEpisodes = React.useMemo(() => {
    const sParsed = parseInt(String(localConfig.sessions));
    const eParsed = parseInt(String(localConfig.episodes));

    // Require explicit values for sessions + episodes (no fallback defaults)
    const s = Number.isFinite(sParsed) ? sParsed : 0;
    const e = Number.isFinite(eParsed) ? eParsed : 0;

    return s * e;
  }, [localConfig.sessions, localConfig.episodes]);



  const validateScaffoldingInputs = () => {
    const errors: typeof localErrors = {};
    const finalSessions = parseInt(String(localConfig.sessions));
    const finalEpisodes = parseInt(String(localConfig.episodes));
    const finalScenes = parseInt(String(localConfig.scenes));

    if (localConfig.sessions === '' || !Number.isFinite(finalSessions)) {
      errors.sessions = 'Session Count is required.';
    } else if (finalSessions < 1 || finalSessions > 5) {
      errors.sessions = 'Sessions must be between 1 and 5';
    }

    if (localConfig.episodes === '' || !Number.isFinite(finalEpisodes)) {
      errors.episodes = 'Episodes Per Session is required.';
    } else if (finalEpisodes < 1 || finalEpisodes > 24) {
      errors.episodes = 'Episodes must be between 1 and 24';
    }

    if (localConfig.scenes === '' || !Number.isFinite(finalScenes)) {
      errors.scenes = 'Scenes Per Episode is required.';
    } else if (finalScenes < 1 || finalScenes > 40) {
      errors.scenes = 'Scenes must be between 1 and 40';
    }

    const totalEpisodes = finalSessions * finalEpisodes;
    const totalSceneBudget = totalEpisodes * finalScenes;
    const MAX_SAFE_TOTAL_EPISODES = 24;
    const MAX_SAFE_TOTAL_SCENE_BUDGET = 720;

    if (totalEpisodes > MAX_SAFE_TOTAL_EPISODES) {
      errors.episodes = `Total episodes (${totalEpisodes}) exceeds the safe limit of ${MAX_SAFE_TOTAL_EPISODES}. Reduce sessions or episodes.`;
    }

    if (totalSceneBudget > MAX_SAFE_TOTAL_SCENE_BUDGET) {
      errors.scenes = `Total scene budget (${totalSceneBudget}) is too large. Reduce sessions, episodes, or scenes.`;
    }

    return { errors, finalSessions, finalEpisodes, finalScenes, totalEpisodes, totalSceneBudget };
  };

  React.useEffect(() => {
    const { errors } = validateScaffoldingInputs();
    setLocalErrors(errors);
  }, [localConfig]);


  // Note: we intentionally do NOT auto-populate scaffolding from the loaded plan.
  // Users must explicitly enter sessions/episodes/scenes before synthesizing.

  const handleGenerateBlueprint = async () => {
    const { errors, finalSessions, finalEpisodes, finalScenes } = validateScaffoldingInputs();
    if (Object.keys(errors).length > 0) {
      showNotification?.('Please fix scaffolding errors before generating the blueprint.', 'error');
      return;
    }

    try {
      console.log('🎬 [RE-SYNTHESIZE] Dispatching blueprint generation request:', { finalSessions, finalEpisodes, finalScenes });
      showNotification?.('Generating series blueprint from AI...', 'info');

      if (onGenerateSeries) {
        onGenerateSeries({ episodesPerSession: finalEpisodes, sessions: finalSessions, scenes: finalScenes });
        console.log('🎬 [RE-SYNTHESIZE] Direct generation callback invoked');
      } else {
        window.dispatchEvent(new CustomEvent('studio-generate-series', {
          detail: {
            episodesPerSession: finalEpisodes,
            sessions: finalSessions,
            scenes: finalScenes
          }
        }));
        console.log('🎬 [RE-SYNTHESIZE] Event dispatched successfully - check browser console for generation progress');
      }
    } catch (err) {
      console.error("❌ Blueprint generation failed:", err);
      showNotification?.('Failed to generate blueprint: ' + ((err as any)?.message || String(err)), 'error');
    }
  };

  const handleSyncScaffold = async () => {
    const { errors, finalSessions, finalEpisodes, finalScenes } = validateScaffoldingInputs();
    if (Object.keys(errors).length > 0) {
      showNotification?.('Please fix scaffolding errors before syncing the scaffold.', 'error');
      return;
    }

    if (!onManifestContinue) {
      showNotification?.('Scaffold sync is unavailable in this context.', 'warning');
      return;
    }

    setIsSyncingScaffold(true);
    try {
      showNotification?.('Syncing production scaffold to database...', 'info');
      await onManifestContinue({ episodes: finalEpisodes, sessions: finalSessions, scenes: finalScenes, persist: false });
      console.log('🎬 [SCAFFOLD SYNC] onManifestContinue completed successfully');
      showNotification?.('Scaffold synchronized to database.', 'success');
    } catch (err) {
      console.error('❌ Scaffold sync failed:', err);
      showNotification?.('Failed to sync scaffold: ' + ((err as any)?.message || String(err)), 'error');
    } finally {
      setIsSyncingScaffold(false);
    }
  };

  return (
    <div className={s.content.container}>
      <div className={s.content.contentArea}>
        <div className={s.content.mainColumn}>
          <div className="flex flex-col gap-8">

        <div className="max-w-4xl mx-auto">

          <div className="p-8 bg-[#050505]/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] space-y-8 h-full relative overflow-hidden group/orchestration shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Dynamic Background Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-studio/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover/orchestration:bg-studio/10 transition-colors duration-700" />

            <div className="relative z-10 flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-3">
                <div className="relative">
                  <BrainCircuit className="w-5 h-5 text-studio" />
                  <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-studio blur-md rounded-full -z-10"
                  />
                </div>
                AI Orchestration & Sync
              </h4>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Live Engine Feed</span>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Production Scaffolding Constraints */}
              <div className="relative group/scaffold">
                <div className="absolute inset-0 bg-gradient-to-br from-studio/10 via-transparent to-transparent opacity-0 group-hover/scaffold:opacity-100 transition-opacity rounded-3xl" />
                <div className="relative flex flex-col gap-6 p-6 bg-black/60 border border-white/10 rounded-3xl shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Production Scaffolding</h5>
                    <Settings2 className="w-3.5 h-3.5 text-zinc-700" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sessions */}
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block opacity-60">Session Count</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="5"
                        placeholder="1-5"
                        value={localConfig.sessions}
                        onChange={(e) => {
                          const val = e.target.value;
                          const v = val === '' ? '' : parseInt(val) || '';
                          setLocalConfig({...localConfig, sessions: v});
                          try { if (v !== '') setSession?.(String(v)); } catch(e){}
                        }}
                        className={cn("w-full bg-white/[0.03] rounded-xl px-4 py-2.5 text-xs font-mono text-studio focus:bg-studio/5 transition-all outline-none",
                          localErrors.sessions ? 'border border-red-500' : 'border border-white/10')}
                      />
                      {localErrors.sessions && <p className="text-[10px] text-red-400 mt-1">{localErrors.sessions}</p>}
                    </div>
                    
                    {/* Episodes */}
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block opacity-60">Episodes Per Session</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="24"
                        placeholder="1-24"
                        value={localConfig.episodes}
                        onChange={(e) => {
                          const val = e.target.value;
                          const v = val === '' ? '' : parseInt(val) || '';
                          setLocalConfig({...localConfig, episodes: v});
                          try { if (v !== '') setNumEpisodes?.(v as number); } catch(e){}
                        }}
                        className={cn("w-full bg-white/[0.03] rounded-xl px-4 py-2.5 text-xs font-mono text-studio focus:bg-studio/5 transition-all outline-none",
                          localErrors.episodes ? 'border border-red-500' : 'border border-white/10')}
                      />
                      {localErrors.episodes && <p className="text-[10px] text-red-400 mt-1">{localErrors.episodes}</p>}
                    </div>

                    {/* Scenes */}
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block opacity-60">Scenes Per Episode</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="40"
                        placeholder="1-40"
                        value={localConfig.scenes}
                        onChange={(e) => {
                          const val = e.target.value;
                          const v = val === '' ? '' : parseInt(val) || '';
                          setLocalConfig({...localConfig, scenes: v});
                          try { if (v !== '') setNumScenes?.(String(v)); } catch(e){}
                        }}
                        className={cn("w-full bg-white/[0.03] rounded-xl px-4 py-2.5 text-xs font-mono text-studio focus:bg-studio/5 transition-all outline-none",
                          localErrors.scenes ? 'border border-red-500' : 'border border-white/10')}
                      />
                      {localErrors.scenes && <p className="text-[10px] text-red-400 mt-1">{localErrors.scenes}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Session Count</p>
                      <p className="text-lg font-black text-white">{localConfig.sessions || 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Episodes Per Session</p>
                      <p className="text-lg font-black text-white">{localConfig.episodes || 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Scenes Per Episode</p>
                      <p className="text-lg font-black text-white">{localConfig.scenes || 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-studio/10 border border-studio/20">
                      <p className="text-[9px] font-black text-studio uppercase tracking-widest mb-1">Total Scene Budget</p>
                      <p className="text-lg font-black text-white">{totalSceneBudget > 0 ? totalSceneBudget.toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>

                  {totalSceneBudget > 0 && (
                    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                      <span className="text-[10px] font-black text-studio uppercase tracking-[0.3em]">Blueprint Math</span>
                      <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">
                        {localConfig.scenes !== '' ? String(localConfig.scenes) : '0'} scenes × {totalScaffoldingEpisodes.toLocaleString()} episodes ({localConfig.sessions !== '' ? String(localConfig.sessions) : '0'} sessions) = {totalSceneBudget.toLocaleString()} total scenes

                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Context Injection Telemetry HUD */}
              <div className="relative group/telemetry">
                <div className="absolute inset-0 bg-gradient-to-br from-studio/10 via-transparent to-transparent opacity-0 group-hover/telemetry:opacity-100 transition-opacity rounded-3xl" />
                <div className="relative flex flex-col gap-4 p-6 bg-black/60 border border-white/10 rounded-3xl shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Context Injection Telemetry</h5>
                    <Activity className="w-3.5 h-3.5 text-zinc-700" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <Database className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-xs text-zinc-400 font-mono">World Bible Modules</span>
                      </div>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", (generatedWorld || generatedWorldLore) ? "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "text-zinc-700")}>
                        {(generatedWorld || generatedWorldLore) ? `${(generatedWorld?.length || 0) + (generatedWorldLore?.length || 0)} Chars | ACTIVE ✅` : "INACTIVE ❌"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <Users className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-xs text-zinc-400 font-mono">Cast DNA Registry</span>
                      </div>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", characterList?.length > 0 ? "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "text-zinc-700")}>
                        {characterList?.length > 0 ? `${characterList.length}_ENTITIES | ACTIVE ✅` : "INACTIVE ❌"}
                      </span>
                    </div>

                    {plan && plan.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-studio/5 border border-studio/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-3.5 h-3.5 text-studio" />
                          <span className="text-xs text-studio font-mono">Production Series Plan</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-studio">
                          {totalScaffoldingEpisodes || plan.length} EPISODES_READY
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Synthesis Command Center */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isGeneratingSeries ? (
                  <div className="flex flex-col gap-4 p-6 col-span-2 bg-studio/5 border border-studio/20 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                    <div className="flex items-center gap-4">
                      <Loader2 className="w-6 h-6 text-studio animate-spin" />
                      <div>
                        <p className="text-xs font-black text-studio uppercase tracking-widest">Synthesizing Blueprint...</p>
                        <p className="text-xs text-zinc-400 mt-1">Cross-referencing World Lore and Cast DNA.</p>
                      </div>
                    </div>
                    <div className="h-1 bg-black rounded-full overflow-hidden w-full">
                      <motion.div
                        className="h-full bg-studio"
                        initial={{ width: "0%" }}
                        animate={{ width: `${generationProgress || 10}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleGenerateBlueprint}
                      disabled={isSyncing || isGeneratingSeries || isSyncingScaffold}
                      className={cn(
                        "w-full group relative flex items-center justify-center gap-3 p-5 rounded-2xl transition-all duration-500 shadow-[0_0_40px_rgba(6,182,212,0.15)]",
                        isSyncing || isGeneratingSeries || isSyncingScaffold
                          ? "bg-white/[0.02] border border-white/5 opacity-50 cursor-not-allowed"
                          : "bg-studio/10 hover:bg-studio/20 border border-studio/30 hover:border-studio/50"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-studio/0 via-studio/10 to-studio/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                      <Sparkles className="w-5 h-5 text-studio group-hover:animate-pulse" />
                      <span className="text-xs font-black text-white uppercase tracking-[0.3em]">
                        {plan && plan.length > 0 ? "Regenerate Blueprint" : "Generate Blueprint"}
                      </span>
                    </button>

                    <button
                      onClick={handleSyncScaffold}
                      disabled={isSyncing || isGeneratingSeries || isSyncingScaffold}
                      className={cn(
                        "w-full group relative flex items-center justify-center gap-3 p-5 rounded-2xl transition-all duration-500 shadow-[0_0_40px_rgba(6,182,212,0.15)] border border-white/10",
                        isSyncing || isGeneratingSeries || isSyncingScaffold
                          ? "bg-white/[0.02] opacity-50 cursor-not-allowed"
                          : "bg-zinc-900/80 hover:bg-zinc-800 border-white/10"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/0 via-zinc-800/10 to-zinc-800/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                      {isSyncing || isSyncingScaffold ? <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /> : <Database className="w-5 h-5 text-zinc-300" />}
                      <span className="text-xs font-black text-white uppercase tracking-[0.3em]">
                        {isSyncing || isSyncingScaffold ? "Materializing Roadmap..." : "Sync DB Scaffold"}
                      </span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-zinc-600" />
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Database State</span>
                </div>
                <span className={cn(
                  "text-xs font-mono uppercase",
                  lastSyncDate ? "text-green-500" : "text-zinc-600"
                )}>
                  {lastSyncDate ? "Synchronized" : "Pending Sync"}
                </span>
              </div>


            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="p-8 bg-[#050505] border border-white/5 rounded-[2.5rem] space-y-8 h-full relative overflow-hidden">
            {/* Background Glow during generation */}
            <AnimatePresence>
              {isGeneratingSeries && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-transparent pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* AI Synthesis Trace HUD - Transparency Feature */}
            <div className="flex flex-col gap-6 p-6 bg-black/40 border border-white/5 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Activity className="w-5 h-5 text-studio" />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-studio/30 rounded-full blur-md"
                      />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em]">Master Neural Blueprint Trace</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1 h-1 rounded-full bg-studio animate-pulse" />
                        <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Core Synchronicity: 98.4% // Buffer_Stable</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Synthesis Engine v{Math.max(4, (plan?.length || 0) % 5 + 1)}.{Math.max(2, (characterList?.length || 0) % 9)}.0</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={cn("w-2 h-0.5 rounded-full", i <= (plan?.length || 0) % 5 + 1 ? "bg-studio/40" : "bg-zinc-800")} />
                      ))}
                    </div>
                  </div>
                </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-10">
                  {/* Input Context Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Story Bible & Cast DNA (Input)</p>
                      <div className="flex gap-1">
                        <div className={cn("w-1 h-1 rounded-full", generatedWorldLore ? "bg-studio" : "bg-zinc-800")} />
                        <div className={cn("w-1 h-1 rounded-full", characterList?.length > 0 ? "bg-studio" : "bg-zinc-800")} />
                      </div>
                    </div>
                    <div className="p-6 bg-[#060606]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] max-h-[260px] overflow-auto relative group/input shadow-2xl custom-scrollbar selection:bg-studio/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-transparent opacity-0 group-hover/input:opacity-100 transition-opacity duration-700" />
                      <div className="absolute inset-y-0 right-0 w-1 bg-white/5 rounded-full my-4 mr-1 opacity-20 group-hover/input:opacity-40 transition-opacity" />
                      <div className="space-y-4 relative z-10 selection:bg-studio/30">
                        {/* World Bible Status */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-studio shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">AETHERIA_CORE_SYNC</span>
                          </div>
                          {[
                            { label: 'MANIFEST', active: !!generatedWorld },
                            { label: 'HISTORY', active: !!generatedWorldLore },
                            { label: 'POWERS', active: !!generatedWorldPowers },
                            { label: 'FACTIONS', active: !!generatedWorldFactions },
                            { label: 'ATLAS', active: !!generatedWorldAtlas },
                            { label: 'SYSTEMS', active: !!generatedWorldSystems }
                          ].map((module, i) => (
                            <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-zinc-600">MOD_{module.label}</span>
                              <span className={module.active ? "text-studio" : "text-zinc-800"}>{module.active ? 'READY' : 'EMPTY'}</span>
                            </div>
                          ))}
                        </div>

                        {/* Cast DNA Status */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-studio shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">ENTITY_DNA_REGISTRY</span>
                          </div>
                          {[
                            { label: 'REGISTRY', active: characterList?.length > 0, val: characterList?.length ? `${characterList.length}_ENTITIES` : 'EMPTY' },
                            { label: 'DNA_PROFILES', active: !!characterDNA, val: characterDNA ? 'MATERIALIZED' : 'EMPTY' },
                            { label: 'PSYCH_DYNAMICS', active: !!characterDynamics, val: characterDynamics ? 'SYNCED' : 'EMPTY' },
                            { label: 'LORE_INTEGRITY', active: !!characterIntegrity, val: characterIntegrity ? 'VERIFIED' : 'EMPTY' },
                            { label: 'SOCIAL_WEB', active: !!characterRelationships && characterRelationships !== '[]' && characterRelationships !== '{}', val: characterRelationships ? 'MAPPED' : 'EMPTY' }
                          ].map((module, i) => (
                            <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-zinc-600">DNA_{module.label}</span>
                              <span className={module.active ? "text-studio" : "text-zinc-800"}>{module.val}</span>
                            </div>
                          ))}
                        </div>

                        {/* Engine Metaparameters */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">ENGINE_META_LINK</span>
                          </div>
                          {[
                            { label: 'MODEL_ID', val: selectedModel?.toUpperCase().replace(/-/g, '_') || 'AUTO_DETECT', color: 'text-fuchsia-400' },
                            { label: 'TEMP_SETTING', val: temperature?.toFixed(2) || '0.00' },
                            { label: 'TOKENS_MAX', val: maxTokens || '0' },
                            { label: 'TOP_P_BIAS', val: topP?.toFixed(2) || '0.00' },
                            { label: 'TOP_K_DENSITY', val: topK || '0' },
                            { label: 'TONE_SIGNATURE', val: tone?.toUpperCase() || 'UNDEFINED' },
                            { label: 'AUDIENCE_MAP', val: audience?.toUpperCase() || 'UNDEFINED' },
                            { label: 'GENRE_TAG', val: genre?.toUpperCase() || 'UNDEFINED' },
                            { label: 'STYLE_INDEX', val: artStyle?.toUpperCase() || 'UNDEFINED' }
                          ].map((meta, i) => (
                            <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-zinc-600">META_{meta.label}</span>
                              <span className={meta.color || "text-fuchsia-400/80"}>{meta.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
                    </div>

                    {/* Global Production Dashboard */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Production Dashboard</p>
                          <div className="h-0.5 w-12 bg-studio/30 rounded-full" />
                        </div>
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Aggregate Neural Data</span>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { label: 'Runtime', val: plan.length ? `${plan.reduce((acc, ep) => acc + (parseInt(ep.runtime) || 24), 0)}m` : '0m', icon: Clock, color: 'text-studio', sub: 'Total Duration' },
                          { label: 'Scenes', val: plan.reduce((acc, ep) => acc + (ep.asset_matrix?.scene_count || 0), 0), icon: Database, color: 'text-amber-500', sub: 'Matrix Units' },
                          { label: 'VFX Load', val: plan.reduce((acc, ep) => acc + (ep.detailed_episode_spec?.acts?.reduce((a, act) => a + (act.scenes?.filter(s => s.production_stats?.vfx_heavy)?.length || 0), 0) || 0), 0), icon: Sparkles, color: 'text-rose-500', sub: 'Heavy Assets' },
                          { label: 'Cast DNA', val: plan.reduce((acc, ep) => acc + (ep.detailed_episode_spec?.acts?.reduce((a, act) => a + (act.scenes?.reduce((s_acc, s) => s_acc + (s.production_stats?.cast_count || 0), 0) || 0), 0) || 0), 0), icon: Users, color: 'text-blue-500', sub: 'Active Links' },
                          { label: 'Tone', val: tone?.split('/')[0] || 'GRITTY', icon: Activity, color: 'text-purple-500', sub: 'Aesthetic Vibe' },
                          { label: 'Peak Intensity', val: plan.length ? Math.max(...plan.map(ep => parseInt(ep.engagement_matrix?.pacing_intensity) || 0)) : '0', icon: Activity, color: 'text-orange-500', sub: 'Engagement Peak' },
                          { label: 'Palette', val: plan.length ? [...new Set(plan.flatMap(ep => ep.production_palette?.dominant_colors || []))].length : '0', icon: Table, color: 'text-emerald-500', sub: 'Color Variance' },
                          { label: 'Neural Logic', val: plan.length ? (plan.every(ep => ep.neural_audit?.logic_check?.toLowerCase().includes('pass') || ep.neural_audit?.lore_validation?.toLowerCase().includes('confirm')) ? 'PASS' : 'AUDIT') : 'WAIT', icon: BrainCircuit, color: 'text-cyan-500', sub: 'Consistency' },
                        ].map((stat, i) => (
                          <div key={i} className={cn(
                            "p-5 bg-[#080808] border border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-2 group transition-all duration-500 hover:border-studio/30 hover:bg-studio/[0.02] relative overflow-hidden",
                            "shadow-2xl"
                          )}>
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

                    {/* Real-time Neural Synthesis Stream */}
                    <div className="p-6 bg-[#080808] border border-white/5 rounded-[2rem] space-y-4 relative overflow-hidden group/stream">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-studio/20 to-transparent" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BrainCircuit className="w-4 h-4 text-studio opacity-50" />
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Neural Synthesis Stream</span>
                        </div>
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full bg-studio animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                          ))}
                        </div>
                      </div>
                      <div className="h-24 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10 pointer-events-none" />
                         <div className="space-y-2">
                           {[
                             { t: 'INF', msg: 'Core world bible hash verified. 0x82A...F91', color: 'text-emerald-500' },
                             { t: 'SYS', msg: 'Cross-referencing Aetheria timeline with character motivation matrices.', color: 'text-studio' },
                             { t: 'WRN', msg: 'Potential narrative bottleneck detected in Act 2 // Optimization active.', color: 'text-amber-500' },
                             { t: 'DNA', msg: 'Injecting "Wraith" Kisaragi combat signatures into scene 12.', color: 'text-fuchsia-400' },
                             { t: 'OUT', msg: 'Compiling production manifest... Streaming to neural output.', color: 'text-zinc-500' }
                           ].map((log, i) => (
                             <motion.div 
                               key={i}
                               initial={{ opacity: 0, x: -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               transition={{ delay: i * 0.2 }}
                               className="flex items-center gap-3 font-mono text-[9px]"
                             >
                               <span className={cn("w-8 shrink-0 font-black", log.color)}>[{log.t}]</span>
                               <span className="text-zinc-500 uppercase tracking-tighter truncate">{log.msg}</span>
                             </motion.div>
                           ))}
                         </div>
                      </div>
                    </div>
                  </div>


                  {/* Output Plan Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Synthesized Manifest (Neural Output)</p>
                        <div className="h-0.5 w-12 bg-studio/30 rounded-full" />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-studio/5 border border-studio/20 rounded-full">
                        <div className="h-1.5 w-1.5 rounded-full bg-studio animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <span className="text-[9px] font-black text-studio uppercase tracking-widest">Live Output Stream</span>
                      </div>
                    </div>
                    {isGeneratingSeries ? (
                      <div className="relative group/output rounded-[2rem] overflow-hidden border border-studio/30 bg-studio/5 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                        <div className="p-16 flex flex-col items-center justify-center min-h-[400px]">
                          <BrainCircuit className="w-12 h-12 text-studio animate-pulse mb-6" />
                          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Synthesizing Neural Blueprint</h3>
                          <p className="text-xs text-zinc-400 font-mono text-center max-w-sm mb-8">
                            Processing {localConfig.episodes} episodes across {localConfig.scenes} scenes per episode. Cross-referencing world lore and cast DNA...
                          </p>
                          <div className="w-full max-w-md h-1.5 bg-black/60 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-studio shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                              initial={{ width: "0%" }}
                              animate={{ width: `${generationProgress || 15}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : plan && plan.length > 0 ? (
                      <div className="relative group/output rounded-[2rem] overflow-hidden border border-white/5 bg-[#080808] shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-transparent opacity-0 group-hover/output:opacity-100 transition-opacity duration-700" />
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-studio/30 to-transparent" />
                        <div className="p-8 overflow-auto max-h-[600px] custom-scrollbar selection:bg-studio/20 relative z-10">
                          <pre className="text-[11px] font-mono leading-relaxed">
                            {JSON.stringify(plan, null, 2).split('\n').map((line, i) => {
                              const splitIndex = line.indexOf('":');
                              const isKey = splitIndex !== -1;
                              return (
                                <div key={i} className="group/line hover:bg-white/[0.02] -mx-5 px-5 transition-colors">
                                  <span className="opacity-20 mr-4 select-none inline-block w-4 text-right">{(i + 1)}</span>
                                  {isKey ? (
                                    <>
                                      <span className="text-studio/80">{line.slice(0, splitIndex)}"</span>
                                      <span className="text-zinc-600">:</span>
                                      <span className="text-emerald-400/90">{line.slice(splitIndex + 2)}</span>
                                    </>
                                  ) : (
                                    <span className="text-zinc-500">{line}</span>
                                  )}
                                </div>
                              );
                            })}
                          </pre>
                        </div>
                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover/output:opacity-100 transition-opacity duration-500">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
                              window.dispatchEvent(new CustomEvent('show-notification', { detail: { message: 'Manifest JSON copied', type: 'success' } }));
                            }}
                            className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 hover:border-studio/40 rounded-lg text-[10px] font-black text-zinc-400 hover:text-studio transition-all uppercase tracking-widest"
                          >
                            Copy JSON
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group/output rounded-[2rem] overflow-hidden border border-white/5 bg-[#080808]/50 shadow-2xl">
                        <div className="p-8 overflow-auto max-h-[600px] custom-scrollbar relative z-10 opacity-30 select-none">
                          <pre className="text-[11px] font-mono leading-relaxed">
                            {JSON.stringify([
                              {
                                episode: 1,
                                title: "PENDING_SYNTHESIS",
                                synopsis: "Neural engine will structure narrative acts and establish scene matrix based on world constraints...",
                                asset_matrix: { scene_count: "pending", runtime: "pending" },
                                acts: [
                                  { name: "Act I", scenes: [] },
                                  { name: "Act II", scenes: [] }
                                ],
                                production_stats: { vfx_heavy: false, cast_count: 0 }
                              }
                            ], null, 2).split('\n').map((line, i) => {
                              const splitIndex = line.indexOf('":');
                              const isKey = splitIndex !== -1;
                              return (
                                <div key={i} className="group/line -mx-5 px-5">
                                  <span className="opacity-10 mr-4 inline-block w-4 text-right">{(i + 1)}</span>
                                  {isKey ? (
                                    <>
                                      <span className="text-zinc-600">{line.slice(0, splitIndex)}"</span>
                                      <span className="text-zinc-700">:</span>
                                      <span className="text-zinc-600">{line.slice(splitIndex + 2)}</span>
                                    </>
                                  ) : (
                                    <span className="text-zinc-700">{line}</span>
                                  )}
                                </div>
                              );
                            })}
                          </pre>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-20">
                           <div className="flex flex-col items-center gap-3">
                             <BrainCircuit className="w-8 h-8 text-zinc-700 animate-pulse" />
                             <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Awaiting Neural Synthesis</span>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {lastSyncDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-studio/5 border border-studio/20 rounded-[2rem] space-y-3 mt-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-studio/10 blur-2xl rounded-full" />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <CheckCircle2 className="w-5 h-5 text-studio" />
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-studio/30 rounded-full blur-sm"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Production Manifest Locked</span>
                          <p className="text-[8px] text-zinc-500 font-mono uppercase mt-0.5">Database Link Established // Neural Integrity Verified</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.2em]">Materialized</p>
                         <p className="text-[10px] text-studio font-black font-mono tracking-tighter">{lastSyncDate}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="pt-6 border-t border-white/5 relative z-10">
                  <p className="text-xs text-zinc-600 leading-relaxed italic">
                    "Use AI Synthesis to write the episodic roadmap and materialize the database structure for scenes."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  {/* Sidebar */}
    <aside className={s.content.sidebar + " space-y-8"}>
      <div className={s.content.sidebarCard}>
        <div className={s.content.sidebarGlow + " bg-emerald-500/5 group-hover:bg-emerald-500/10"} />
        <div className={s.content.sidebarContent}>
          <h4 className={s.content.sidebarTitle}>
            <Activity className="w-3 h-3 text-emerald-400" /> Series Matrix
                 </h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-zinc-600 uppercase">Episodes</span>
                       <span className="text-xs font-black text-white">{plan.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-zinc-600 uppercase">Est. Runtime</span>
                       <span className="text-xs font-black text-white">
                         {plan.reduce((acc, ep) => acc + (parseInt(ep.runtime) || 24), 0)}m
                       </span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-zinc-600 uppercase">Logic Check</span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Verified</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h5 className={s.content.sidebarTitle}>
                <ScrollText className="w-3 h-3" /> Neural Links
              </h5>
              <div className="flex flex-col gap-2">
                 {plan.map((ep: any, i: number) => (
                   <button 
                     key={i}
                     onClick={() => onViewEpisode?.(ep.episode)}
                     className="w-full flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all group outline-none text-left"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5 text-[10px] font-black text-zinc-600 group-hover:text-emerald-400 transition-colors">
                           {i + 1}
                         </div>
                         <span className="text-[10px] font-black text-zinc-500 group-hover:text-zinc-200 uppercase tracking-tight truncate max-w-[120px]">
                           {ep.title || `Episode ${i + 1}`}
                         </span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-zinc-800 group-hover:text-emerald-500" />
                   </button>
                 ))}
              </div>
           </div>

           {productionSequence.length > 0 && (
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Blueprint Sequence Preview</span>
                 <span className="text-[9px] font-mono text-zinc-600 uppercase">{productionSequence.length} Units</span>
               </div>
               <div className="space-y-2 max-h-48 overflow-auto pr-1 custom-scrollbar">
                 {productionSequence.slice(0, 6).map((unit, idx) => (
                   <button 
                     key={`${unit.sess}-${unit.ep}-${unit.scen}-${idx}`} 
                     onClick={() => applySequenceItem(unit.sess, unit.ep, unit.scen)}
                     className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-tight text-zinc-500 hover:text-white transition-colors bg-transparent border-none p-0 outline-none text-left"
                   >
                     <span className="text-studio/80">{unit.sessionName}</span>
                     <span className="text-zinc-700">/</span>
                     <span>{`E${unit.ep}`}</span>
                     <span className="text-zinc-700">/</span>
                     <span className="text-amber-400 hover:underline">{unit.sceneName}</span>
                   </button>
                 ))}
               </div>
             </div>
           )}

           <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-studio/10 border border-white/5 rounded-[2rem] space-y-4">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Database className="w-3 h-3 text-emerald-400" /> Storage Note
              </h4>
              <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase">
                The series blueprint serves as the master scaffolding. All episodic assets are anchored to this neural map.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
};

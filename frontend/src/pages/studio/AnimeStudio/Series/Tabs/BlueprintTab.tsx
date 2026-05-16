import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Table, ChevronRight, Activity, Sparkles, Database, BrainCircuit, Loader2, Clock, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGeneratorState } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';

interface BlueprintTabProps {
  showScaffolder: boolean;
  onManifestContinue: (config: any) => Promise<void>;
  isSyncing: boolean;
  lastSyncDate: string | null;
  productionSequence: any[];
  applySequenceItem: (sess: number, ep: number, scen: number) => void;
  plan?: any[];
}

export const BlueprintTab: React.FC<BlueprintTabProps> = ({
  onManifestContinue,
  isSyncing,
  lastSyncDate,
  productionSequence,
  applySequenceItem,
  plan = []
}) => {
  const {
    isGeneratingSeries,
    generationProgress,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldAtlas,
    generatedWorldSystems,
    castList,
    castDNA,
    castDynamics,
    castIntegrity,
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
    plan: contextPlan
  } = useGeneratorState();

  const [localConfig, setLocalConfig] = React.useState({
    sessions: 1,
    episodes: plan?.length || contextPlan?.length || 12,
    scenes: plan?.[0]?.asset_matrix?.scene_count || 16
  });

  // Sync local configuration when a new plan (like the demo) is loaded
  React.useEffect(() => {
    if (plan && plan.length > 0) {
      setLocalConfig({
        sessions: 1,
        episodes: plan.length,
        scenes: plan[0]?.asset_matrix?.scene_count || 16
      });
    }
  }, [plan]);

  const handleSynthesizeBlueprint = async () => {
    // Consolidated Action: Initialize Structure + Synthesize AI Content
    try {
      await onManifestContinue(localConfig);
      window.dispatchEvent(new CustomEvent('studio-generate-series', { detail: { episodes: localConfig.episodes } }));
    } catch (err) {
      console.error("Synergy Failed:", err);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-[1600px] mx-auto px-4">
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
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", castList?.length > 0 ? "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "text-zinc-700")}>
                        {castList?.length > 0 ? `${castList.length}_ENTITIES | ACTIVE ✅` : "INACTIVE ❌"}
                      </span>
                    </div>

                    {plan && plan.length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-studio/5 border border-studio/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-3.5 h-3.5 text-studio" />
                          <span className="text-xs text-studio font-mono">Production Series Plan</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-studio">
                          {plan.length} EPISODES_READY
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Synthesis Command Center */}
              <div className="p-1">
                {isGeneratingSeries ? (
                  <div className="flex flex-col gap-4 p-6 bg-studio/5 border border-studio/20 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
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
                  <button
                    onClick={handleSynthesizeBlueprint}
                    disabled={isSyncing || isGeneratingSeries}
                    className={cn(
                      "w-full group relative flex items-center justify-center gap-3 p-5 rounded-2xl transition-all duration-500 shadow-[0_0_40px_rgba(6,182,212,0.15)]",
                      isSyncing || isGeneratingSeries
                        ? "bg-white/[0.02] border border-white/5 opacity-50 cursor-not-allowed"
                        : "bg-studio/10 hover:bg-studio/20 border border-studio/30 hover:border-studio/50"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-studio/0 via-studio/10 to-studio/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    {isSyncing ? <Loader2 className="w-5 h-5 text-studio animate-spin" /> : <Sparkles className="w-5 h-5 text-studio group-hover:animate-pulse" />}
                    <span className="text-xs font-black text-white uppercase tracking-[0.3em]">
                      {isSyncing ? "Materializing Roadmap..." : plan && plan.length > 0 ? "RE-SYNTHESIZE PRODUCTION BLUEPRINT" : "SYNERGIZE & GENERATE BLUEPRINT"}
                    </span>
                  </button>
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
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">Synthesis Engine v{Math.max(4, (plan?.length || 0) % 5 + 1)}.{Math.max(2, (castList?.length || 0) % 9)}.0</span>
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
                        <div className={cn("w-1 h-1 rounded-full", castList?.length > 0 ? "bg-studio" : "bg-zinc-800")} />
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
                            { label: 'REGISTRY', active: castList?.length > 0, val: castList?.length ? `${castList.length}_ENTITIES` : 'EMPTY' },
                            { label: 'DNA_PROFILES', active: !!castDNA, val: castDNA ? 'MATERIALIZED' : 'EMPTY' },
                            { label: 'PSYCH_DYNAMICS', active: !!castDynamics, val: castDynamics ? 'SYNCED' : 'EMPTY' },
                            { label: 'LORE_INTEGRITY', active: !!castIntegrity, val: castIntegrity ? 'VERIFIED' : 'EMPTY' },
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
                          { label: 'Cast DNA', val: plan.reduce((acc, ep) => acc + (ep.detailed_episode_spec?.acts?.reduce((a, act) => a + (act.scenes?.reduce((s_acc, s) => s_acc + (s.production_stats?.cast_count || 0), 0) || 0), 0) || 0), 0), icon: Users, color: 'text-blue-500', sub: 'Active Links' }
                        ].map((stat, i) => (
                          <div key={i} className={cn(
                            "p-5 bg-[#080808] border border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-2 group transition-all duration-500 hover:border-studio/30 hover:bg-studio/[0.02] relative overflow-hidden",
                            "shadow-2xl"
                          )}>
                            <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-studio/10 transition-colors duration-500" />
                            <stat.icon className={cn("w-5 h-5 mb-1 opacity-40 group-hover:opacity-100 transition-opacity duration-500", stat.color)} />
                            <div className="space-y-1 text-center relative z-10">
                              <p className="text-[14px] font-black text-white font-mono leading-none tracking-tighter">{stat.val}</p>
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
                    {plan && plan.length > 0 ? (
                      <div className="relative group/output rounded-[2rem] overflow-hidden border border-white/5 bg-[#080808] shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-transparent opacity-0 group-hover/output:opacity-100 transition-opacity duration-700" />
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-studio/30 to-transparent" />
                        <div className="p-8 overflow-auto max-h-[600px] custom-scrollbar selection:bg-studio/20 relative z-10">


                          <pre className="text-[11px] font-mono leading-relaxed">
                            {JSON.stringify(plan, null, 2).split('\n').map((line, i) => {
                              const isKey = line.includes('":');
                              return (
                                <div key={i} className="group/line hover:bg-white/[0.02] -mx-5 px-5 transition-colors">
                                  <span className="opacity-20 mr-4 select-none inline-block w-4 text-right">{(i + 1)}</span>
                                  {isKey ? (
                                    <>
                                      <span className="text-studio/80">{line.split('":')[0]}"</span>
                                      <span className="text-zinc-600">:</span>
                                      <span className="text-emerald-400/90">{line.split('":')[1]}</span>
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
                      <div className="p-8 bg-black/20 border border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <BrainCircuit className="w-8 h-8 text-zinc-800 animate-pulse" />
                          <span className="text-xs text-zinc-700 font-mono uppercase tracking-widest">Waiting for neural output materialization...</span>
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
  );
};
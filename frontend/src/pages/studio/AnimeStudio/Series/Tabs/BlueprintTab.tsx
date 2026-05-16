import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Table, ChevronRight, Activity, Sparkles, Database, BrainCircuit, Loader2, Clock, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectConfigurator } from '@/pages/studio/components/studio/ManifestArchitect';
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
    castList,
    plan: contextPlan
  } = useGeneratorState();

  const [localConfig, setLocalConfig] = React.useState({
    sessions: 1,
    episodes: plan?.length || contextPlan?.length || 12,
    scenes: plan?.[0]?.asset_matrix?.scene_count || 16
  });

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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectConfigurator
            onContinue={onManifestContinue}
            isLoading={isSyncing}
            externalConfig={localConfig}
            onExternalConfigChange={setLocalConfig}
            hideButton={true}
          />

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
                         <span className={cn("text-[10px] font-black uppercase tracking-widest", generatedWorld || generatedWorldLore ? "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "text-zinc-700")}>
                            {generatedWorld || generatedWorldLore ? "LINKED_SYNC" : "MISSING_DATA"}
                         </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                         <div className="flex items-center gap-3">
                           <Users className="w-3.5 h-3.5 text-zinc-600" />
                           <span className="text-xs text-zinc-400 font-mono">Cast DNA Registry</span>
                         </div>
                         <span className={cn("text-[10px] font-black uppercase tracking-widest", castList?.length > 0 ? "text-studio drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "text-zinc-700")}>
                            {castList?.length > 0 ? `${castList.length}_ENTITIES_ACTIVE` : "REGISTRY_EMPTY"}
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
                        <Activity className="w-4 h-4 text-studio" />
                        <h5 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Master Neural Blueprint Trace</h5>
                     </div>
                     <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">Synthesis Engine v{Math.max(4, (plan?.length || 0) % 5 + 1)}.{Math.max(2, (castList?.length || 0) % 9)}.0</span>
                   </div>
 
                   <div className="flex flex-col gap-8">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {/* Input Context Preview */}
                       <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                             <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Story Bible & Cast DNA (Input)</p>
                             <div className="flex gap-1">
                                <div className={cn("w-1 h-1 rounded-full", generatedWorldLore ? "bg-studio" : "bg-zinc-800")} />
                                <div className={cn("w-1 h-1 rounded-full", castList?.length > 0 ? "bg-studio" : "bg-zinc-800")} />
                             </div>
                          </div>
                          <div className="p-5 bg-[#080808] border border-white/5 rounded-3xl max-h-[180px] overflow-auto relative group/input shadow-inner custom-scrollbar">
                              <div className="absolute inset-y-0 right-0 w-1 bg-white/5 rounded-full my-4 mr-1 opacity-20 group-hover/input:opacity-40 transition-opacity" />
                              <p className="text-[11px] text-zinc-400 font-mono leading-loose relative z-10 selection:bg-studio/30">
                                <span className="text-studio/60 mr-2">◈</span>
                                {generatedWorld || generatedWorldLore ? `[SOURCE_TRUTH]: Loaded modules: Manifest, History, Powers, Factions, Architecture, Atlas, Culture, Systems. Context weight: ~${Math.round(((generatedWorld?.length || 0) + (generatedWorldLore?.length || 0)) / 4)} tokens.` : "[EMPTY]: No world lore generated yet."}
                                <br /><br />
                                <span className="text-studio/60 mr-2">◈</span>
                                {castList?.length > 0 ? `[ENTITY_REGISTRY]: Identified ${castList.length} unique character signatures. Injecting personality DNA and relationship maps.` : "[EMPTY]: No cast DNA available."}
                              </p>
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
                           </div>
                       </div>
   
                       {/* Global Production Dashboard */}
                       <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                             <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Global Production Dashboard</p>
                             <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Aggregate Data</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                             {[
                               { label: 'Runtime', val: plan.length ? `${plan.reduce((acc, ep) => acc + (parseInt(ep.runtime) || 24), 0)}m` : '0m', icon: Clock, color: 'text-studio' },
                               { label: 'Scenes', val: plan.reduce((acc, ep) => acc + (ep.asset_matrix?.scene_count || 0), 0), icon: Database, color: 'text-amber-500' },
                               { label: 'VFX', val: plan.reduce((acc, ep) => acc + (ep.detailed_episode_spec?.acts?.reduce((a, act) => a + (act.scenes?.filter(s => s.production_stats?.vfx_heavy)?.length || 0), 0) || 0), 0), icon: Sparkles, color: 'text-rose-500' },
                               { label: 'Cast', val: plan.reduce((acc, ep) => acc + (ep.detailed_episode_spec?.acts?.reduce((a, act) => a + (act.scenes?.reduce((s_acc, s) => s_acc + (s.production_stats?.cast_count || 0), 0) || 0), 0) || 0), 0), icon: Users, color: 'text-blue-500' }
                             ].map((stat, i) => (
                               <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-1.5 group hover:border-studio/20 transition-all text-center">
                                 <stat.icon className={cn("w-4 h-4 mb-1", stat.color)} />
                                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">{stat.label}</p>
                                 <p className="text-xs font-black text-white font-mono leading-none">{stat.val}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                     </div>

 
                   {/* Output Plan Preview */}
                   <div className="space-y-3">
                       <div className="flex items-center justify-between px-1">
                          <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Synthesized Manifest (Neural Output)</p>
                          <div className="flex items-center gap-2 px-3 py-1 bg-studio/10 border border-studio/20 rounded-full">
                             <div className="h-1.5 w-1.5 rounded-full bg-studio animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                             <span className="text-[10px] font-black text-studio uppercase tracking-widest">Live Stream Active</span>
                          </div>
                       </div>
                       {plan && plan.length > 0 ? (
                         <div className="relative group/output rounded-3xl overflow-hidden border border-white/5 bg-[#050505] shadow-2xl">
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-studio/30 to-transparent" />
                            <div className="p-5 overflow-auto max-h-[500px] custom-scrollbar selection:bg-studio selection:text-black">
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
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-2 mt-6"
               >
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-studio">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </motion.div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">Production Manifest Locked</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Materialized: {lastSyncDate}</p>
                   </div>
               </motion.div>
             )}

            <div className="pt-6 border-t border-white/5 relative z-10">
                <p className="text-xs text-zinc-600 leading-relaxed italic">
                  "Use AI Synthesis to write the episodic roadmap. Use the Project Configurator to materialize the blank database structure for scenes."
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Master Production Matrix */}
      {plan && plan.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-4">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-3">
              <Table className="w-4 h-4 text-studio" />
              Master Production Matrix
            </h4>
          </div>
          
          <div className="overflow-hidden border border-white/10 rounded-[2.5rem] bg-[#050505]/60 backdrop-blur-2xl shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Episode</th>
                    <th className="p-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Thematic Pillar</th>
                    <th className="p-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Engagement</th>
                    <th className="p-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Production Palette</th>
                    <th className="p-6 text-xs font-black text-zinc-500 uppercase tracking-widest">VFX Focus</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.map((ep, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-studio/5 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-studio/10 border border-studio/20 flex items-center justify-center text-xs font-black text-studio">{ep.episode}</span>
                          <span className="text-xs font-black text-white uppercase truncate max-w-[150px]">{ep.title}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-studio/70 uppercase leading-none">{ep.theme_mapping?.core_theme || 'N/A'}</p>
                          <p className="text-xs text-zinc-500 italic line-clamp-1">{ep.theme_mapping?.subtext_goals || 'No subtext goals defined'}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-black text-zinc-600 uppercase leading-none">Pacing</p>
                            <p className="text-xs font-black text-white">{ep.engagement_matrix?.pacing_intensity || '5'}/10</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-black text-zinc-600 uppercase leading-none">Peak Tension</p>
                            <p className="text-xs font-black text-amber-500 truncate max-w-[100px]">{ep.engagement_matrix?.tension_peak || 'Steady'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-1">
                            {ep.production_palette?.dominant_colors?.map((c, i) => (
                              <div key={i} className="w-4 h-4 rounded-full border border-black" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <span className="text-xs text-zinc-400 font-mono truncate max-w-[100px]">{ep.production_palette?.lighting_setup || 'Standard'}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", ep.asset_matrix?.video?.toLowerCase().includes('heavy') ? "bg-rose-500" : "bg-emerald-500")} />
                          <span className="text-xs text-zinc-300 font-medium">{ep.asset_matrix?.video || 'Low Complexity'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {productionSequence.length > 0 && !isSyncing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          <div className="flex items-center justify-between px-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] flex items-center gap-3">
                <Activity className="w-4 h-4 text-studio" />
                Materialized Manifest
              </span>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest pl-8">{productionSequence.length} PRODUCTION UNITS SYNCED</span>
            </div>
          </div>
          <ScrollArea className="h-[450px] border border-white/10 rounded-[3rem] bg-[#050505]/60 backdrop-blur-2xl shadow-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-10">
              {productionSequence.map((unit, idx) => (
                 <div
                  key={idx}
                  className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-studio/40 hover:bg-studio/5 transition-all duration-500 group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-studio/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col gap-2 relative z-10">
                    <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest leading-none">SEQUENCE {idx + 1}</span>
                    <span className="text-[11px] text-white font-mono leading-none">S{unit.sess} · E{unit.ep} · SC{unit.scen}</span>
                  </div>
                  <button
                    onClick={() => applySequenceItem(unit.sess, unit.ep, unit.scen)}
                    className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-studio opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 flex items-center gap-2"
                  >
                    View Node <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      )}
      </div>
    </div>
  );
};


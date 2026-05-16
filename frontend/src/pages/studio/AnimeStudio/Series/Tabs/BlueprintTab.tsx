import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Table, ChevronRight, Activity, Sparkles, Database, BrainCircuit, Loader2, Clock, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectConfigurator } from '@/pages/studio/components/studio/ManifestArchitect';
import { useGeneratorState } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';

interface BlueprintTabProps {
  showScaffolder: boolean;
  onManifestContinue: (config: any) => void;
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

  const handleSynthesizeBlueprint = () => {
    window.dispatchEvent(new CustomEvent('studio-generate-series', { detail: { episodes: localConfig.episodes } }));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectConfigurator
          onContinue={onManifestContinue}
          isLoading={isSyncing}
          externalConfig={localConfig}
          onExternalConfigChange={setLocalConfig}
        />

        <div className="space-y-6">
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

            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3 px-2 relative z-10">
              <BrainCircuit className="w-4 h-4 text-studio" />
              AI Orchestration & Sync
            </h4>
            
            <div className="space-y-6 relative z-10">
               {/* Context Injection Telemetry */}
               <div className="flex flex-col gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl">
                 <h5 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Context Injection Telemetry</h5>
                 
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-mono">World Bible Modules</span>
                    <span className={cn("text-xs font-black uppercase", generatedWorld || generatedWorldLore ? "text-green-500" : "text-zinc-600")}>
                       {generatedWorld || generatedWorldLore ? "Linked" : "Missing"}
                    </span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-mono">Cast DNA Registry</span>
                    <span className={cn("text-xs font-black uppercase", castList?.length > 0 ? "text-green-500" : "text-zinc-600")}>
                       {castList?.length > 0 ? `${castList.length} Active` : "Empty"}
                    </span>
                 </div>

                 {plan && plan.length > 0 && (
                   <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                      <span className="text-xs text-studio font-mono">Current Series Plan</span>
                      <span className="text-xs font-black uppercase text-studio">
                         {plan.length} Episodes
                      </span>
                   </div>
                 )}
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
                     className="w-full group relative flex items-center justify-center gap-3 p-5 bg-white/[0.02] hover:bg-studio/10 border border-white/10 hover:border-studio/30 rounded-2xl transition-all duration-500"
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-studio/0 via-studio/5 to-studio/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                     <Sparkles className="w-5 h-5 text-studio group-hover:animate-pulse" />
                     <span className="text-xs font-black text-white uppercase tracking-[0.3em]">{plan && plan.length > 0 ? "Re-Synthesize Blueprint" : "Synthesize AI Blueprint"}</span>
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

                {/* AI Synthesis Trace HUD - Transparency Feature */}
                <div className="flex flex-col gap-6 p-6 bg-black/40 border border-white/5 rounded-3xl">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-studio" />
                        <h5 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Master Neural Blueprint Trace</h5>
                     </div>
                     <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">Synthesis Engine v4.2.0</span>
                   </div>
 
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {/* Input Context Preview */}
                     <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                           <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Story Bible & Cast DNA (Input)</p>
                           <div className="flex gap-1">
                              <div className={cn("w-1 h-1 rounded-full", generatedWorldLore ? "bg-studio" : "bg-zinc-800")} />
                              <div className={cn("w-1 h-1 rounded-full", castList?.length > 0 ? "bg-studio" : "bg-zinc-800")} />
                           </div>
                        </div>
                        <div className="p-4 bg-black/60 border border-white/5 rounded-2xl max-h-[150px] overflow-auto scrollbar-hide">
                           <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                             {generatedWorld || generatedWorldLore ? `[SOURCE_TRUTH]: Loaded modules: Manifest, History, Powers, Factions, Architecture, Atlas, Culture, Systems. Context weight: ~14k tokens.` : "[EMPTY]: No world lore generated yet."}
                             <br /><br />
                             {castList?.length > 0 ? `[ENTITY_REGISTRY]: Identified ${castList.length} unique character signatures. Injecting personality DNA and relationship maps.` : "[EMPTY]: No cast DNA available."}
                           </p>
                        </div>
                     </div>
 
                     {/* Global Production Dashboard */}
                     <div className="space-y-3">
                        <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Global Production Dashboard</p>
                        <div className="grid grid-cols-2 gap-2">
                           {[
                             { label: 'Total Runtime', val: plan.length ? `${plan.length * 30}m` : '0m', icon: Clock, color: 'text-studio' },
                             { label: 'Scene Units', val: plan.reduce((acc, ep) => acc + (ep.asset_matrix?.scene_count || 0), 0), icon: Database, color: 'text-amber-500' },
                             { label: 'VFX Load', val: plan.reduce((acc, ep) => acc + (ep.detailed_episode_spec?.acts?.reduce((a, act) => a + (act.scenes?.filter(s => s.production_stats?.vfx_heavy)?.length || 0), 0) || 0), 0), icon: Sparkles, color: 'text-rose-500' },
                             { label: 'Cast Intensity', val: plan.reduce((acc, ep) => acc + (ep.detailed_episode_spec?.acts?.reduce((a, act) => a + (act.scenes?.reduce((s_acc, s) => s_acc + (s.production_stats?.cast_count || 0), 0) || 0), 0) || 0), 0), icon: Users, color: 'text-blue-500' }
                           ].map((stat, i) => (
                             <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3 group hover:border-studio/20 transition-all">
                               <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                               <div>
                                 <p className="text-xs font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                 <p className="text-xs font-black text-white font-mono leading-none">{stat.val}</p>
                               </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   </div>
 
                   {/* Output Plan Preview */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                         <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Synthesized Manifest (Neural Output)</p>
                         <span className="text-xs font-black text-studio uppercase tracking-widest animate-pulse">Live Stream Active</span>
                      </div>
                      {plan && plan.length > 0 ? (
                        <div className="p-4 bg-studio/5 border border-studio/10 rounded-2xl relative group overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-b from-studio/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                           <pre className="text-xs text-studio/70 font-mono scrollbar-hide max-h-[250px] overflow-auto leading-relaxed">
                             {JSON.stringify(plan, null, 2)}
                           </pre>
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
                   className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-2"
                 >
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">LOCKED TO DATABASE</span>
                    </div>
                    <p className="text-xs text-green-500/60 font-mono uppercase">Last Materialized: {lastSyncDate}</p>
                 </motion.div>
               )}
            </div>

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
            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
              <Table className="w-4 h-4 text-studio" />
              Master Production Matrix
            </h4>
          </div>
          
          <div className="overflow-hidden border border-white/5 rounded-[2.5rem] bg-[#050505]/80 backdrop-blur-md">
            <div className="overflow-x-auto">
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
          <div className="flex items-center justify-between px-4">
            <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Materialized Manifest: {productionSequence.length} Units
            </span>
          </div>
          <ScrollArea className="h-[400px] border border-white/5 rounded-[2rem] bg-[#050505]/80 backdrop-blur-md">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-8">
              {productionSequence.map((unit, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-studio/30 transition-all group flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-600 font-black uppercase tracking-widest">S{unit.sess} · E{unit.ep} · Scene {unit.scen}</span>
                    <span className="text-xs text-studio font-black">Scene {unit.scen}</span>
                  </div>
                  <button
                    onClick={() => applySequenceItem(unit.sess, unit.ep, unit.scen)}
                    className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-studio flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Load Scene <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </div>
  );
};




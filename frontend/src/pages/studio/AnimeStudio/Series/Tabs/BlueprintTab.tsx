import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Table, ChevronRight, Activity, Sparkles, Database, BrainCircuit, Loader2 } from 'lucide-react';
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
  applySequenceItem: (sess: number, ep: number) => void;
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
    castList
  } = useGeneratorState();

  const initialConfig = {
    sessions: 1,
    episodes: plan.length || 0,
    scenes: plan[0]?.asset_matrix?.scene_count || 0
  };

  const handleSynthesizeBlueprint = () => {
    window.dispatchEvent(new CustomEvent('studio-generate-series'));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectConfigurator
          onContinue={onManifestContinue}
          isLoading={isSyncing}
          initialConfig={initialConfig}
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

            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3 px-2 relative z-10">
              <BrainCircuit className="w-4 h-4 text-studio" />
              AI Orchestration & Sync
            </h4>
            
            <div className="space-y-6 relative z-10">
               {/* Context Injection Telemetry */}
               <div className="flex flex-col gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl">
                 <h5 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Context Injection Telemetry</h5>
                 
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-mono">World Bible Modules</span>
                    <span className={cn("text-[10px] font-black uppercase", generatedWorld || generatedWorldLore ? "text-green-500" : "text-zinc-600")}>
                       {generatedWorld || generatedWorldLore ? "Linked" : "Missing"}
                    </span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-mono">Cast DNA Registry</span>
                    <span className={cn("text-[10px] font-black uppercase", castList?.length > 0 ? "text-green-500" : "text-zinc-600")}>
                       {castList?.length > 0 ? `${castList.length} Active` : "Empty"}
                    </span>
                 </div>

                 {plan && plan.length > 0 && (
                   <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                      <span className="text-[10px] text-studio font-mono">Current Series Plan</span>
                      <span className="text-[10px] font-black uppercase text-studio">
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
                          <p className="text-[10px] text-zinc-400 mt-1">Cross-referencing World Lore and Cast DNA.</p>
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
                     <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{plan && plan.length > 0 ? "Re-Synthesize Blueprint" : "Synthesize AI Blueprint"}</span>
                   </button>
                 )}
               </div>

               <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-zinc-600" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Database State</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono uppercase",
                    lastSyncDate ? "text-green-500" : "text-zinc-600"
                  )}>
                    {lastSyncDate ? "Synchronized" : "Pending Sync"}
                  </span>
               </div>

               {lastSyncDate && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-2"
                 >
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">LOCKED TO DATABASE</span>
                    </div>
                    <p className="text-[9px] text-green-500/60 font-mono uppercase">Last Materialized: {lastSyncDate}</p>
                 </motion.div>
               )}
            </div>

            <div className="pt-6 border-t border-white/5 relative z-10">
                <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                  "Use AI Synthesis to write the episodic roadmap. Use the Project Configurator to materialize the blank database structure for scenes."
                </p>
            </div>
          </div>
        </div>
      </div>

      {productionSequence.length > 0 && !isSyncing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          <div className="flex items-center justify-between px-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Table className="w-3 h-3" />
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
                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">S{unit.sess} · E{unit.ep} · Scene {unit.scen}</span>
                    <span className="text-[10px] text-studio font-black">Scene {unit.scen}</span>
                  </div>
                  <button
                    onClick={() => applySequenceItem(unit.sess, unit.ep)}
                    className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-studio flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
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




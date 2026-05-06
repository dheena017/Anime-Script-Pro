import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Table, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectConfigurator } from '@/pages/studio/components/studio/ManifestArchitect';

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
  const initialConfig = {
    sessions: 1,
    episodes: plan.length || 0,
    scenes: plan[0]?.asset_matrix?.scene_count || 0
  };

  return (
    <div className="space-y-8">
      <ProjectConfigurator
        onContinue={onManifestContinue}
        isLoading={isSyncing}
        initialConfig={initialConfig}
      />

      {lastSyncDate && !isSyncing && (
        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/5 py-2 rounded-full border border-green-500/10">
          <CheckCircle2 className="w-3 h-3" />
          Production Blueprint locked to database at {lastSyncDate}
        </div>
      )}

      {productionSequence.length > 0 && !isSyncing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          <div className="flex items-center justify-between px-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Table className="w-3 h-3" />
              Generated Manifest: {productionSequence.length} Units
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
                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">S{unit.sess} E{unit.ep} SC{unit.scen}</span>
                    <span className="text-[10px] text-studio font-black">Unit {idx + 1}</span>
                  </div>
                  <button
                    onClick={() => applySequenceItem(unit.sess, unit.ep)}
                    className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-studio flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Load Unit <ChevronRight className="w-3 h-3" />
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




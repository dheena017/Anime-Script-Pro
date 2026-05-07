import React from 'react';
import { Users, Mic2, Swords, TrendingUp, GitBranch, Layout, Workflow, Fingerprint, Brain, ShieldCheck, Scale } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { Slider } from '@/components/ui/slider';

interface CastEmptyStateProps {
  onLaunch: () => void;
  onLoadDemo?: () => void;
  isGenerating: boolean;
}

const features = [
  { icon: Users, title: 'Registry', description: 'Core character dossiers and archetypes', color: 'cyan' },
  { icon: Mic2, title: 'Voice', description: 'Vocal rhythm and dialogue archetypes', color: 'blue' },
  { icon: Swords, title: 'Combat', description: 'Power systems and signature techniques', color: 'red' },
  { icon: TrendingUp, title: 'Arcs', description: 'Character growth and moral roadmaps', color: 'fuchsia' },
  { icon: GitBranch, title: 'Dynamics', description: 'Social standing and group etiquette', color: 'orange' },
  { icon: Workflow, title: 'Relationships', description: 'Holistic social web and matrix', color: 'indigo' },
];

export const CastEmptyState: React.FC<CastEmptyStateProps> = ({
  onLaunch,
  onLoadDemo,
  isGenerating
}) => {
  const { numCharacters } = useGeneratorState();
  const { setNumCharacters } = useGeneratorDispatch();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StudioEmptyState
        icon={Users}
        title="Build Your Cast"
        description="Your cast registry is empty. Generate characters, relationships, and deep trait analysis to bring your story’s people to life."
        actionLabel={isGenerating ? "Synthesizing Cast..." : "Create My Cast"}
        onAction={onLaunch}
        isLoading={isGenerating}
        secondaryActionLabel="Load Demo Cast"
        onSecondaryAction={onLoadDemo}
        features={features}
        accentColor="cyan"
      />

      {/* Squad Scaling Controller */}
      <div className="max-w-2xl mx-auto p-8 bg-zinc-950/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
         
         <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-studio/10 flex items-center justify-center text-studio">
               <Scale className="w-8 h-8" />
            </div>
            
            <div className="flex-1 space-y-4 w-full">
               <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Squad Scale</h4>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Adjust number of souls to sequence</p>
                  </div>
                  <div className="px-4 py-1 bg-studio/10 border border-studio/20 rounded-xl">
                    <span className="text-xl font-black text-studio tracking-tighter">{numCharacters}</span>
                    <span className="text-[10px] font-black text-studio/40 ml-1 uppercase">Units</span>
                  </div>
               </div>
               
               <Slider
                 value={[numCharacters]}
                 onValueChange={(val) => setNumCharacters(Array.isArray(val) ? val[0] : val)}
                 min={3}
                 max={15}
                 step={1}
                 className="py-4"
               />
               
               <div className="flex justify-between text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                  <span>Minimum (3)</span>
                  <span>Standard (8)</span>
                  <span>Maximum (15)</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};





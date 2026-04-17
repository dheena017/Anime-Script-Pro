import React, { useMemo, useState } from 'react';
import { Milestone, Trophy, Sparkles } from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateSeriesPlan } from '@/services/geminiService';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { parseLoreWiki, parseLocations } from '@/components/studio/modules/series/bibleUtils';
import { SeriesTopBar } from '@/components/studio/modules/series/SeriesTopBar';
import { SeriesPanel } from '@/components/studio/modules/series/SeriesPanel';

export function SeriesPage() {
  const { 
    generatedSeriesPlan, 
    setGeneratedSeriesPlan, 
    isGeneratingSeries, 
    setIsGeneratingSeries,
    prompt,
    selectedModel
  } = useGenerator();

  const [activeTab, setActiveTab] = useState<'arcs' | 'wiki' | 'locations'>('arcs');
  const [isGeneratingLoc, setIsGeneratingLoc] = useState<Record<string, boolean>>({});

  const loreEntries = useMemo(() => parseLoreWiki(generatedSeriesPlan || ''), [generatedSeriesPlan]);
  const locations = useMemo(() => parseLocations(generatedSeriesPlan || ''), [generatedSeriesPlan]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingSeries(true);
    try {
      const plan = await generateSeriesPlan(prompt, selectedModel);
      setGeneratedSeriesPlan(plan);
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, 'series-plan');
    } finally {
      setIsGeneratingSeries(false);
    }
  };

  const handleGenerateLoc = (loc: any) => {
    setIsGeneratingLoc(prev => ({ ...prev, [loc.id]: true }));
    setTimeout(() => setIsGeneratingLoc(prev => ({ ...prev, [loc.id]: false })), 2000);
  };

  return (
    <SeriesTopBar
      onGenerate={handleGenerate}
      isLoading={isGeneratingSeries}
      disabled={!prompt.trim()}
      actionLabel={isGeneratingSeries ? 'MAPPING...' : 'INITIALIZE WORLD'}
    >
      <div className="grid grid-cols-1 gap-8">
        <SeriesPanel
          generatedSeriesPlan={generatedSeriesPlan}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loreEntries={loreEntries}
          locations={locations}
          isGeneratingLoc={isGeneratingLoc}
          onGenerateLoc={handleGenerateLoc}
        />
      </div>

      {generatedSeriesPlan && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PillarCard icon={Milestone} title="Narrative Arcs" description="Seamless continuity across multi-season arcs." color="text-blue-500" />
            <PillarCard icon={Trophy} title="Lore Integrity" description="Consistent world rules and historical depth." color="text-purple-500" />
            <PillarCard icon={Sparkles} title="Production Flow" description="Optimized episode pacing and transition logic." color="text-emerald-500" />
         </div>
      )}
    </SeriesTopBar>
  );
}

function PillarCard({ icon: Icon, title, description, color }: { icon: any; title: string, description: string, color: string }) {
   return (
      <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 group hover:border-blue-600/20 transition-all shadow-xl">
         <div className={`w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner ${color}`}>
            <Icon className="w-6 h-6" />
         </div>
         <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-200 mb-3 italic">{title}</h4>
         <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">{description}</p>
      </div>
   );
}

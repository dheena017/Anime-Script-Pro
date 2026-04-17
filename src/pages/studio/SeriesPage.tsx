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

// PillarCard is now imported from components/studio/series/PillarCard
import { PillarCard } from '@/components/studio/series/PillarCard';

import React, { useMemo, useState } from 'react';
import { Sword, Zap, Heart } from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateCharacters } from '@/services/geminiService';
import { parseCharacterData, Character } from '@/components/studio/modules/cast/castUtils';
import { CastTopBar } from '@/components/studio/modules/cast/CastTopBar';
import { CastPanel } from '@/components/studio/modules/cast/CastPanel';

export function CastPage() {
  const { 
    generatedCharacters, 
    setGeneratedCharacters, 
    isGeneratingCharacters, 
    setIsGeneratingCharacters,
    prompt,
    selectedModel
  } = useGenerator();

  const [viewMode, setViewMode] = useState<'cards' | 'raw'>('cards');
  const [characterVoices, setCharacterVoices] = useState<Record<string, string>>({});
  const [isGeneratingSheet, setIsGeneratingSheet] = useState<Record<string, boolean>>({});

  const characters = useMemo(() => parseCharacterData(generatedCharacters || ''), [generatedCharacters]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingCharacters(true);
    try {
      const charactersOutput = await generateCharacters(prompt, selectedModel);
      setGeneratedCharacters(charactersOutput);
    } catch (error) {
       console.error("Casting Error:", error);
    } finally {
      setIsGeneratingCharacters(false);
    }
  };

  const handleGenerateSheet = (char: Character) => {
    setIsGeneratingSheet(prev => ({ ...prev, [char.id]: true }));
    setTimeout(() => {
      setIsGeneratingSheet(prev => ({ ...prev, [char.id]: false }));
    }, 2000);
  };

  const handleAssignVoice = (charId: string, voiceId: string) => {
    setCharacterVoices(prev => ({ ...prev, [charId]: voiceId }));
  };

  return (
    <CastTopBar
      onGenerate={handleGenerate}
      isLoading={isGeneratingCharacters}
      disabled={!prompt.trim()}
    >
      <div className="grid grid-cols-1 gap-8">
        <CastPanel
          characters={characters}
          generatedCharacters={generatedCharacters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          characterVoices={characterVoices}
          isGeneratingSheet={isGeneratingSheet}
          onGenerateSheet={handleGenerateSheet}
          onAssignVoice={handleAssignVoice}
        />
      </div>

      {generatedCharacters && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TraitCard icon={Sword} title="Archetype Integrity" description="Optimized for narrative role and conflict potential." color="text-red-500" />
            <TraitCard icon={Zap} title="Visual Specs" description="Detailed aesthetic data for concept art generation." color="text-amber-500" />
            <TraitCard icon={Heart} title="Emotional Logic" description="Consistent psychological behavior and growth paths." color="text-pink-500" />
         </div>
      )}
    </CastTopBar>
  );
}

function TraitCard({ icon: Icon, title, description, color }: { icon: any; title: string, description: string, color: string }) {
   return (
      <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 group hover:border-red-600/20 transition-all shadow-xl">
         <div className={`w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner ${color}`}>
            <Icon className="w-6 h-6" />
         </div>
         <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-200 mb-3 italic">{title}</h4>
         <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">{description}</p>
      </div>
   );
}

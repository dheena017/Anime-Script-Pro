import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  Shield, 
  Sword, 
  Zap, 
  Heart,
  Search,
  Wand2,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateCharacters } from '@/services/geminiService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parseCharacterData, Character } from '@/components/studio/castUtils';
import { CharacterModelSheet } from '@/components/studio/workspace/CharacterModelSheet';
import { RelationshipMap } from '@/components/studio/workspace/RelationshipMap';
import { useMemo, useState } from 'react';

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
       // The SystemErrorPanel will catch this if we throw or log it centrally
    } finally {
      setIsGeneratingCharacters(false);
    }
  };

  const handleGenerateSheet = (char: Character) => {
    setIsGeneratingSheet(prev => ({ ...prev, [char.id]: true }));
    // Simulate generation
    setTimeout(() => {
      setIsGeneratingSheet(prev => ({ ...prev, [char.id]: false }));
    }, 2000);
  };

  const handleAssignVoice = (charId: string, voiceId: string) => {
    setCharacterVoices(prev => ({ ...prev, [charId]: voiceId }));
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative p-12 rounded-[40px] bg-zinc-950 border border-zinc-900 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(220,38,38,0.1),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20">
                <Users className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Personnel Archive</span>
             </div>
             <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">CHARACTER <span className="text-red-600">ENGINE</span></h1>
             <p className="text-zinc-500 max-w-xl text-sm font-medium leading-relaxed italic">
                Neural architecture specialized in archetype construction, psychological depth, and visual design specs.
             </p>
          </div>
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGeneratingCharacters}
            className="h-16 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-xs shadow-2xl group/btn"
          >
            {isGeneratingCharacters ? (
                <div className="w-5 h-5 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mr-3" />
            ) : (
                <Wand2 className="w-4 h-4 mr-3 group-hover/btn:rotate-12 transition-transform" />
            )}
            {isGeneratingCharacters ? 'FABRICATING...' : 'BEGIN FABRICATION'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="studio-panel shadow-2xl">
          <div className="studio-panel-header p-8 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                     <Shield className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="text-sm font-black uppercase tracking-tight">Casting Terminal</h2>
                     <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Neural Draft Output</p>
                  </div>
               </div>
                {generatedCharacters && (
                   <div className="flex items-center gap-2">
                      <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800 mr-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 rounded-lg px-3 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${viewMode === 'cards' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
                          onClick={() => setViewMode('cards')}
                        >
                          <LayoutGrid className="w-3.5 h-3.5" /> Profiles
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 rounded-lg px-3 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${viewMode === 'raw' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
                          onClick={() => setViewMode('raw')}
                        >
                          <TableIcon className="w-3.5 h-3.5" /> Raw Data
                        </Button>
                      </div>
                      <Button variant="ghost" className="h-9 rounded-xl text-zinc-600 hover:text-white px-4 text-[10px] font-black uppercase tracking-widest">Export Specs</Button>
                   </div>
                )}
            </div>
            
            <ScrollArea className="h-[750px] w-full p-10">
              {generatedCharacters ? (
                <div className="space-y-12">
                   <AnimatePresence mode="wait">
                      {viewMode === 'cards' ? (
                        <motion.div 
                          key="cards"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                           {characters.map(char => (
                             <CharacterModelSheet 
                                key={char.id}
                                character={{...char, voiceId: characterVoices[char.id]}}
                                onGenerateSheet={handleGenerateSheet}
                                onAssignVoice={handleAssignVoice}
                                isGenerating={isGeneratingSheet[char.id]}
                             />
                           ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="raw"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="prose prose-invert prose-red max-w-none"
                        >
                           <div className="p-8 rounded-[32px] bg-red-600/5 border border-red-500/10">
                              <ReactMarkdown>{generatedCharacters}</ReactMarkdown>
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>

                   <RelationshipMap characters={characters} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                   <div className="relative mb-8">
                      <div className="absolute -inset-4 bg-red-600/10 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                         <UserPlus className="w-10 h-10 text-zinc-700" />
                      </div>
                   </div>
                   <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-400 mb-2">Awaiting Personnel Input</h3>
                   <p className="text-sm text-zinc-600 font-medium italic max-w-xs leading-relaxed">
                      Initialize the fabrication process to generate elite character archetypes.
                   </p>
                </div>
              )}
            </ScrollArea>
         </Card>
      </div>

      {/* Traits Section - Only visible if content exists */}
      {generatedCharacters && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TraitCard icon={Sword} title="Archetype Integrity" description="Optimized for narrative role and conflict potential." color="text-red-500" />
            <TraitCard icon={Zap} title="Visual Specs" description="Detailed aesthetic data for concept art generation." color="text-amber-500" />
            <TraitCard icon={Heart} title="Emotional Logic" description="Consistent psychological behavior and growth paths." color="text-pink-500" />
         </div>
      )}
    </div>
  );
}

function TraitCard({ icon: Icon, title, description, color }: { icon: any; title: string, description: string, color: string }) {
   return (
      <div className="p-6 rounded-[24px] bg-zinc-950 border border-zinc-900 group hover:border-zinc-800 transition-all">
         <div className={cn("w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", color)}>
            <Icon className="w-5 h-5" />
         </div>
         <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-200 mb-2">{title}</h4>
         <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">{description}</p>
      </div>
   );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

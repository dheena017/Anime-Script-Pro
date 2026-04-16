import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Layers, 
  Sparkles, 
  Map, 
  Route, 
  Milestone, 
  Trophy,
  Wand2,
  Box,
  Scroll,
  Image as ImageIcon,
  Book
} from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateSeriesPlan } from '@/services/geminiService';
import { Button } from '@/components/ui/button';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parseLoreWiki, parseLocations } from '@/components/studio/bibleUtils';
import { LoreEntryCard } from '@/components/studio/workspace/LoreEntryCard';
import { LocationGallery } from '@/components/studio/workspace/LocationGallery';
import { useMemo, useState } from 'react';

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

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative p-12 rounded-[40px] bg-zinc-950 border border-zinc-900 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(37,99,235,0.08),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20">
                 <Map className="w-3 h-3 text-blue-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">World Architecture</span>
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">SERIES <span className="text-blue-600">BIBLE</span></h1>
              <p className="text-zinc-500 max-w-xl text-sm font-medium leading-relaxed italic">
                 The neural repository for your world's laws, factions, and visual history. Continuity is non-negotiable.
              </p>
          </div>
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGeneratingSeries}
            className="h-16 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-xs shadow-2xl group/btn"
          >
            {isGeneratingSeries ? (
                <div className="w-5 h-5 border-2 border-zinc-200 border-t-blue-600 rounded-full animate-spin mr-3" />
            ) : (
                <Wand2 className="w-4 h-4 mr-3 group-hover/btn:rotate-12 transition-transform" />
            )}
            {isGeneratingSeries ? 'MAPPING...' : 'INITIALIZE WORLD'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="studio-panel shadow-2xl">
          <div className="studio-panel-header p-8 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                     <Route className="w-5 h-5" />
                  </div>
                   <div>
                      <h2 className="text-sm font-black uppercase tracking-tight">Continuity Terminal</h2>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Neural Draft Output</p>
                   </div>
                </div>
                {generatedSeriesPlan && (
                  <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
                    <TabButton 
                      active={activeTab === 'arcs'} 
                      onClick={() => setActiveTab('arcs')} 
                      icon={Milestone}
                      label="STORY ARCS" 
                    />
                    <TabButton 
                      active={activeTab === 'wiki'} 
                      onClick={() => setActiveTab('wiki')} 
                      icon={Book}
                      label="LORE WIKI" 
                    />
                    <TabButton 
                      active={activeTab === 'locations'} 
                      onClick={() => setActiveTab('locations')} 
                      icon={ImageIcon}
                      label="LOCATIONS" 
                    />
                  </div>
                )}
             </div>
             
             <ScrollArea className="h-[700px] w-full p-10">
               {generatedSeriesPlan ? (
                 <div className="space-y-12">
                   {activeTab === 'arcs' && (
                     <div className="prose prose-invert prose-blue max-w-none">
                        <div className="p-8 rounded-[32px] bg-blue-600/5 border border-blue-500/10">
                           <ReactMarkdown>{generatedSeriesPlan}</ReactMarkdown>
                        </div>
                     </div>
                   )}

                   {activeTab === 'wiki' && (
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                           <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-500">Neural Lore Wiki</h3>
                           <div className="h-px flex-1 bg-zinc-900" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {loreEntries.map(entry => (
                             <LoreEntryCard key={entry.id} entry={entry} />
                           ))}
                        </div>
                     </div>
                   )}

                   {activeTab === 'locations' && (
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                           <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-500">Neural Environment Map</h3>
                           <div className="h-px flex-1 bg-zinc-900" />
                        </div>
                        <LocationGallery 
                           locations={locations} 
                           isGenerating={isGeneratingLoc}
                           onGenerate={(loc) => {
                              setIsGeneratingLoc(prev => ({ ...prev, [loc.id]: true }));
                              setTimeout(() => setIsGeneratingLoc(prev => ({ ...prev, [loc.id]: false })), 2000);
                           }}
                        />
                     </div>
                   )}
                 </div>
               ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                   <div className="relative mb-8">
                      <div className="absolute -inset-4 bg-blue-600/10 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                         <Box className="w-10 h-10 text-zinc-700" />
                      </div>
                   </div>
                   <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-400 mb-2">Awaiting World Data</h3>
                   <p className="text-sm text-zinc-600 font-medium italic max-w-xs leading-relaxed">
                      Initialize the mapping process to generate structured narrative arcs and continuity data.
                   </p>
                </div>
              )}
            </ScrollArea>
         </Card>
      </div>

      {/* Pillars Section */}
      {generatedSeriesPlan && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PillarCard icon={Milestone} title="Narrative Arcs" description="Seamless continuity across multi-season arcs." color="text-blue-500" />
            <PillarCard icon={Trophy} title="Lore Integrity" description="Consistent world rules and historical depth." color="text-purple-500" />
            <PillarCard icon={Sparkles} title="Production Flow" description="Optimized episode pacing and transition logic." color="text-emerald-500" />
         </div>
      )}
    </div>
  );
}

function PillarCard({ icon: Icon, title, description, color }: { icon: any; title: string, description: string, color: string }) {
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

function TabButton({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon: any }) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`h-8 rounded-lg px-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
      onClick={onClick}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Button>
  );
}

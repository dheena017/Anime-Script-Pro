import React from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Route, 
  Milestone, 
  Box, 
  Image as ImageIcon, 
  Book 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudioModulePanel } from '@/components/studio/core/StudioModulePanel';
import { LoreEntryCard } from './LoreEntryCard';
import { LocationGallery } from './LocationGallery';

interface ContinuityTerminalProps {
  generatedSeriesPlan: string | null;
  activeTab: 'arcs' | 'wiki' | 'locations';
  setActiveTab: (tab: 'arcs' | 'wiki' | 'locations') => void;
  loreEntries: any[];
  locations: any[];
  isGeneratingLoc: Record<string, boolean>;
  onGenerateLoc: (loc: any) => void;
}

export function SeriesPanel({
  generatedSeriesPlan,
  activeTab,
  setActiveTab,
  loreEntries,
  locations,
  isGeneratingLoc,
  onGenerateLoc
}: ContinuityTerminalProps) {
  return (
    <StudioModulePanel
      title="Continuity Terminal"
      subtitle="Neural Draft Output"
      icon={<Route className="w-5 h-5" />}
      actions={generatedSeriesPlan && (
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5 shadow-inner">
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
    >
      {generatedSeriesPlan ? (
        <div className="space-y-12">
          {activeTab === 'arcs' && (
            <div className="prose prose-invert prose-blue max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="p-8 rounded-[32px] bg-blue-600/5 border border-blue-500/10 shadow-[inner_0_0_40px_rgba(0,0,0,0.4)]">
                  <ReactMarkdown>{generatedSeriesPlan}</ReactMarkdown>
               </div>
            </div>
          )}

          {activeTab === 'wiki' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Neural Lore Wiki</h3>
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Neural Environment Map</h3>
                  <div className="h-px flex-1 bg-zinc-900" />
               </div>
               <LocationGallery 
                  locations={locations} 
                  isGenerating={isGeneratingLoc}
                  onGenerate={onGenerateLoc}
               />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
           <div className="relative mb-8 group">
              <div className="absolute -inset-10 bg-blue-600/10 rounded-full blur-[50px] animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:bg-blue-600/10">
                 <Box className="w-10 h-10 text-zinc-500 group-hover:text-blue-500 transition-colors" />
              </div>
           </div>
           <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-3">Awaiting World Data</h3>
           <p className="text-sm text-zinc-500 font-medium italic max-w-xs leading-relaxed mx-auto">
              Initialize the mapping process to generate structured narrative arcs and continuity data.
           </p>
        </div>
      )}
    </StudioModulePanel>
  );
}

function TabButton({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon: any }) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`h-8 rounded-lg px-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-xl scale-105' : 'text-zinc-500 hover:text-zinc-200'}`}
      onClick={onClick}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Button>
  );
}

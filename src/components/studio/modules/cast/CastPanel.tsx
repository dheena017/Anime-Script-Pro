import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Shield, UserPlus, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudioModulePanel } from '@/components/studio/core/StudioModulePanel';
import { CharacterModelSheet } from './CharacterModelSheet';
import { RelationshipMap } from './RelationshipMap';
import { Character } from './castUtils';

interface CastingTerminalProps {
  characters: Character[];
  generatedCharacters: string | null;
  viewMode: 'cards' | 'raw';
  setViewMode: (mode: 'cards' | 'raw') => void;
  characterVoices: Record<string, string>;
  isGeneratingSheet: Record<string, boolean>;
  onGenerateSheet: (char: Character) => void;
  onAssignVoice: (charId: string, voiceId: string) => void;
}

export function CastPanel({
  characters,
  generatedCharacters,
  viewMode,
  setViewMode,
  characterVoices,
  isGeneratingSheet,
  onGenerateSheet,
  onAssignVoice
}: CastingTerminalProps) {
  return (
    <StudioModulePanel
      title="Casting Terminal"
      subtitle="Neural Draft Output"
      icon={<Shield className="w-5 h-5" />}
      actions={generatedCharacters && (
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5 mr-4 font-mono">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 rounded-lg px-3 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${viewMode === 'cards' ? 'bg-white text-black shadow-lg' : 'text-zinc-500'}`}
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Profiles
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 rounded-lg px-3 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${viewMode === 'raw' ? 'bg-white text-black shadow-lg' : 'text-zinc-500'}`}
            onClick={() => setViewMode('raw')}
          >
            <TableIcon className="w-3.5 h-3.5" /> Raw Data
          </Button>
        </div>
      )}
    >
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
                        onGenerateSheet={onGenerateSheet}
                        onAssignVoice={onAssignVoice}
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
                   <div className="p-8 rounded-[32px] bg-red-600/5 border border-red-500/10 shadow-inner">
                      <ReactMarkdown>{generatedCharacters}</ReactMarkdown>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>

           <RelationshipMap characters={characters} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
           <div className="relative mb-8 group">
              <div className="absolute -inset-8 bg-red-600/20 rounded-full blur-[40px] animate-pulse group-hover:bg-red-600/30 transition-all" />
              <div className="relative w-24 h-24 rounded-[32px] bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                 <UserPlus className="w-10 h-10 text-zinc-500 group-hover:text-red-500 transition-colors" />
              </div>
           </div>
           <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-3">Awaiting Personnel Input</h3>
           <p className="text-sm text-zinc-500 font-medium italic max-w-xs leading-relaxed mx-auto">
              Initialize the fabrication process to generate elite character archetypes.
           </p>
        </div>
      )}
    </StudioModulePanel>
  );
}

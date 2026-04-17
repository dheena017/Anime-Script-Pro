import React, { useState } from 'react';
import { Camera, Layers, Mic, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Character } from './castUtils';

const NEURAL_VOICES = [
  { id: 'v1', name: 'Pro Hero (Bold)' },
  { id: 'v2', name: 'Dark Antagonist' },
  { id: 'v3', name: 'Youthful Protagonist' },
  { id: 'v4', name: 'Wise Sensei' },
  { id: 'v5', name: 'Cybernetic AI' },
];

interface CharacterModelSheetProps {
  character: Character;
  onGenerateSheet: (char: Character) => void;
  onAssignVoice: (charId: string, voiceId: string) => void;
  isGenerating?: boolean;
}

export function CharacterModelSheet({
  character,
  onGenerateSheet,
  onAssignVoice,
  isGenerating = false,
}: CharacterModelSheetProps) {
  return (
    <Card className="bg-zinc-950/60 border-zinc-900 rounded-[32px] overflow-hidden group hover:border-zinc-800 transition-all">
      <div className="md:flex h-full">
        {/* Visual Panel */}
        <div className="md:w-1/3 relative min-h-[300px] bg-zinc-900 overflow-hidden">
          {character.imageUrl ? (
            <img src={character.imageUrl} alt={character.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Camera className="w-12 h-12 text-zinc-800 mb-4" />
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic leading-relaxed">
                Visual Model Data <br/> Not Injected
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-4 left-4 right-4">
             <Button
                size="sm"
                className="w-full h-10 bg-white/10 hover:bg-white/20 text-white border-white/5 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest"
                onClick={() => onGenerateSheet(character)}
                disabled={isGenerating}
             >
                {isGenerating ? 'Synthesizing...' : 'Generate Model Sheet'}
             </Button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1 p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-600/10 border border-red-500/20">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">{character.role}</span>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{character.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <Select 
                value={character.voiceId || 'v1'} 
                onValueChange={(val) => onAssignVoice(character.id, val)}
              >
                <SelectTrigger className="h-9 w-[130px] bg-zinc-900 border-zinc-800 text-[9px] font-black uppercase tracking-tight">
                   <div className="flex items-center gap-2">
                     <Mic className="w-3 h-3 text-red-500" />
                     <SelectValue placeholder="Cast Voice" />
                   </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-[10px]">
                  {NEURAL_VOICES.map(v => (
                    <SelectItem key={v.id} value={v.id} className="font-bold uppercase tracking-tight">{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Psychological Profile / Description</p>
               <p className="text-sm text-zinc-400 font-medium italic leading-relaxed">{character.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
               {character.traits.map(trait => (
                 <span key={trait} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                   {trait}
                 </span>
               ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
             <div>
                <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-2">Visual Style Seed</p>
                <code className="text-[10px] text-zinc-500 font-mono">NEURAL-CAST-{character.name.toUpperCase().replace(/\s+/g, '-')}-V2</code>
             </div>
             <div>
                <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-2">Continuity Lock</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <span className="text-[10px] font-bold text-emerald-500/80 uppercase">Active</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

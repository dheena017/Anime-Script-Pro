import React from 'react';
import { Heart, Zap, Sword, Shield, Repeat } from 'lucide-react';
import { Character } from '../castUtils';

interface RelationshipMapProps {
  characters: Character[];
}

export function RelationshipMap({ characters }: RelationshipMapProps) {
  // Mock relationships for visualization
  const getSimulatedRelationship = (char1: string, char2: string) => {
    const roles = `${char1}-${char2}`;
    if (idxOf(char1) === 0 && idxOf(char2) === 1) return { type: 'Rival', icon: Sword, color: 'text-red-500', trend: 'Tense' };
    if (idxOf(char1) === 1 && idxOf(char2) === 2) return { type: 'Trust', icon: Shield, color: 'text-emerald-500', trend: 'Growing' };
    return { type: 'Neutral', icon: Repeat, color: 'text-zinc-600', trend: 'Stable' };
  };

  const idxOf = (name: string) => characters.findIndex(c => c.name === name);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Social <span className="text-red-600">Dynamics</span></h2>
        <div className="h-px flex-1 bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char, i) => (
          <div key={char.id} className="p-6 rounded-[24px] bg-zinc-950 border border-zinc-900 space-y-4">
            <h3 className="text-[12px] font-black uppercase tracking-widest text-zinc-300 border-b border-white/5 pb-2">
              {char.name}'s Relationships
            </h3>
            <div className="space-y-4">
              {characters.filter(c => c.id !== char.id).slice(0, 3).map((other) => {
                const rel = getSimulatedRelationship(char.name, other.name);
                const Icon = rel.icon;
                return (
                  <div key={other.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-600 uppercase">
                         {other.name[0]}
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tight">{other.name}</p>
                         <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{rel.trend}</p>
                       </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <div className={`flex items-center gap-1.5 ${rel.color}`}>
                          <Icon className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">{rel.type}</span>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

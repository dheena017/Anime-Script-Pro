import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Target,
  Skull,
  MessageSquare,
  User,
  Sparkles,
  Search,
  EyeOff,
  Eye,
  Camera,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { generateSceneImage } from '@/services/api/gemini';
import { Button } from '@/components/ui/button';

interface CastCardProps {
  character: any;
  index: number;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
  onViewCharacter?: (charName: string) => void;
}

export const CastCard = React.memo<CastCardProps>(({
  character,
  index,
  isEditing,
  onUpdate,
  onViewCharacter
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const toText = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') return value;
    if (value == null) return fallback;
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
        .join(', ');
    }
    if (typeof value === 'object') {
      // Flatten object values so rich AI JSON doesn't crash text nodes.
      return Object.values(value as Record<string, unknown>)
        .map((item) => (typeof item === 'string' ? item : Array.isArray(item) ? item.join(', ') : JSON.stringify(item)))
        .join(' | ');
    }
    return String(value);
  };

  const archetypeText = toText(character.archetype, 'Main Protocol');
  const personalityText = toText(character.personality, 'Underspecified');
  const goalText = toText(character.goal, 'Redacted');
  const flawText = toText(character.flaw, 'Perfect Model');
  const appearanceText = toText(character.appearance, 'Standard aesthetic parameters.');
  const speakingStyleText = toText(character.speakingStyle, 'Clinical and precise.');
  const conflictText = toText(character.conflict, 'Primary ideological battleground.');
  const secretText = toText(character.secret, 'No classified data found.');
  const visualPromptText = toText(character.visualPrompt, 'GENETIC_HASH_PENDING');

  const handleGenerateImage = async () => {
    if (!character.visualPrompt) return;
    
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateSceneImage(character.visualPrompt);
      if (imageUrl) {
        onUpdate({ imageUrl });
      }
    } catch (error) {
      console.error("Failed to generate character image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-[#050505] border border-zinc-900 rounded-[2.5rem] overflow-hidden hover:border-studio/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--studio-rgb),0.05)] h-full flex flex-col"
    >
      {/* Header / Identity */}
      <div className="p-8 border-b border-zinc-900 bg-gradient-to-br from-zinc-950 to-[#050505] relative overflow-hidden">
        {/* Subtle background glow based on edit state */}
        {isEditing && <div className="absolute inset-0 bg-studio/5 animate-pulse pointer-events-none" />}

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex-1 mr-4">
            {isEditing ? (
              <input
                className="w-full bg-black/80 border border-studio/40 rounded-xl px-4 py-2 text-2xl font-black text-white uppercase focus:border-studio focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-none mb-3 transition-all"
                value={character.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
              />
            ) : (
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter uppercase drop-shadow-lg mb-2">
                {character.name}
              </h3>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <input
                    className="bg-black/40 border border-studio/10 rounded-lg px-3 py-1 text-[9px] uppercase font-black text-studio focus:outline-none flex-1"
                    value={character.archetype}
                    onChange={(e) => onUpdate({ archetype: e.target.value })}
                    placeholder="Archetype"
                  />
                  <input
                    className="bg-black/40 border border-studio/10 rounded-lg px-3 py-1 text-[9px] uppercase font-bold text-zinc-500 focus:outline-none flex-1"
                    value={character.personality}
                    onChange={(e) => onUpdate({ personality: e.target.value })}
                    placeholder="Personality"
                  />
                </div>
              ) : (
                <>
                  <span className={cn(
                    "text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border shadow-sm",
                    archetypeText.toLowerCase().includes('protagonist') || archetypeText.toLowerCase().includes('hero') ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-cyan-500/20' :
                      archetypeText.toLowerCase().includes('antagonist') || archetypeText.toLowerCase().includes('villain') ? 'text-red-400 bg-red-500/10 border-red-500/30 shadow-red-500/20' :
                        archetypeText.toLowerCase().includes('mentor') || archetypeText.toLowerCase().includes('master') ? 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-amber-500/20' :
                          archetypeText.toLowerCase().includes('rival') ? 'text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-orange-500/20' :
                            'text-studio bg-studio/10 border-studio/30 shadow-studio/20'
                  )}>
                    {archetypeText}
                  </span>

                  <span className={cn(
                    "text-[9px] uppercase tracking-[0.1em] font-bold px-3 py-1 rounded-full border",
                    personalityText.toLowerCase().includes('dere') ? 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30' : 'text-zinc-400 bg-zinc-900 border-zinc-800'
                  )}>
                    {personalityText}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="relative group/avatar shrink-0">
            <div className="absolute inset-0 bg-studio/20 blur-xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center overflow-hidden relative z-10 shadow-2xl group-hover/avatar:border-studio/50 transition-all duration-500">
              <AnimatePresence mode="wait">
                {isGeneratingImage ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <Loader2 className="w-8 h-8 text-studio animate-spin" />
                    <span className="text-[8px] font-black text-studio uppercase animate-pulse">Synthesizing</span>
                  </motion.div>
                ) : character.imageUrl ? (
                  <motion.img 
                    key="image"
                    initial={{ opacity: 0, scale: 1.1 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    src={character.imageUrl} 
                    alt={character.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col items-center gap-2 text-zinc-600 group-hover/avatar:text-studio transition-colors"
                  >
                    <User className="w-10 h-10" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Overlay button for generation */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center p-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="w-full h-full text-[9px] font-black uppercase text-white hover:text-studio hover:bg-transparent flex flex-col gap-1"
                >
                  {character.imageUrl ? <RefreshCw className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  {character.imageUrl ? "Regenerate" : "Generate"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-zinc-950 p-4 rounded-3xl border border-zinc-900/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-3 h-3 text-studio" />
                <span className="text-[8px] uppercase font-black tracking-widest text-zinc-500">Core Objective</span>
              </div>
              {isEditing ? (
                <textarea
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-2 text-[10px] text-zinc-400 font-medium italic focus:outline-none min-h-[60px] resize-none"
                  value={character.goal}
                  onChange={(e) => onUpdate({ goal: e.target.value })}
                />
              ) : (
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">
                  "{goalText}"
                </p>
              )}
            </div>
            <div className="flex-1 bg-zinc-950 p-4 rounded-3xl border border-zinc-900/50">
              <div className="flex items-center gap-2 mb-2">
                <Skull className="w-3 h-3 text-fuchsia-500" />
                <span className="text-[8px] uppercase font-black tracking-widest text-zinc-500">Genetic Flaw</span>
              </div>
              {isEditing ? (
                <textarea
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-2 text-[10px] text-zinc-400 font-medium italic focus:outline-none min-h-[60px] resize-none"
                  value={character.flaw}
                  onChange={(e) => onUpdate({ flaw: e.target.value })}
                />
              ) : (
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">
                  "{flawText}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body / Detail Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative flex-1">
        {!isEditing && <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-zinc-900 hidden md:block" />}

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
              <Search className="w-3 h-3" /> Visual DNA
            </div>
            {isEditing ? (
              <textarea
                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] text-zinc-500 font-medium focus:outline-none min-h-[80px] resize-none"
                value={toText(character.appearance)}
                onChange={(e) => onUpdate({ appearance: e.target.value })}
              />
            ) : (
              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                {appearanceText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
              <MessageSquare className="w-3 h-3" /> Communication Style
            </div>
            {isEditing ? (
              <input
                className="w-full bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-zinc-400 font-medium italic focus:outline-none"
                value={toText(character.speakingStyle)}
                onChange={(e) => onUpdate({ speakingStyle: e.target.value })}
              />
            ) : (
              <p className="text-[10px] text-zinc-400 font-medium italic">
                "{speakingStyleText}"
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-studio" /> Narrative Conflict
            </div>
            {isEditing ? (
              <textarea
                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] text-zinc-500 font-medium focus:outline-none min-h-[80px] resize-none"
                value={character.conflict}
                onChange={(e) => onUpdate({ conflict: e.target.value })}
              />
            ) : (
              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                {conflictText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase text-zinc-700 tracking-[0.2em]">
              <EyeOff className="w-3 h-3 text-orange-500/50" /> Hidden Secret
            </div>
            <div className={cn("bg-orange-500/5 border border-orange-500/10 p-3 rounded-2xl transition-all duration-700 cursor-help", !isEditing && "blur-[2px] hover:blur-none")}>
              {isEditing ? (
                <textarea
                  className="w-full bg-transparent border-none p-0 text-[9px] text-orange-400/80 font-black uppercase tracking-tighter italic focus:outline-none min-h-[40px] resize-none"
                  value={character.secret}
                  onChange={(e) => onUpdate({ secret: e.target.value })}
                />
              ) : (
                <p className="text-[9px] text-orange-400/80 font-black uppercase tracking-tighter italic">
                  {secretText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Prompt / DNA String Footer */}
      <div className="p-6 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-studio shadow-studio" />
          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest truncate max-w-[200px]">
            DNA: {visualPromptText}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={() => onViewCharacter?.(character.name)}
              className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase px-3 py-1 bg-white/5 rounded-full border border-white/10 hover:text-white hover:bg-white/10 transition-all"
            >
              <Eye className="w-3 h-3" />
              View Bio
            </button>
          )}
          <div className="text-[9px] font-black text-studio uppercase px-3 py-1 bg-studio/10 rounded-full border border-studio/20">
            Ready for Manifestation
          </div>
        </div>
      </div>
    </motion.div>
  );
});




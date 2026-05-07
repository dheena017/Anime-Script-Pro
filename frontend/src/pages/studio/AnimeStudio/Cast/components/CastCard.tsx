import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  User,
  Sparkles,
  EyeOff,
  Camera,
  Loader2} from 'lucide-react';
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
      return Object.values(value as Record<string, unknown>)
        .map((item) => (typeof item === 'string' ? item : Array.isArray(item) ? item.join(', ') : JSON.stringify(item)))
        .join(' | ');
    }
    return String(value);
  };

  const archetypeText = toText(character.archetype, 'Main Protocol');
  const personalityText = toText(character.personality, 'Underspecified');
  const goalText = toText(character.goal, 'Redacted');
  const conflictText = toText(character.conflict, 'Primary ideological battleground.');
  const secretText = toText(character.secret, 'No classified data found.');

  // Calculate production readiness based on deep fields
  const readiness = [
    character.speakingStyle?.catchphrases,
    character.powerSystem?.cameraChoreography,
    character.narrative?.arcRoadmap?.moralDilemma,
    character.technicalModel?.vfxSignature
  ].filter(Boolean).length * 25;

  const handleGenerateImage = async () => {
    if (!character.visualPrompt) return;
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateSceneImage(character.visualPrompt);
      if (imageUrl) onUpdate({ imageUrl });
    } catch (error) {
      console.error("Failed to generate character image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.8 }}
      className="group relative bg-[#060606] border border-white/5 rounded-[3rem] overflow-hidden hover:border-studio/30 transition-all duration-700 hover:shadow-[0_0_80px_rgba(var(--studio-rgb),0.1)] flex flex-col"
    >
      {/* Neural Header */}
      <div className="h-28 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/20 via-transparent to-fuchsia-500/10 opacity-30" />
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path 
            d="M0 20 L20 20 L30 40 L50 40 L60 10 L80 10 L100 30" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            className="text-studio"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M0 80 L10 80 L25 60 L40 60 L55 90 L70 90 L100 70" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            className="text-fuchsia-500"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Role Ribbon */}
        <div className="absolute top-6 right-[-3rem] w-40 h-8 bg-studio rotate-45 flex items-center justify-center shadow-2xl">
           <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">{toText(character.role || 'CAST')}</span>
        </div>
      </div>

      <div className="px-10 pb-10 -mt-14 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-end mb-10">
          {/* Avatar Core */}
          <div className="relative group/avatar shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-tr from-studio to-fuchsia-500 rounded-[2.5rem] blur-xl opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-700" />
            <div className="w-36 h-36 rounded-[2.2rem] bg-zinc-950 border border-white/10 flex items-center justify-center overflow-hidden relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover/avatar:border-studio/50 transition-all duration-700">
              <AnimatePresence mode="wait">
                {isGeneratingImage ? (
                  <motion.div key="loading" className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-studio animate-spin" />
                    <span className="text-[8px] font-black text-studio uppercase tracking-widest animate-pulse">Scanning DNA</span>
                  </motion.div>
                ) : character.imageUrl ? (
                  <motion.img 
                    key="image" src={character.imageUrl} 
                    className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-1000" 
                  />
                ) : (
                  <motion.div key="placeholder" className="text-zinc-800 group-hover/avatar:text-studio transition-colors">
                    <User className="w-16 h-16" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center p-4 backdrop-blur-md">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="w-full h-full text-[10px] font-black text-white hover:text-studio hover:bg-transparent flex flex-col gap-3"
                >
                  <Camera className="w-6 h-6" />
                  GENERATE VIZ
                </Button>
              </div>
            </div>
          </div>

          {/* Identity Block */}
          <div className="flex-1 pb-4">
            <h3 className="text-6xl font-black text-white tracking-tighter uppercase mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] group-hover:text-studio transition-colors duration-500">
              {character.name}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
               <div className="px-5 py-2 bg-studio/5 border border-studio/20 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-studio shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-studio">{archetypeText}</span>
               </div>
               <div className="px-5 py-2 bg-white/5 border border-white/5 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{personalityText}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="mb-10 p-6 bg-zinc-950/80 rounded-3xl border border-white/5 space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Production Ready Factor</span>
              <span className="text-[10px] font-black text-white">{readiness}%</span>
           </div>
           <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${readiness}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-studio/40 to-studio shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              />
           </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="p-8 bg-zinc-950/40 rounded-[3rem] border border-white/5 hover:bg-zinc-900/40 transition-all duration-500 space-y-4">
              <div className="flex items-center gap-3 text-studio">
                 <Target className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Objective</span>
              </div>
              <p className="text-sm text-zinc-400 font-medium italic leading-relaxed border-l border-studio/20 pl-4">
                "{goalText}"
              </p>
           </div>

           <div className="p-8 bg-zinc-950/40 rounded-[3rem] border border-white/5 hover:bg-zinc-900/40 transition-all duration-500 space-y-4">
              <div className="flex items-center gap-3 text-fuchsia-500">
                 <Sparkles className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Arc Status</span>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                {conflictText}
              </p>
           </div>

           <div className="p-8 bg-zinc-950/40 rounded-[3rem] border border-white/5 hover:bg-zinc-900/40 transition-all duration-500 space-y-4">
              <div className="flex items-center gap-3 text-orange-500">
                 <EyeOff className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Secrets</span>
              </div>
              <div className="bg-orange-500/5 p-4 rounded-2xl blur-[4px] hover:blur-none transition-all duration-700 cursor-help">
                <p className="text-[10px] text-orange-400/80 font-black uppercase italic truncate">
                  {secretText}
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* Neural Footer */}
      <div className="px-10 py-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
               <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">DNA-0{index + 1}</span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
               <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Neural Link: Encrypted</span>
            </div>
         </div>
         <Button 
            onClick={() => onViewCharacter?.(character.name)}
            className="px-8 py-2 bg-studio/10 hover:bg-studio text-studio hover:text-black font-black uppercase text-[10px] tracking-widest rounded-2xl border border-studio/20 transition-all shadow-[0_0_30px_rgba(6,182,212,0.1)]"
         >
           Access Full Profile
         </Button>
      </div>
    </motion.div>
  );
});




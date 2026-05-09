import React, { useEffect, useState } from 'react';
import { Sparkles, Fingerprint, Star, Zap, Brain, Shield, Flame, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { CastContext } from './CastLayout';
import { generateCharacters } from '@/services/api/gemini';
import { cn } from '@/lib/utils';

export function CharacterCreationPage() {
  const {
    prompt,
    selectedModel,
    contentType,
    generatedWorld,
  } = useGeneratorState();
  const {
    showNotification,
    setCastList,
    setCastData,
    setIsGeneratingCharacters
  } = useGeneratorDispatch();
  
  const { setHandlers } = React.useContext(CastContext);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // DNA Sculpting State
  const [dna, setDna] = useState({
    determination: 80,
    complexity: 65,
    darkness: 30,
    intelligence: 75
  });

  const handleGenerateCharacter = async (focusArchetype?: string) => {
    if (!prompt.trim() && !focusArchetype) {
      showNotification?.('Please enter a story prompt first or select an archetype.', 'error');
      return;
    }
    
    setIsGenerating(true);
    setIsGeneratingCharacters(true);
    
    try {
      const enrichedPrompt = focusArchetype 
        ? `Focusing on a ${focusArchetype} lead. ${prompt}` 
        : prompt;
      
      const dnaContext = `DNA Parameters: Determination ${dna.determination}%, Complexity ${dna.complexity}%, Darkness ${dna.darkness}%, Intelligence ${dna.intelligence}%`;
      const fullPrompt = `${enrichedPrompt}\n\n${dnaContext}`;

      const result = await generateCharacters(fullPrompt, selectedModel, contentType, generatedWorld || undefined);
      
      if (typeof result === 'object' && result !== null) {
        setCastData(result);
        if ('characters' in result) setCastList(result.characters);
      }
      showNotification?.(focusArchetype ? `${focusArchetype} prototype initialized!` : 'Characters created successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Failed to create characters: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsGenerating(false);
      setIsGeneratingCharacters(false);
    }
  };

  // Initialize handlers
  useEffect(() => {
    if (!setHandlers) return;
    setHandlers({
      handleGenerateCharacter: () => handleGenerateCharacter(),
      isGenerating
    });
  }, [setHandlers, isGenerating, prompt, dna]);

  const archetypes = [
    { icon: Star, title: "Shonen Lead", desc: "High determination, latent power, strong moral compass.", color: "text-amber-500", border: "border-amber-500/20" },
    { icon: Zap, title: "Anti-Hero", desc: "Dark past, pragmatic methods, complex moral gray areas.", color: "text-fuchsia-500", border: "border-fuchsia-500/20" },
    { icon: Fingerprint, title: "Mystic Prodigy", desc: "Genius intellect, detached personality, hidden lineage.", color: "text-cyan-500", border: "border-cyan-500/20" }
  ];

  const dnaSliders = [
    { label: "Determination", key: "determination", icon: Flame, color: "bg-orange-500" },
    { label: "Complexity", key: "complexity", icon: Brain, color: "bg-fuchsia-500" },
    { label: "Darkness", key: "darkness", icon: Eye, color: "bg-zinc-800" },
    { label: "Intelligence", key: "intelligence", icon: Shield, color: "bg-blue-500" }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {archetypes.map((archetype, idx) => (
          <Card key={idx} className={cn("bg-[#030303] border-studio/20 p-8 rounded-[2rem] hover:border-studio/50 transition-all duration-500 group relative overflow-hidden", archetype.border)}>
            <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <archetype.icon className={cn("w-12 h-12 mb-6 group-hover:scale-110 transition-all duration-500", archetype.color)} />
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3">{archetype.title}</h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-8">{archetype.desc}</p>
            <Button 
              disabled={isGenerating}
              onClick={() => handleGenerateCharacter(archetype.title)}
              className="w-full h-12 bg-studio/10 hover:bg-studio text-studio hover:text-black border border-studio/20 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
            >
              {isGenerating ? "Synthesizing..." : "Initialize Prototype"}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="bg-[#050505]/50 border border-studio/10 p-12 rounded-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-studio/5 opacity-20 blur-3xl animate-pulse" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-6">
            <Sparkles className="w-16 h-16 text-studio mx-auto lg:mx-0 mb-6 opacity-40" />
            <h2 className="text-3xl font-black text-white uppercase tracking-widest">Advanced DNA Sculpting</h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto lg:mx-0 font-medium italic">
              "Fine-tune the neural weights of your cast. These parameters will influence the psychological depth and conflict resolution of the synthesized characters."
            </p>
            <Button 
              disabled={isGenerating}
              onClick={() => handleGenerateCharacter()}
              className="px-12 h-14 bg-studio text-black font-black uppercase tracking-[0.2em] text-xs rounded-full shadow-[0_0_30px_#06b6d444] hover:shadow-[0_0_50px_#06b6d466] transition-all"
            >
              {isGenerating ? "Sequencing DNA..." : "Synthesize Cast"}
            </Button>
          </div>

          <div className="space-y-8">
            {dnaSliders.map((slider) => (
              <div key={slider.key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <slider.icon className="w-4 h-4 text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{slider.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-studio">{(dna as any)[slider.key]}%</span>
                </div>
                <div className="relative h-1.5 w-full bg-white/5 rounded-full cursor-pointer group/slider" 
                     onClick={(e) => {
                       const rect = e.currentTarget.getBoundingClientRect();
                       const val = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                       setDna(prev => ({ ...prev, [slider.key]: Math.max(0, Math.min(100, val)) }));
                     }}>
                  <div 
                    className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-300", slider.color)}
                    style={{ width: `${(dna as any)[slider.key]}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-xl scale-0 group-hover/slider:scale-100 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}





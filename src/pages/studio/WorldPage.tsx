import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Globe, Sparkles, Heart, Compass } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateWorld } from '@/services/geminiService';
import { cn } from '@/lib/utils';

// Sub-components
import { WorldMapPreview } from './components/World/WorldMapPreview';
import { LoreChronicle } from './components/World/LoreChronicle';

export function WorldPage() {
  const [isLiked, setIsLiked] = React.useState(false);
  const { 
    generatedWorld, 
    setGeneratedWorld, 
    isGeneratingWorld, 
    setIsGeneratingWorld,
    prompt,
    selectedModel,
    contentType
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingWorld(true);
    const world = await generateWorld(prompt, selectedModel, contentType);
    setGeneratedWorld(world);
    setIsGeneratingWorld(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
          <Globe className="w-5 h-5 text-cyan-400" />
          World Architecture
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 h-8 px-3"
          onClick={handleGenerate}
          disabled={isGeneratingWorld || !prompt.trim()}
        >
          {isGeneratingWorld ? (
            <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-2" />
          ) : (
            <Compass className="w-4 h-4 mr-2" />
          )}
          {isGeneratingWorld ? 'Mapping...' : 'Forge World Lore'}
        </Button>
      </div>

      <Card className="bg-[#050505]/50 border border-cyan-500/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden min-h-[700px]">
        <div className="p-4 border-b border-cyan-500/10 bg-[#0a0a0a]/80 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">World Lore & Geography</span>
            </div>
            <div className="w-[1px] h-4 bg-zinc-800" />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 rounded-full transition-all duration-300",
                isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "text-zinc-600 hover:text-fuchsia-400 hover:bg-[#0a0a0a]"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[750px] w-full p-0">
          <div className="p-12 max-w-4xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isGeneratingWorld ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-cyan-600">
                  <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                  <p className="font-sans font-medium tracking-widest text-xs uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">Architecting reality...</p>
                </div>
              ) : generatedWorld ? (
                <div className="space-y-12">
                  <div className="border-b border-cyan-500/20 pb-12 mb-12 text-center space-y-4 relative">
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                    <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                      World Lore Specification
                    </div>
                    <h1 className="text-5xl font-black text-cyan-50 leading-tight uppercase tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      The Setting
                    </h1>
                    <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
                      Establishing the foundation of laws, geography, and historical weight for your narrative.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                     <div className="lg:col-span-8">
                        <div className="prose prose-invert prose-cyan max-w-none 
                          prose-h1:font-black prose-h1:uppercase prose-h1:tracking-tighter prose-h1:text-cyan-400
                          prose-h2:font-bold prose-h2:uppercase prose-h2:tracking-widest prose-h2:text-cyan-200
                          prose-strong:text-cyan-300 prose-strong:font-bold
                          prose-li:text-zinc-400 prose-li:font-medium
                        ">
                          <ReactMarkdown>{generatedWorld}</ReactMarkdown>
                        </div>
                     </div>
                     <div className="lg:col-span-4 space-y-12">
                        <WorldMapPreview />
                        <LoreChronicle />
                     </div>
                  </div>

                  <div className="mt-24 pt-12 border-t border-cyan-500/10 text-center">
                    <p className="text-[10px] text-cyan-500/50 uppercase tracking-[0.5em] font-bold">
                      End of World Spec
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
                  <Globe className="w-16 h-16 mb-6 opacity-20" />
                  <p className="mb-8 font-sans font-medium text-xs uppercase tracking-widest">Architect your world lore to ground your characters.</p>
                  <Button 
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-none shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold tracking-[0.2em] uppercase text-xs h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
                    onClick={handleGenerate}
                    disabled={isGeneratingWorld || !prompt.trim()}
                  >
                    {isGeneratingWorld ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-3" />
                    )}
                    Forge World
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Globe, Sparkles, Heart, Compass, Box } from 'lucide-react';
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
    contentType,
    session,
    episode
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
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-studio text-shadow-studio">
            <Globe className="w-5 h-5 text-studio" />
            World Architecture
          </h2>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-studio/5 border border-studio/20 rounded-lg">
            <Box className="w-3 h-3 text-studio/50" />
            <span className="text-[10px] font-black text-studio/60 uppercase tracking-tighter">Unit</span>
            <span className="text-xs font-black text-white font-mono">S{session}-E{episode}</span>
          </div>
        </div>
      </div>

      <Card className="bg-[#050505]/50 border border-studio shadow-studio overflow-hidden min-h-[700px]">
        <div className="p-4 border-b border-studio/10 bg-[#0a0a0a]/80 flex items-center justify-between backdrop-blur-md">
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
          
          <Button 
            size="sm" 
            className="bg-studio hover:bg-studio/80 text-white font-black tracking-widest uppercase text-xs h-9 px-6 shadow-studio"
            onClick={handleGenerate}
            disabled={isGeneratingWorld || !prompt.trim()}
          >
            {isGeneratingWorld ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Sparkles className="w-3 h-3 mr-2" />
            )}
            {isGeneratingWorld ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        <div className="w-full p-0">
          <div className="p-12 max-w-4xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isGeneratingWorld ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-studio">
                  <div className="w-10 h-10 border-2 border-studio/30 border-t-studio rounded-full animate-spin mb-6 shadow-studio" />
                  <p className="font-sans font-medium tracking-widest text-xs uppercase text-shadow-studio">Architecting reality...</p>
                </div>
              ) : generatedWorld ? (
                <div className="space-y-12">
                  <div className="border-b border-studio/20 pb-12 mb-12 text-center space-y-4 relative">
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                    <div className="inline-block px-4 py-1.5 bg-studio/10 border border-studio/30 rounded-xl text-[10px] uppercase tracking-[0.4em] text-studio font-black shadow-studio mb-6">
                      World Lore Specification 
                    </div>
                    <h1 className="text-6xl font-black text-studio text-shadow-studio leading-tight uppercase tracking-tighter">
                      The Foundation
                    </h1>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-studio to-transparent mx-auto mt-8 opacity-50" />
                    <p className="text-zinc-500 italic max-w-lg mx-auto font-medium mt-6 text-sm">
                      Establishing the neural architecture, laws, and sensory palette for your narrative universe.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                     <div className="lg:col-span-8">
                        <div className="prose prose-invert max-w-none 
                          prose-h1:font-black prose-h1:uppercase prose-h1:tracking-tighter prose-h1:text-studio prose-h1:border-b prose-h1:border-studio/10 prose-h1:pb-4
                          prose-h2:font-black prose-h2:uppercase prose-h2:tracking-widest prose-h2:text-studio/90 prose-h2:flex prose-h2:items-center prose-h2:gap-3
                          prose-h2:before:content-[''] prose-h2:before:w-2 prose-h2:before:h-2 prose-h2:before:bg-studio prose-h2:before:rounded-full
                          prose-strong:text-studio prose-strong:font-black
                          prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-sm
                          prose-li:text-zinc-400 prose-li:font-medium
                        ">
                          <ReactMarkdown>{generatedWorld}</ReactMarkdown>
                        </div>
                     </div>
                     <div className="lg:col-span-4 space-y-16">
                        <WorldMapPreview />
                        <LoreChronicle />
                        <div className="p-6 rounded-2xl bg-studio/5 border border-studio/20 space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-studio flex items-center gap-2">
                              <Sparkles className="w-3 h-3" /> Production Note
                           </h4>
                           <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                              This specification serves as the primary visual and narrative anchor for the script engine. Character actions and environmental descriptions will be mapped against these rules.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-24 pt-12 border-t border-studio/10 text-center">
                    <p className="text-[10px] text-studio/50 uppercase tracking-[0.5em] font-bold">
                      End of World Spec
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
                  <Globe className="w-16 h-16 mb-6 opacity-20" />
                  <p className="mb-8 font-sans font-medium text-xs uppercase tracking-widest">Architect your world lore to ground your characters.</p>
                  <Button 
                    className="bg-studio hover:bg-studio/80 text-white border-none shadow-studio font-black tracking-[0.2em] uppercase text-xs h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
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
        </div>
      </Card>
    </motion.div>
  );
}

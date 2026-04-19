import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Image as ImageIcon, Sparkles, Heart, Box } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateImagePrompts } from '@/services/geminiService';
import { cn } from '@/lib/utils';

export function PromptsPage() {
  const [isLiked, setIsLiked] = React.useState(false);
  const { 
    generatedImagePrompts, 
    setGeneratedImagePrompts, 
    isGeneratingImagePrompts, 
    setIsGeneratingImagePrompts,
    generatedScript,
    selectedModel,
    session,
    episode
  } = useGenerator();

  const handleGenerate = async () => {
    if (!generatedScript) return;
    setIsGeneratingImagePrompts(true);
    const prompts = await generateImagePrompts(generatedScript, selectedModel);
    setGeneratedImagePrompts(prompts);
    setIsGeneratingImagePrompts(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.15em] flex items-center gap-3 text-studio text-shadow-studio">
            <ImageIcon className="w-6 h-6 text-studio" />
            AI Image Prompts
          </h2>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-studio/5 border border-studio/20 rounded-lg">
            <Box className="w-3 h-3 text-studio/50" />
            <span className="text-[10px] font-black text-studio/60 uppercase tracking-tighter">Unit</span>
            <span className="text-xs font-black text-white font-mono">S{session}-E{episode}</span>
          </div>
        </div>
        <p className="text-studio/60 font-bold uppercase tracking-widest text-xs">
          Generate Midjourney & Stable Diffusion prompts from your script frames.
        </p>
      </div>

      <div className="flex items-center justify-end border-b border-zinc-800/50 pb-0" />

      <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border-studio/20 overflow-hidden shadow-studio relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0" />
        
        <div className="p-4 border-b border-studio/20 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-studio shadow-sm shadow-studio/20 bg-studio/10 px-3 py-1.5 rounded-full border border-studio/30">
              <ImageIcon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Midjourney & SD Prompts</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-300 border border-transparent flex-shrink-0",
                isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "text-zinc-600 hover:text-studio hover:bg-zinc-800/50"
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
            disabled={isGeneratingImagePrompts || !generatedScript}
          >
            {isGeneratingImagePrompts ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Sparkles className="w-3 h-3 mr-2" />
            )}
            {isGeneratingImagePrompts ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        <div className="w-full p-6 relative z-10 bg-[#050505]/50">
          <div className="prose prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-h1:text-studio prose-h2:text-studio/80 prose-a:text-studio">
            {isGeneratingImagePrompts ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-studio">
                <div className="w-10 h-10 border-2 border-studio/30 border-t-studio rounded-full animate-spin mb-4 shadow-studio" />
                <p className="uppercase tracking-widest text-xs font-bold text-shadow-studio">Generating visual prompts...</p>
              </div>
            ) : generatedImagePrompts ? (
              <ReactMarkdown>{generatedImagePrompts}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                <ImageIcon className="w-16 h-16 mb-4 opacity-20 text-studio/30" />
                <p className="uppercase tracking-widest text-xs font-bold font-mono">Generate image prompts to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

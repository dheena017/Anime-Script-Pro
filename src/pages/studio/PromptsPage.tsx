import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Image as ImageIcon, Sparkles, Heart } from 'lucide-react';
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
    selectedModel
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
        <h2 className="text-2xl font-black uppercase tracking-[0.15em] flex items-center gap-3 text-cyan-50 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          <ImageIcon className="w-6 h-6 text-cyan-400" />
          AI Image Prompts
        </h2>
        <p className="text-cyan-500/60 font-bold uppercase tracking-widest text-xs">
          Generate Midjourney & Stable Diffusion prompts from your script frames.
        </p>
      </div>

      <div className="flex items-center justify-end border-b border-zinc-800/50 pb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-zinc-800 bg-[#0a0a0a]/50 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-zinc-400 uppercase tracking-wider text-[10px] font-bold h-9 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          onClick={handleGenerate}
          disabled={isGeneratingImagePrompts || !generatedScript}
        >
          {isGeneratingImagePrompts ? (
            <div className="w-3.5 h-3.5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-2" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 mr-2" />
          )}
          {isGeneratingImagePrompts ? 'Visualizing...' : 'Regenerate Prompts'}
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border-cyan-500/20 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)] relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0" />
        
        <div className="p-4 border-b border-cyan-500/20 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-500 shadow-sm shadow-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/30">
              <ImageIcon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Midjourney & SD Prompts</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-300 border border-transparent flex-shrink-0",
                isLiked ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-zinc-800/50"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[600px] w-full p-6 relative z-10 bg-[#050505]/50">
          <div className="prose prose-invert prose-cyan max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-h1:text-cyan-500 prose-h2:text-cyan-400/80 prose-a:text-cyan-400">
            {isGeneratingImagePrompts ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-cyan-700">
                <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
                <p className="uppercase tracking-widest text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]">Generating visual prompts...</p>
              </div>
            ) : generatedImagePrompts ? (
              <ReactMarkdown>{generatedImagePrompts}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                <ImageIcon className="w-16 h-16 mb-4 opacity-20 text-cyan-900" />
                <p className="uppercase tracking-widest text-xs font-bold">Generate image prompts to see them here.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

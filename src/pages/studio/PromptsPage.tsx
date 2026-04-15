import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateImagePrompts } from '@/services/geminiService';

export function PromptsPage() {
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-red-500" />
          AI Image Prompts
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
          onClick={handleGenerate}
          disabled={isGeneratingImagePrompts || !generatedScript}
        >
          {isGeneratingImagePrompts ? (
            <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {isGeneratingImagePrompts ? 'Visualizing...' : 'Regenerate Prompts'}
        </Button>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center gap-2 text-red-500">
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Midjourney & SD Prompts</span>
        </div>
        <ScrollArea className="h-[600px] w-full p-6">
          <div className="prose prose-invert prose-red max-w-none">
            {isGeneratingImagePrompts ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4" />
                <p>Generating visual prompts...</p>
              </div>
            ) : generatedImagePrompts ? (
              <ReactMarkdown>{generatedImagePrompts}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                <p>Generate image prompts to see them here.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

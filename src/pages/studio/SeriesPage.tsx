import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Layers, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateSeriesPlan } from '@/services/geminiService';

export function SeriesPage() {
  const { 
    generatedSeriesPlan, 
    setGeneratedSeriesPlan, 
    isGeneratingSeries, 
    setIsGeneratingSeries,
    prompt,
    selectedModel
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingSeries(true);
    const plan = await generateSeriesPlan(prompt, selectedModel);
    setGeneratedSeriesPlan(plan);
    setIsGeneratingSeries(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="w-5 h-5 text-red-500" />
          Series Plan
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
          onClick={handleGenerate}
          disabled={isGeneratingSeries || !prompt.trim()}
        >
          {isGeneratingSeries ? (
            <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {isGeneratingSeries ? 'Planning...' : 'Regenerate Series'}
        </Button>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center gap-2 text-red-500">
          <Layers className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">3-Part Series Arc</span>
        </div>
        <ScrollArea className="h-[600px] w-full p-6">
          <div className="prose prose-invert prose-red max-w-none">
            {isGeneratingSeries ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4" />
                <p>Planning your series...</p>
              </div>
            ) : generatedSeriesPlan ? (
              <ReactMarkdown>{generatedSeriesPlan}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                <Layers className="w-12 h-12 mb-4 opacity-20" />
                <p>Generate a series plan to see it here.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

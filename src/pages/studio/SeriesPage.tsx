import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Layers, Sparkles, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateSeriesPlan } from '@/services/geminiService';
import { cn } from '@/lib/utils';

export function SeriesPage() {
  const [isLiked, setIsLiked] = React.useState(false);
  const { 
    generatedSeriesPlan, 
    setGeneratedSeriesPlan, 
    isGeneratingSeries, 
    setIsGeneratingSeries,
    prompt,
    selectedModel,
    contentType
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingSeries(true);
    const plan = await generateSeriesPlan(prompt, selectedModel, contentType);
    setGeneratedSeriesPlan(plan);
    setIsGeneratingSeries(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-2 text-cyan-50 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <Layers className="w-6 h-6 text-cyan-400" />
          Series Plan
        </h2>
        <Button 
          variant="outline" size="sm" 
          className="border-zinc-800 bg-[#0a0a0a]/50 hover:bg-cyan-500/10 hover:text-cyan-400 text-zinc-400 h-8 font-black uppercase tracking-widest text-[9px]"
          onClick={handleGenerate}
          disabled={isGeneratingSeries || !prompt.trim()}
        >
          {isGeneratingSeries ? (
            <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          {isGeneratingSeries ? 'Planning...' : 'Regenerate Series'}
        </Button>
      </div>

      <Card className="bg-[#050505]/50 border border-cyan-500/10 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[700px]">
        <div className="p-4 border-b border-cyan-500/10 bg-[#0a0a0a]/80 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Layers className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Story Architecture</span>
            </div>
            <div className="w-[1px] h-4 bg-zinc-800" />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 rounded-full transition-all duration-300",
                isLiked ? "text-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-[#0a0a0a]"
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
              {isGeneratingSeries ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-cyan-600">
                  <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                  <p className="font-sans font-medium uppercase tracking-[0.2em] text-[10px]">Architecting narrative arcs...</p>
                </div>
              ) : generatedSeriesPlan ? (
                <div className="space-y-12">
                  <div className="border-b border-cyan-500/20 pb-12 mb-12 text-center space-y-4">
                    <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                      Narrative Blueprint
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-widest leading-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      3-Part Series Plan
                    </h1>
                    <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
                      Developing long-term character progression and seasonal climax structures.
                    </p>
                  </div>

                  <div className="prose prose-invert prose-cyan max-w-none prose-h1:text-cyan-400 prose-strong:text-cyan-300">
                    <ReactMarkdown>{generatedSeriesPlan}</ReactMarkdown>
                  </div>

                  <div className="mt-24 pt-12 border-t border-cyan-500/10 text-center">
                    <p className="text-[10px] text-cyan-500/50 uppercase tracking-[0.5em] font-bold">
                      End of Blueprint
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
                  <Layers className="w-16 h-16 mb-6 opacity-10" />
                  <p className="mb-8 font-sans font-bold uppercase tracking-widest text-[10px]">Plan your series arc to see it here.</p>
                  <Button 
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-none shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold tracking-[0.2em] uppercase text-xs h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
                    onClick={handleGenerate}
                    disabled={isGeneratingSeries || !prompt.trim()}
                  >
                    {isGeneratingSeries ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-3" />
                    )}
                    Build Series Plan
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

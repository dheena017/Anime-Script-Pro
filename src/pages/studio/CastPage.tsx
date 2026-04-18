import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Users, UserPlus, Sparkles, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateCharacters } from '@/services/geminiService';
import { cn } from '@/lib/utils';

export function CastPage() {
  const [isLiked, setIsLiked] = React.useState(false);
  const { 
    generatedCharacters, 
    setGeneratedCharacters, 
    isGeneratingCharacters, 
    setIsGeneratingCharacters,
    prompt,
    selectedModel,
    contentType
  } = useGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingCharacters(true);
    const characters = await generateCharacters(prompt, selectedModel, contentType);
    setGeneratedCharacters(characters);
    setIsGeneratingCharacters(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-red-500" />
          Character Cast
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
          onClick={handleGenerate}
          disabled={isGeneratingCharacters || !prompt.trim()}
        >
          {isGeneratingCharacters ? (
            <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-2" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          {isGeneratingCharacters ? 'Designing...' : 'Regenerate Cast'}
        </Button>
      </div>

      <Card className="bg-zinc-900/30 border-zinc-900 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[700px]">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Character Archetypes</span>
            </div>
            <div className="w-[1px] h-4 bg-zinc-800" />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 rounded-full transition-all duration-300",
                isLiked ? "text-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "text-zinc-600 hover:text-red-400 hover:bg-zinc-800"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[700px] w-full p-0">
          <div className="p-12 max-w-4xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isGeneratingCharacters ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
                  <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-6" />
                  <p className="font-serif italic text-lg text-zinc-400">Sketching character souls...</p>
                </div>
              ) : generatedCharacters ? (
                <div className="space-y-12">
                  <div className="border-b border-zinc-800 pb-12 mb-12 text-center space-y-4">
                    <div className="inline-block px-3 py-1 bg-zinc-800/30 border border-zinc-700/50 rounded-full text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-4">
                      Cast & Archetype Specification
                    </div>
                    <h1 className="text-5xl font-serif italic text-zinc-100 leading-tight">
                      Supporting Cast
                    </h1>
                    <p className="text-zinc-500 italic max-w-lg mx-auto">
                      Architecting the emotional core and ideological conflicts of your narrative world.
                    </p>
                  </div>

                  <div className="prose prose-invert prose-red max-w-none">
                    <ReactMarkdown>{generatedCharacters}</ReactMarkdown>
                  </div>

                  <div className="mt-24 pt-12 border-t border-zinc-900 text-center">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-bold">
                      End of Cast Spec
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-zinc-600">
                  <Users className="w-16 h-16 mb-6 opacity-20" />
                  <p className="mb-8 font-serif italic text-lg">Define your cast to see them come to life.</p>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_20px_rgba(220,38,38,0.3)] font-bold tracking-[0.2em] uppercase text-xs h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95"
                    onClick={handleGenerate}
                    disabled={isGeneratingCharacters || !prompt.trim()}
                  >
                    {isGeneratingCharacters ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-3" />
                    )}
                    Design Characters
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

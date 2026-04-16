import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Camera, 
  Palette, 
  Zap,
  Wand2,
  Eye,
  Box
} from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateImagePrompts } from '@/services/geminiService';
import { Button } from '@/components/ui/button';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'image-prompts');
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative p-12 rounded-[40px] bg-zinc-950 border border-zinc-900 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(168,85,247,0.08),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20">
                <Palette className="w-3 h-3 text-purple-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">Visual Synthesis</span>
             </div>
             <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">IMAGE <span className="text-purple-600">ENGINE</span></h1>
             <p className="text-zinc-500 max-w-xl text-sm font-medium leading-relaxed italic">
                Advanced architectural drafting of visual prompts, lighting specs, and cinematic composition data.
             </p>
          </div>
          <Button 
            onClick={handleGenerate}
            disabled={!generatedScript || isGeneratingImagePrompts}
            className="h-16 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-xs shadow-2xl group/btn"
          >
            {isGeneratingImagePrompts ? (
                <div className="w-5 h-5 border-2 border-zinc-200 border-t-purple-600 rounded-full animate-spin mr-3" />
            ) : (
                <Wand2 className="w-4 h-4 mr-3 group-hover/btn:rotate-12 transition-transform" />
            )}
            {isGeneratingImagePrompts ? 'SYNTHESIZING...' : 'BEGIN SYNTHESIS'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
         <Card className="bg-zinc-950/40 border-zinc-900 shadow-2xl rounded-[32px] overflow-hidden backdrop-blur-xl">
            <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                     <Camera className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="text-sm font-black uppercase tracking-tight">Prompt Terminal</h2>
                     <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Neural Draft Output</p>
                  </div>
               </div>
            </div>
            
            <ScrollArea className="h-[650px] w-full p-10">
              {generatedImagePrompts ? (
                <div className="prose prose-invert prose-purple max-w-none">
                   <div className="p-8 rounded-[32px] bg-purple-600/5 border border-purple-500/10">
                      <ReactMarkdown>{generatedImagePrompts}</ReactMarkdown>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                   <div className="relative mb-8">
                      <div className="absolute -inset-4 bg-purple-600/10 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                         <Box className="w-10 h-10 text-zinc-700" />
                      </div>
                   </div>
                   <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-400 mb-2">Awaiting Narrative Input</h3>
                   <p className="text-sm text-zinc-600 font-medium italic max-w-xs leading-relaxed">
                      Initialize the synthesis process to generate high-fidelity visual prompts for production.
                   </p>
                </div>
              )}
            </ScrollArea>
         </Card>
      </div>

      {/* Aspects Section */}
      {generatedImagePrompts && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AspectCard icon={Eye} title="Compositional Logic" description="Optimized camera angles and framing metadata." color="text-purple-500" />
            <AspectCard icon={Zap} title="Lighting Specs" description="Detailed atmospheric and technical lighting data." color="text-amber-500" />
            <AspectCard icon={Sparkles} title="Visual Continuity" description="Ensuring consistent style across all production scenes." color="text-blue-500" />
         </div>
      )}
    </div>
  );
}

function AspectCard({ icon: Icon, title, description, color }: { icon: any; title: string, description: string, color: string }) {
   return (
      <div className="p-6 rounded-[24px] bg-zinc-950 border border-zinc-900 group hover:border-zinc-800 transition-all">
         <div className={cn("w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", color)}>
            <Icon className="w-5 h-5" />
         </div>
         <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-200 mb-2">{title}</h4>
         <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">{description}</p>
      </div>
   );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

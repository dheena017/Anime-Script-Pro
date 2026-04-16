import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Search, 
  Sparkles, 
  FileText, 
  Youtube, 
  Target, 
  BarChart3, 
  Globe,
  Wand2,
  Cpu
} from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateMetadata, generateYouTubeDescription } from '@/services/geminiService';
import { Button } from '@/components/ui/button';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function SEOPage() {
  const { 
    generatedMetadata, 
    setGeneratedMetadata, 
    isGeneratingMetadata, 
    setIsGeneratingMetadata,
    generatedDescription,
    setGeneratedDescription,
    isGeneratingDescription,
    setIsGeneratingDescription,
    generatedScript,
    selectedModel
  } = useGenerator();

  const handleGenerateMetadata = async () => {
    if (!generatedScript) return;
    setIsGeneratingMetadata(true);
    try {
      const data = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seo-metadata');
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!generatedScript) return;
    setIsGeneratingDescription(true);
    try {
      const description = await generateYouTubeDescription(generatedScript, selectedModel);
      setGeneratedDescription(description);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seo-description');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative p-12 rounded-[40px] bg-zinc-950 border border-zinc-900 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(234,179,8,0.05),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Globe className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Distribution Intelligence</span>
             </div>
             <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">SEO <span className="text-amber-500">OPTIMIZER</span></h1>
             <p className="text-zinc-500 max-w-xl text-sm font-medium leading-relaxed italic">
                Strategic metadata generation for platform saturation, high-retention discovery, and global search dominance.
             </p>
          </div>
          <div className="flex gap-4">
             <Button 
                onClick={handleGenerateMetadata}
                disabled={!generatedScript || isGeneratingMetadata}
                className="h-14 px-6 rounded-2xl bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 transition-all font-black uppercase tracking-widest text-[9px]"
              >
                {isGeneratingMetadata ? <div className="w-4 h-4 border-2 border-zinc-500 border-t-amber-500 rounded-full animate-spin mr-3" /> : <Target className="w-3.5 h-3.5 mr-3" />}
                Metadata
              </Button>
              <Button 
                onClick={handleGenerateDescription}
                disabled={!generatedScript || isGeneratingDescription}
                className="h-14 px-6 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-[9px] shadow-2xl"
              >
                {isGeneratingDescription ? <div className="w-4 h-4 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mr-3" /> : <Youtube className="w-3.5 h-3.5 mr-3" />}
                Production Log
              </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="bg-zinc-950/40 border-zinc-900 shadow-2xl rounded-[32px] overflow-hidden backdrop-blur-xl group/card">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover/card:text-amber-500 transition-colors">
                     <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-tight">AI Metadata</h2>
               </div>
            </div>
            <ScrollArea className="h-[450px] w-full p-8 text-xs font-medium leading-relaxed">
               {generatedMetadata ? (
                 <div className="prose prose-invert prose-amber max-w-none text-[11px]">
                    <ReactMarkdown>{generatedMetadata}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-zinc-500">
                    <Search className="w-8 h-8 mb-4" />
                    Awaiting generation...
                 </div>
               )}
            </ScrollArea>
         </Card>

         <Card className="bg-zinc-950/40 border-zinc-900 shadow-2xl rounded-[32px] overflow-hidden backdrop-blur-xl group/card">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover/card:text-red-500 transition-colors">
                     <Youtube className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-tight">Social Description</h2>
               </div>
            </div>
            <ScrollArea className="h-[450px] w-full p-8 text-xs font-medium leading-relaxed">
               {generatedDescription ? (
                 <div className="prose prose-invert prose-red max-w-none text-[11px]">
                    <ReactMarkdown>{generatedDescription}</ReactMarkdown>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-zinc-500">
                    <Youtube className="w-8 h-8 mb-4" />
                    Awaiting generation...
                 </div>
               )}
            </ScrollArea>
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <MetricBox title="Discoverability" value="HIGH" icon={Search} color="text-emerald-500" />
         <MetricBox title="Engagement" value="OPTIMIZED" icon={BarChart3} color="text-amber-500" />
         <MetricBox title="Neural Model" value="GEMINI 3.1" icon={Cpu} color="text-red-500" />
         <MetricBox title="Context Size" value="128K" icon={Sparkles} color="text-blue-500" />
      </div>
    </div>
  );
}

function MetricBox({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
   return (
      <div className="p-5 rounded-[24px] bg-zinc-950 border border-zinc-900">
         <div className="flex items-center gap-3 mb-3">
            <Icon className={cn("w-3.5 h-3.5", color)} />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{title}</span>
         </div>
         <p className="text-sm font-black uppercase italic tracking-tighter text-white">{value}</p>
      </div>
   );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

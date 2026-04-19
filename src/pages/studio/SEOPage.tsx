import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Search, Sparkles, FileText, Youtube, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateMetadata, generateYouTubeDescription } from '@/services/geminiService';
import { cn } from '@/lib/utils';

export function SEOPage() {
  const [isLikedMeta, setIsLikedMeta] = React.useState(false);
  const [isLikedDesc, setIsLikedDesc] = React.useState(false);
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
    const metadata = await generateMetadata(generatedScript, selectedModel);
    setGeneratedMetadata(metadata);
    setIsGeneratingMetadata(false);
  };

  const handleGenerateDescription = async () => {
    if (!generatedScript) return;
    setIsGeneratingDescription(true);
    const description = await generateYouTubeDescription(generatedScript, selectedModel);
    setGeneratedDescription(description);
    setIsGeneratingDescription(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-cyan-50 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <Search className="w-6 h-6 text-cyan-400" />
          YouTube SEO & Metadata
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Metadata Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Titles & Tags
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full transition-all duration-300",
                  isLikedMeta ? "text-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-[#0a0a0a]"
                )}
                onClick={() => setIsLikedMeta(!isLikedMeta)}
              >
                <Heart className={cn("w-4 h-4", isLikedMeta && "fill-current")} />
              </Button>
              <Button 
                variant="outline" size="sm" 
                className="h-8 text-[10px] font-black uppercase tracking-widest border-zinc-800 bg-[#0a0a0a]/50 hover:bg-cyan-500/10 hover:text-cyan-400"
                onClick={handleGenerateMetadata}
                disabled={isGeneratingMetadata || !generatedScript}
              >
                {isGeneratingMetadata ? (
                  <div className="w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-2" />
                )}
                {isGeneratingMetadata ? 'Optimizing...' : 'Generate SEO'}
              </Button>
            </div>
          </div>
          <Card className="bg-[#050505]/50 border border-cyan-500/10 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <FileText className="w-24 h-24 text-cyan-500" />
            </div>
            <ScrollArea className="h-[550px] w-full p-0">
              <div className="p-8">
                {isGeneratingMetadata ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-cyan-700">
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                    <p className="font-sans font-medium uppercase tracking-[0.2em] text-[10px]">Optimizing for YouTube...</p>
                  </div>
                ) : generatedMetadata ? (
                  <div className="prose prose-invert prose-cyan max-w-none animate-in fade-in duration-700 prose-h1:text-cyan-400 prose-strong:text-cyan-300">
                    <ReactMarkdown>{generatedMetadata}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                    <Search className="w-12 h-12 mb-4 opacity-10" />
                    <p className="font-sans font-bold uppercase tracking-widest text-[10px]">Generate SEO metadata to boost reach.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* YouTube Description Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
              <Youtube className="w-4 h-4" /> Video Description
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-full transition-all duration-300",
                  isLikedDesc ? "text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "text-zinc-600 hover:text-fuchsia-400 hover:bg-[#0a0a0a]"
                )}
                onClick={() => setIsLikedDesc(!isLikedDesc)}
              >
                <Heart className={cn("w-4 h-4", isLikedDesc && "fill-current")} />
              </Button>
              <Button 
                variant="outline" size="sm" 
                className="h-8 text-[10px] font-black uppercase tracking-widest border-zinc-800 bg-[#0a0a0a]/50 hover:bg-fuchsia-500/10 hover:text-fuchsia-400"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription || !generatedScript}
              >
                {isGeneratingDescription ? (
                  <div className="w-3 h-3 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mr-2" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-2" />
                )}
                {isGeneratingDescription ? 'Writing...' : 'Generate Description'}
              </Button>
            </div>
          </div>
          <Card className="bg-[#050505]/50 border border-fuchsia-500/10 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Youtube className="w-24 h-24 text-fuchsia-500" />
            </div>
            <ScrollArea className="h-[550px] w-full p-0">
              <div className="p-8">
                {isGeneratingDescription ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-fuchsia-700">
                    <div className="w-8 h-8 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
                    <p className="font-sans font-medium uppercase tracking-[0.2em] text-[10px]">Writing your description...</p>
                  </div>
                ) : generatedDescription ? (
                  <div className="prose prose-invert prose-fuchsia max-w-none animate-in fade-in duration-700 prose-h1:text-fuchsia-400 prose-strong:text-fuchsia-300">
                    <ReactMarkdown>{generatedDescription}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                    <Youtube className="w-12 h-12 mb-4 opacity-10" />
                    <p className="font-sans font-bold uppercase tracking-widest text-[10px]">Generate a professional YouTube description.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Search, Sparkles, FileText, Youtube } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateMetadata, generateYouTubeDescription } from '@/services/geminiService';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Search className="w-5 h-5 text-red-500" />
          YouTube SEO & Metadata
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Metadata Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Titles & Tags
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-[10px] border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
              onClick={handleGenerateMetadata}
              disabled={isGeneratingMetadata || !generatedScript}
            >
              {isGeneratingMetadata ? (
                <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              {isGeneratingMetadata ? 'Optimizing...' : 'Generate SEO'}
            </Button>
          </div>
          <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
            <ScrollArea className="h-[500px] w-full p-6">
              <div className="prose prose-invert prose-red max-w-none">
                {isGeneratingMetadata ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                    <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4" />
                    <p>Optimizing for YouTube...</p>
                  </div>
                ) : generatedMetadata ? (
                  <ReactMarkdown>{generatedMetadata}</ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p>Generate SEO metadata to see it here.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* YouTube Description Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Youtube className="w-4 h-4" />
              Video Description
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-[10px] border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400"
              onClick={handleGenerateDescription}
              disabled={isGeneratingDescription || !generatedScript}
            >
              {isGeneratingDescription ? (
                <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-1" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              {isGeneratingDescription ? 'Writing...' : 'Generate Description'}
            </Button>
          </div>
          <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
            <ScrollArea className="h-[500px] w-full p-6">
              <div className="prose prose-invert prose-red max-w-none">
                {isGeneratingDescription ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                    <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4" />
                    <p>Writing your description...</p>
                  </div>
                ) : generatedDescription ? (
                  <ReactMarkdown>{generatedDescription}</ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
                    <Youtube className="w-12 h-12 mb-4 opacity-20" />
                    <p>Generate a YouTube description to see it here.</p>
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

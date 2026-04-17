import React from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, 
  Youtube, 
  Target, 
  Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudioModulePanel } from '@/components/studio/core/StudioModulePanel';

interface SEOTerminalProps {
  generatedMetadata: string | null;
  generatedDescription: string | null;
  isGeneratingMetadata: boolean;
  isGeneratingDescription: boolean;
  hasScript: boolean;
  onGenerateMetadata: () => void;
  onGenerateDescription: () => void;
}

export function SEOPanel({
  generatedMetadata,
  generatedDescription,
  isGeneratingMetadata,
  isGeneratingDescription,
  hasScript,
  onGenerateMetadata,
  onGenerateDescription
}: SEOTerminalProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <StudioModulePanel
        title="AI Metadata"
        subtitle="Strategic Tagging"
        icon={<FileText className="w-5 h-5" />}
        height="h-[550px]"
        actions={
          <Button 
              onClick={onGenerateMetadata}
              disabled={!hasScript || isGeneratingMetadata}
              className="h-10 px-6 rounded-xl bg-zinc-900 text-white border border-white/5 hover:bg-zinc-800 transition-all font-black uppercase tracking-widest text-[9px]"
            >
              {isGeneratingMetadata ? <div className="w-4 h-4 border-2 border-white/20 border-t-amber-500 rounded-full animate-spin mr-3" /> : <Target className="w-3.5 h-3.5 mr-3" />}
              Metadata
          </Button>
        }
      >
        {generatedMetadata ? (
          <div className="prose prose-invert prose-amber max-w-none text-[11px] animate-in fade-in slide-in-from-bottom-2 duration-500">
             <ReactMarkdown>{generatedMetadata}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-zinc-500 py-32">
             <Shield className="w-12 h-12 mb-4 text-zinc-800" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Generation</p>
          </div>
        )}
      </StudioModulePanel>

      <StudioModulePanel
        title="Social Description"
        subtitle="Viral Architecture"
        icon={<Youtube className="w-5 h-5" />}
        height="h-[550px]"
        actions={
          <Button 
              onClick={onGenerateDescription}
              disabled={!hasScript || isGeneratingDescription}
              className="h-10 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-[9px] shadow-2xl"
            >
              {isGeneratingDescription ? <div className="w-4 h-4 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mr-3" /> : <Youtube className="w-3.5 h-3.5 mr-3" />}
              Gen Description
          </Button>
        }
      >
        {generatedDescription ? (
          <div className="prose prose-invert prose-red max-w-none text-[11px] animate-in fade-in slide-in-from-bottom-2 duration-500">
             <ReactMarkdown>{generatedDescription}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-zinc-500 py-32">
             <Youtube className="w-12 h-12 mb-4 text-zinc-800" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Generation</p>
          </div>
        )}
      </StudioModulePanel>
    </div>
  );
}

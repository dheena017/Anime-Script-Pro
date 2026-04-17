import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Camera, Box } from 'lucide-react';
import { StudioModulePanel } from '@/components/studio/core/StudioModulePanel';

interface PromptsTerminalProps {
  generatedImagePrompts: string | null;
}

export function PromptsPanel({ generatedImagePrompts }: PromptsTerminalProps) {
  return (
    <StudioModulePanel
      title="Prompt Terminal"
      subtitle="Neural Draft Output"
      icon={<Camera className="w-5 h-5" />}
    >
      {generatedImagePrompts ? (
        <div className="prose prose-invert prose-purple max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="p-8 rounded-[32px] bg-purple-600/5 border border-purple-500/10 shadow-2xl">
              <ReactMarkdown>{generatedImagePrompts}</ReactMarkdown>
           </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
           <div className="relative mb-8 group">
              <div className="absolute -inset-10 bg-purple-600/10 rounded-full blur-[40px] animate-pulse" />
              <div className="relative w-24 h-24 rounded-[32px] bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:bg-purple-600/10 active:scale-95">
                 <Box className="w-10 h-10 text-zinc-500 group-hover:text-purple-500 transition-colors" />
              </div>
           </div>
           <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-3">Awaiting Narrative Input</h3>
           <p className="text-sm text-zinc-500 font-medium italic max-w-xs leading-relaxed mx-auto">
              Initialize the synthesis process to generate high-fidelity visual prompts for production.
           </p>
        </div>
      )}
    </StudioModulePanel>
  );
}

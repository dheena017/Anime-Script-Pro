import React from 'react';
import { Eye, Zap, Sparkles } from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateImagePrompts } from '@/services/geminiService';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { PromptsTopBar } from '@/components/studio/modules/prompts/PromptsTopBar';
import { PromptsPanel } from '@/components/studio/modules/prompts/PromptsPanel';

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
    <PromptsTopBar
      onGenerate={handleGenerate}
      isLoading={isGeneratingImagePrompts}
      disabled={!generatedScript}
    >
      <div className="grid grid-cols-1 gap-8">
        <PromptsPanel generatedImagePrompts={generatedImagePrompts} />
      </div>

      {generatedImagePrompts && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <AspectCard icon={Eye} title="Compositional Logic" description="Optimized camera angles and framing metadata." color="text-purple-500" />
            <AspectCard icon={Zap} title="Lighting Specs" description="Detailed atmospheric and technical lighting data." color="text-amber-500" />
            <AspectCard icon={Sparkles} title="Visual Continuity" description="Ensuring consistent style across all production scenes." color="text-blue-500" />
         </div>
      )}
    </PromptsTopBar>
  );
}

function AspectCard({ icon: Icon, title, description, color }: { icon: any; title: string, description: string, color: string }) {
   return (
      <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 group hover:border-purple-600/20 transition-all shadow-xl">
         <div className={`w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner ${color}`}>
            <Icon className="w-6 h-6" />
         </div>
         <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-200 mb-3 italic">{title}</h4>
         <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">{description}</p>
      </div>
   );
}

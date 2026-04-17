import React from 'react';
import { Search, Sparkles, BarChart3, Cpu } from 'lucide-react';
import { useGenerator } from '@/contexts/GeneratorContext';
import { generateMetadata, generateYouTubeDescription } from '@/services/geminiService';
import { handleFirestoreError, OperationType } from '@/lib/error-utils';
import { SEOTopBar } from '@/components/studio/modules/seo/SEOTopBar';
import { SEOPanel } from '@/components/studio/modules/seo/SEOPanel';

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
    <SEOTopBar>
      <SEOPanel
        generatedMetadata={generatedMetadata}
        generatedDescription={generatedDescription}
        isGeneratingMetadata={isGeneratingMetadata}
        isGeneratingDescription={isGeneratingDescription}
        hasScript={Boolean(generatedScript)}
        onGenerateMetadata={handleGenerateMetadata}
        onGenerateDescription={handleGenerateDescription}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
         <MetricBox title="Discoverability" value="HIGH" icon={Search} color="text-emerald-500" />
         <MetricBox title="Engagement" value="OPTIMIZED" icon={BarChart3} color="text-amber-500" />
         <MetricBox title="Neural Model" value="GEMINI 3.1" icon={Cpu} color="text-red-500" />
         <MetricBox title="Context Size" value="2M" icon={Sparkles} color="text-blue-500" />
      </div>
    </SEOTopBar>
  );
}

function MetricBox({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
   return (
      <div className="p-8 rounded-[32px] bg-zinc-950 border border-white/5 shadow-xl group hover:border-white/10 transition-all">
         <div className="flex items-center gap-3 mb-4">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">{title}</span>
         </div>
         <p className="text-xl font-black uppercase italic tracking-tighter text-white">{value}</p>
      </div>
   );
}

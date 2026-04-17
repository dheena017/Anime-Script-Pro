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

// MetricBox is now imported from components/studio/seo/MetricBox
import { MetricBox } from '@/components/studio/seo/MetricBox';

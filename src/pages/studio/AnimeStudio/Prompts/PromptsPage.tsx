import { useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGenerator } from '@/hooks/useGenerator';
import { generateImagePrompts } from '@/services/api/gemini';
import { cn } from '@/lib/utils';

// Context
import { PromptsContext } from './PromptsLayout';

// Tabs
import { PromptsTab } from './Tabs/PromptsTabs';
import { ImagePromptsTab } from './Tabs/ImagePromptsTab';
import { MotionPromptsTab } from './Tabs/MotionPromptsTab';
import { StylePromptsTab } from './Tabs/StylePromptsTab';
import { NegativePromptsTab } from './Tabs/NegativePromptsTab';

export function PromptsPage() {
  const { activeTab } = useOutletContext<{ activeTab: PromptsTab }>();
  const { setHandlers } = useContext(PromptsContext);

  const {
    generatedImagePrompts, setGeneratedImagePrompts,
    isGeneratingImagePrompts, setIsGeneratingImagePrompts,
    generatedScript, selectedModel, showNotification,
    stopGeneration
  } = useGenerator();

  const handleGenerate = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating image prompts.', 'error');
      return;
    }
    setIsGeneratingImagePrompts(true);
    try {
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
      showNotification?.('Image prompts generated successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Failed to generate prompts: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  useEffect(() => {
    setHandlers({
      handleGenerate
    });
  }, [generatedScript, selectedModel]);

  const renderTabContent = () => {
    if (isGeneratingImagePrompts) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-12">
          <div className="relative">
            <div className="w-20 h-20 border-2 border-studio/20 border-t-studio rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
            <div className="absolute inset-0 m-auto w-2 h-2 bg-studio rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="font-black tracking-[0.3em] text-[12px] uppercase text-studio animate-pulse italic">Designing Visual Prompts...</p>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Bridging narrative with neural imagery</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={stopGeneration}
              className="mt-6 bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black font-black uppercase tracking-widest text-[9px] rounded-full px-8 h-10 transition-all duration-500"
            >
              Terminate Synthesis
            </Button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'image':
        return (
          <ImagePromptsTab
            content={generatedImagePrompts}
            isGenerating={isGeneratingImagePrompts}
            onGenerate={handleGenerate}
          />
        );
      case 'video':
        return <MotionPromptsTab />;
      case 'style':
        return <StylePromptsTab />;
      case 'negative':
        return <NegativePromptsTab />;
      default:
        return (
          <ImagePromptsTab
            content={generatedImagePrompts}
            isGenerating={isGeneratingImagePrompts}
            onGenerate={handleGenerate}
          />
        );
    }
  };

  return (
    <div data-testid="marker-ai-image-prompts">
      <Card className={cn(
        "bg-[#030303] overflow-hidden rounded-[2.5rem] relative group/card transition-all duration-700",
        "border-studio/20 shadow-[0_0_40px_rgba(6,182,212,0.08)] hover:border-studio/40"
      )}>
        <div className="absolute inset-0 border-[1px] border-white/5 rounded-[2.5rem] pointer-events-none group-hover/card:border-white/10 transition-colors duration-700" />

        <div className="w-full p-0">
          <div className="p-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}





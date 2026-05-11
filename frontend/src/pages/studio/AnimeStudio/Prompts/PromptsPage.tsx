import { useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
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

import { promptsStyles as s } from './promptsStyles';

export function PromptsPage() {
  const { activeTab } = useOutletContext<{ activeTab: PromptsTab }>();
  const { setHandlers } = useContext(PromptsContext);

  const {
    generatedImagePrompts,
    isGeneratingImagePrompts,
    generatedScript, selectedModel
  } = useGeneratorState();
  const {
    setGeneratedImagePrompts,
    setIsGeneratingImagePrompts,
    showNotification,
    stopGeneration
  } = useGeneratorDispatch();

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
              className={cn(s.header.actionButtonDanger, "mt-6 h-10 px-8 rounded-full")}
            >
              Terminate Synthesis
            </Button>
          </div>
        </div>
      );
    }

    3
    switch (activeTab) {
      case 'image':
        return (
          <ImagePromptsTab
            content={generatedImagePrompts}
            isGenerating={isGeneratingImagePrompts}
            onGenerate={handleGenerate}
          />
        );
      case 'motion':
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
      <Card className={s.page.mainCard}>
        <div className={s.page.innerBorder} />

        <div className="w-full p-0">
          <div className={s.page.contentWrapper}>
            {renderTabContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}





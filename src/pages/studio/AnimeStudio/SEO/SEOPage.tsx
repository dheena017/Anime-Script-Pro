import { useContext, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { useSEOState, useSEODispatch, useEngineState } from '@/contexts/generator';
import {
  generateMetadata,
  generateYouTubeDescription,
  generateAltTexts,
  generateDistributionStrategy
} from '@/services/api/gemini';
import { GrowthTab } from './Tabs/GrowthTab';
import { cn } from '@/lib/utils';
import { growthApi } from '@/services/api/growth';
import { MOCK_STORY_BIBLE } from '@/services/generators/mockData';
import { Sparkles, Globe2, Film } from 'lucide-react';

// Context
import { SEOContext } from './SEOLayout';

// Tabs
import { SEOTab } from './Tabs/SEOTabs';
import { KeywordsTab } from './Tabs/KeywordsTab';
import { DescriptionTab } from './Tabs/DescriptionTab';
import { AltTextTab } from './Tabs/AltTextTab';
import { TagsTab } from './Tabs/TagsTab';
import { DistributionTab } from './Tabs/DistributionTab';
import { SEOLoadingPage } from './components/SEOLoadingPage';
import { SEOEmptyState } from './components/SEOEmptyState';

export function SEOPage() {
  const { activeTab } = useOutletContext<{ activeTab: SEOTab }>();
  const { setHandlers } = useContext(SEOContext);

  const {
    generatedScript, showNotification
  } = useGenerator();

  const {
    generatedMetadata, generatedDescription, generatedAltText,
    generatedGrowthStrategy, generatedDistributionPlan,
    isGeneratingMetadata, isGeneratingDescription, isGeneratingAltText,
    isGeneratingGrowthStrategy, isGeneratingDistribution
  } = useSEOState();

  const {
    setGeneratedMetadata, setGeneratedDescription, setGeneratedAltText,
    setGeneratedGrowthStrategy, setGeneratedDistributionPlan,
    setIsGeneratingMetadata, setIsGeneratingDescription, setIsGeneratingAltText,
    setIsGeneratingGrowthStrategy, setIsGeneratingDistribution
  } = useSEODispatch();

  const { selectedModel } = useEngineState();

  const handleGenerateMetadata = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating metadata.', 'error');
      return;
    }
    setIsGeneratingMetadata(true);
    try {
      const metadata = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(metadata);
      showNotification?.('Keywords generated successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Failed to generate keywords: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating a description.', 'error');
      return;
    }
    setIsGeneratingDescription(true);
    try {
      const description = await generateYouTubeDescription(generatedScript, selectedModel);
      setGeneratedDescription(description);
      showNotification?.('Description generated successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Failed to generate description: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateAltText = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating alt texts.', 'error');
      return;
    }
    setIsGeneratingAltText(true);
    try {
      const altText = await generateAltTexts(generatedScript, selectedModel);
      setGeneratedAltText(altText);
      showNotification?.('Alt texts generated successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Failed to generate alt texts: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingAltText(false);
    }
  };

  const handleGenerateGrowthStrategy = async (strategyId?: number) => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating a growth strategy.', 'error');
      return;
    }

    if (!strategyId) {
      setGeneratedGrowthStrategy(null);
      return;
    }

    setIsGeneratingGrowthStrategy(true);
    try {
      const result = await growthApi.generateStrategy(strategyId, generatedScript, selectedModel);
      setGeneratedGrowthStrategy(result.content);
      showNotification?.('YouTube growth strategy created successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Failed to generate growth strategy: ' + (error.response?.data?.detail || error.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingGrowthStrategy(false);
    }
  };

  const handleGenerateDistribution = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating a distribution plan.', 'error');
      return;
    }
    setIsGeneratingDistribution(true);
    try {
      const plan = await generateDistributionStrategy(generatedScript, selectedModel);
      setGeneratedDistributionPlan(plan);
      showNotification?.('Distribution plan created successfully!', 'success');
    } catch (error: any) {
      console.error(error);
      showNotification?.('Failed to generate distribution plan: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingDistribution(false);
    }
  };

  useEffect(() => {
    setHandlers({
      handleGenerateMetadata,
      handleGenerateDescription,
      handleGenerateAltText,
      handleGenerateGrowthStrategy,
      handleGenerateDistribution
    });
  }, [generatedScript, selectedModel]);

  const getLoadingMessage = () => {
    switch (activeTab) {
      case 'keywords': return "Synthesizing Keyword Atlas...";
      case 'description': return "Crafting Narrative Descriptions...";
      case 'alt-texts': return "Generating Visual Meta-Data...";
      case 'tags': return "Mapping Production Tags...";
      case 'distribution': return "Architecting Distribution Plan...";
      case 'growth': return "Formulating Growth Strategy...";
      default: return "Computing SEO Analytics...";
    }
  };

  const renderTabContent = () => {
    const isAnyGenerating = isGeneratingMetadata || isGeneratingDescription || isGeneratingAltText || isGeneratingGrowthStrategy || isGeneratingDistribution;

    if (isAnyGenerating) {
      return (
        <SEOLoadingPage 
          message={getLoadingMessage()} 
          subtext="AI model is optimizing episodic reach"
        />
      );
    }

    if (!generatedScript) {
      return (
        <SEOEmptyState 
          onLaunch={() => {
            window.dispatchEvent(new CustomEvent('studio-generate-seo'));
          }}
          isGenerating={isAnyGenerating}
        />
      );
    }

    switch (activeTab) {
      case 'keywords':
        return (
          <KeywordsTab
            content={generatedMetadata}
            isGenerating={isGeneratingMetadata}
            onGenerate={handleGenerateMetadata}
          />
        );
      case 'description':
        return (
          <DescriptionTab
            content={generatedDescription}
            isGenerating={isGeneratingDescription}
            onGenerate={handleGenerateDescription}
          />
        );
      case 'alt-texts':
        return (
          <AltTextTab
            content={generatedAltText}
            isGenerating={isGeneratingAltText}
            onGenerate={handleGenerateAltText}
          />
        );
      case 'tags':
        return (
          <TagsTab
            content={generatedMetadata}
            isGenerating={isGeneratingMetadata}
            onGenerate={handleGenerateMetadata}
          />
        );
      case 'distribution':
        return (
          <DistributionTab
            content={generatedDistributionPlan}
            isGenerating={isGeneratingDistribution}
            onGenerate={handleGenerateDistribution}
          />
        );
      case 'growth':
        return (
          <GrowthTab
            content={generatedGrowthStrategy}
            isGenerating={isGeneratingGrowthStrategy}
            onGenerate={handleGenerateGrowthStrategy}
          />
        );
      default:
        return (
          <KeywordsTab
            content={generatedMetadata}
            isGenerating={isGeneratingMetadata}
            onGenerate={handleGenerateMetadata}
          />
        );
    }
  };

  return (
    <div data-testid="marker-seo-nexus">
      <div className="mb-6 grid gap-4 rounded-[2rem] border border-studio/20 bg-studio/5 p-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.35em] text-studio">
            <Sparkles className="w-4 h-4" />
            Shared story bible
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            SEO aligned to {MOCK_STORY_BIBLE.worldName}
          </h2>
          <p className="max-w-3xl text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            {MOCK_STORY_BIBLE.logline}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
            <Globe2 className="mx-auto mb-2 h-4 w-4 text-studio" />
            {MOCK_STORY_BIBLE.worldName}
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
            <Film className="mx-auto mb-2 h-4 w-4 text-fuchsia-400" />
            {MOCK_STORY_BIBLE.visualPalette}
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
            <Sparkles className="mx-auto mb-2 h-4 w-4 text-emerald-400" />
            {MOCK_STORY_BIBLE.theme}
          </div>
        </div>
      </div>

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





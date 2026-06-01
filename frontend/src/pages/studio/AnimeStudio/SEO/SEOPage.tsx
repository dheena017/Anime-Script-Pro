import { useContext, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import {
  useSEOState,
  useSEODispatch,
  useEngineState,
} from "@/contexts/generator";
import {
  generateMetadata,
  generateYouTubeDescription,
  generateAltTexts,
  generateDistributionStrategy,
} from "@/services/api/gemini";
import { GrowthTab } from "./Tabs/GrowthTab";
import { cn } from "@/lib/utils";
import { growthApi } from "@/services/api/growth";
import { MOCK_STORY_BIBLE } from "@/services/generators/mockData";
import { Sparkles, Globe2, Film } from "lucide-react";

// Context
import { SEOContext } from "./SEOLayout";

// Tabs
import { SEOTab } from "./Tabs/SEOTabs";
import { KeywordsTab } from "./Tabs/KeywordsTab";
import { DescriptionTab } from "./Tabs/DescriptionTab";
import { AltTextTab } from "./Tabs/AltTextTab";
import { TagsTab } from "./Tabs/TagsTab";
import { DistributionTab } from "./Tabs/DistributionTab";
import { SEOLoadingPage } from "./components/SEOLoadingPage";
import { SEOEmptyState } from "./components/SEOEmptyState";
import { AIPromptViewer } from "./components/AIPromptViewer";

import { seoStyles as s } from "./seoStyles";

export function SEOPage() {
  const { activeTab } = useOutletContext<{ activeTab: SEOTab }>();
  const { setHandlers } = useContext(SEOContext);

  const { generatedScript, contentType } = useGeneratorState();
  const { showNotification, loadDemoProject } = useGeneratorDispatch();

  const {
    generatedMetadata,
    generatedDescription,
    generatedAltText,
    generatedGrowthStrategy,
    generatedDistributionPlan,
    isGeneratingMetadata,
    isGeneratingDescription,
    isGeneratingAltText,
    isGeneratingGrowthStrategy,
    isGeneratingDistribution,
  } = useSEOState();

  const {
    setGeneratedMetadata,
    setGeneratedDescription,
    setGeneratedAltText,
    setGeneratedGrowthStrategy,
    setGeneratedDistributionPlan,
    setIsGeneratingMetadata,
    setIsGeneratingDescription,
    setIsGeneratingAltText,
    setIsGeneratingGrowthStrategy,
    setIsGeneratingDistribution,
  } = useSEODispatch();

  const { selectedModel } = useEngineState();

  const handleGenerateMetadata = async () => {
    if (!generatedScript) {
      showNotification?.(
        "Please write a script first before generating metadata.",
        "error",
      );
      return;
    }
    setIsGeneratingMetadata(true);
    try {
      const metadata = await generateMetadata(generatedScript, selectedModel);
      setGeneratedMetadata(metadata);
      showNotification?.("Keywords generated successfully!", "success");
    } catch (error: any) {
      console.error(error);
      showNotification?.(
        "Failed to generate keywords: " + (error.message || "Unknown error"),
        "error",
      );
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!generatedScript) {
      showNotification?.(
        "Please write a script first before generating a description.",
        "error",
      );
      return;
    }
    setIsGeneratingDescription(true);
    try {
      const description = await generateYouTubeDescription(
        generatedScript,
        selectedModel,
      );
      setGeneratedDescription(description);
      showNotification?.("Description generated successfully!", "success");
    } catch (error: any) {
      console.error(error);
      showNotification?.(
        "Failed to generate description: " + (error.message || "Unknown error"),
        "error",
      );
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateAltText = async () => {
    if (!generatedScript) {
      showNotification?.(
        "Please write a script first before generating alt texts.",
        "error",
      );
      return;
    }
    setIsGeneratingAltText(true);
    try {
      const altText = await generateAltTexts(generatedScript, selectedModel);
      setGeneratedAltText(altText);
      showNotification?.("Alt texts generated successfully!", "success");
    } catch (error: any) {
      console.error(error);
      showNotification?.(
        "Failed to generate alt texts: " + (error.message || "Unknown error"),
        "error",
      );
    } finally {
      setIsGeneratingAltText(false);
    }
  };

  const handleGenerateGrowthStrategy = async (strategyId?: number) => {
    if (!generatedScript) {
      showNotification?.(
        "Please write a script first before generating a growth strategy.",
        "error",
      );
      return;
    }

    if (!strategyId) {
      setGeneratedGrowthStrategy(null);
      return;
    }

    setIsGeneratingGrowthStrategy(true);
    try {
      const result = await growthApi.generateStrategy(
        strategyId,
        generatedScript,
        selectedModel,
      );
      setGeneratedGrowthStrategy(result.content);
      showNotification?.(
        "YouTube growth strategy created successfully!",
        "success",
      );
    } catch (error: any) {
      console.error(error);
      showNotification?.(
        "Failed to generate growth strategy: " +
          (error.response?.data?.detail || error.message || "Unknown error"),
        "error",
      );
    } finally {
      setIsGeneratingGrowthStrategy(false);
    }
  };

  const handleGenerateDistribution = async () => {
    if (!generatedScript) {
      showNotification?.(
        "Please write a script first before generating a distribution plan.",
        "error",
      );
      return;
    }
    setIsGeneratingDistribution(true);
    try {
      const plan = await generateDistributionStrategy(
        generatedScript,
        selectedModel,
      );
      setGeneratedDistributionPlan(plan);
      showNotification?.("Distribution plan created successfully!", "success");
    } catch (error: any) {
      console.error(error);
      showNotification?.(
        "Failed to generate distribution plan: " +
          (error.message || "Unknown error"),
        "error",
      );
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
      handleGenerateDistribution,
    });
  }, [generatedScript, selectedModel]);

  const getLoadingMessage = () => {
    switch (activeTab) {
      case "keywords":
        return "Synthesizing Keyword Atlas...";
      case "description":
        return "Crafting Narrative Descriptions...";
      case "alt":
        return "Generating Visual Meta-Data...";
      case "tags":
        return "Mapping Production Tags...";
      case "distribution":
        return "Architecting Distribution Plan...";
      case "growth":
        return "Formulating Growth Strategy...";
      default:
        return "Computing SEO Analytics...";
    }
  };

  const renderTabContent = () => {
    const isAnyGenerating =
      isGeneratingMetadata ||
      isGeneratingDescription ||
      isGeneratingAltText ||
      isGeneratingGrowthStrategy ||
      isGeneratingDistribution;

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
          onLoadDemo={loadDemoProject}
          onLaunch={() => {
            window.dispatchEvent(new CustomEvent("studio-generate-seo"));
          }}
          isGenerating={isAnyGenerating}
        />
      );
    }

    switch (activeTab) {
      case "keywords":
        return (
          <KeywordsTab
            content={generatedMetadata}
            isGenerating={isGeneratingMetadata}
            onGenerate={handleGenerateMetadata}
          />
        );
      case "description":
        return (
          <DescriptionTab
            content={generatedDescription}
            isGenerating={isGeneratingDescription}
            onGenerate={handleGenerateDescription}
          />
        );
      case "alt":
        return (
          <AltTextTab
            content={generatedAltText}
            isGenerating={isGeneratingAltText}
            onGenerate={handleGenerateAltText}
          />
        );
      case "tags":
        return (
          <TagsTab
            content={generatedMetadata}
            isGenerating={isGeneratingMetadata}
            onGenerate={handleGenerateMetadata}
          />
        );
      case "distribution":
        return (
          <DistributionTab
            content={generatedDistributionPlan}
            isGenerating={isGeneratingDistribution}
            onGenerate={handleGenerateDistribution}
          />
        );
      case "growth":
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
      <Card className={s.page.container}>
        <div className={s.page.innerBorder} />

        <div className={s.page.contentWrapper}>
          <div className={s.page.contentArea}>{renderTabContent()}</div>
        </div>
      </Card>

      <AIPromptViewer
        activeTab={activeTab}
        script={generatedScript}
        contentType={contentType || "Anime"}
      />
    </div>
  );
}

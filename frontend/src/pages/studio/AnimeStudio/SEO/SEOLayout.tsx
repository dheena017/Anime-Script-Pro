import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateMetadata } from '@/services/api/gemini';
import { useSEOState, useSEODispatch } from '@/contexts/generator';
import { SEOHeader } from './components/SEOHeader';
import { SEOToolbar } from './components/SEOToolbar';
import { SEOTabs, SEOTab } from './Tabs/SEOTabs';
import { SEOLoadingPage } from './components/SEOLoadingPage';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';
import { seoStyles as s } from './seoStyles';
import { growthApi } from '@/services/api/growth';

export const SEOContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function SEOLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as SEOTab) || 'keywords';
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedMetadata,
    isLoading,
    generatedScript,
    selectedModel,
    session,
    episode,
    contentType,
    currentScriptId,
    generationProgress,
    isEditing,
    isSaving
  } = useGeneratorState();
  const {
    setGeneratedMetadata,
    setIsLoading,
    showNotification,
    syncCore,
    setIsEditing,
    setGenerationProgress
  } = useGeneratorDispatch();

  const {
    setGeneratedDescription, setGeneratedAltText,
    setGeneratedDistributionPlan, setGeneratedGrowthStrategy
  } = useSEODispatch();

  const {
    generatedMetadata: localMetadata,
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

  const isGeneratingActive = React.useMemo(() => {
    switch (activeTab) {
      case 'keywords':
      case 'tags':
        return isGeneratingMetadata;
      case 'description':
        return isGeneratingDescription;
      case 'alt':
        return isGeneratingAltText;
      case 'distribution':
        return isGeneratingDistribution;
      case 'growth':
        return isGeneratingGrowthStrategy;
      default:
        return false;
    }
  }, [activeTab, isGeneratingMetadata, isGeneratingDescription, isGeneratingAltText, isGeneratingDistribution, isGeneratingGrowthStrategy]);

  const handleGenerateActive = React.useCallback(() => {
    switch (activeTab) {
      case 'keywords':
      case 'tags':
        handlers.handleGenerateMetadata?.();
        break;
      case 'description':
        handlers.handleGenerateDescription?.();
        break;
      case 'alt':
        handlers.handleGenerateAltText?.();
        break;
      case 'distribution':
        handlers.handleGenerateDistribution?.();
        break;
      case 'growth':
        handlers.handleGenerateGrowthStrategy?.();
        break;
    }
  }, [activeTab, handlers]);

  // Resolve active tab specific content
  const activeTabContent = React.useMemo(() => {
    switch (activeTab) {
      case 'keywords':
        return localMetadata;
      case 'description':
        return generatedDescription;
      case 'alt':
        return generatedAltText;
      case 'tags':
        if (!localMetadata) return null;
        try {
          const data = JSON.parse(localMetadata);
          const combined = [
            ...(data.primary_keywords || []),
            ...(data.secondary_keywords || [])
          ];
          return combined.join(', ');
        } catch (e) {
          return localMetadata;
        }
      case 'distribution':
        return generatedDistributionPlan;
      case 'growth':
        return generatedGrowthStrategy;
      default:
        return localMetadata;
    }
  }, [activeTab, localMetadata, generatedDescription, generatedAltText, generatedDistributionPlan, generatedGrowthStrategy]);

  useAuth();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const handleSave = async () => {
    await syncCore(projectId);
  };

  const handleGenerateAll = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating SEO data.', 'error');
      return;
    }
    
      setIsLoading(true);
      setGenerationProgress(5);
      try {
        // Clear existing data to show empty states for pending tabs
        setGeneratedMetadata(null);
        setGeneratedDescription(null);
        setGeneratedAltText(null);
        setGeneratedDistributionPlan(null);
        setGeneratedGrowthStrategy(null);
  
        const { generateYouTubeDescription, generateAltTexts, generateDistributionStrategy } = await import('@/services/api/gemini');
        
        // Step 1: Keywords & Tags
        setSearchParams({ tab: 'keywords' });
        console.log('[SEOLayout] Requesting metadata/keywords generation...');
        const metadata = await generateMetadata(generatedScript, selectedModel);
        setGeneratedMetadata(metadata);
        showNotification?.('Keywords and tags indexed.', 'success');
        setGenerationProgress(20);
        await new Promise(r => setTimeout(r, 1500));
  
        // Step 2: Description
        setSearchParams({ tab: 'description' });
        console.log('[SEOLayout] Requesting YouTube description generation...');
        const description = await generateYouTubeDescription(generatedScript, selectedModel);
        setGeneratedDescription(description);
        showNotification?.('Episodic description synthesized.', 'success');
        setGenerationProgress(40);
        await new Promise(r => setTimeout(r, 1500));
  
        // Step 3: Alt Text (fixed query tab from 'alt-texts' to 'alt')
        setSearchParams({ tab: 'alt' });
        console.log('[SEOLayout] Requesting alt texts generation...');
        const altText = await generateAltTexts(generatedScript, selectedModel);
        setGeneratedAltText(altText);
        showNotification?.('Accessibility alt texts generated.', 'success');
        setGenerationProgress(60);
        await new Promise(r => setTimeout(r, 1500));
  
        // Step 4: Distribution
        setSearchParams({ tab: 'distribution' });
        console.log('[SEOLayout] Requesting distribution strategy generation...');
        const dist = await generateDistributionStrategy(generatedScript, selectedModel);
        setGeneratedDistributionPlan(dist);
        showNotification?.('Distribution playbooks compiled.', 'success');
        setGenerationProgress(80);
        await new Promise(r => setTimeout(r, 1500));

        // Step 5: Growth strategy
        setSearchParams({ tab: 'growth' });
        console.log('[SEOLayout] Requesting growth strategy generation...');
        const strategies = await growthApi.getStrategies();
        if (strategies && strategies.length > 0) {
          const result = await growthApi.generateStrategy(strategies[0].id, generatedScript, selectedModel);
          setGeneratedGrowthStrategy(result.content);
        }
        showNotification?.('Tactical growth blueprints synchronized.', 'success');
        setGenerationProgress(100);
        await new Promise(r => setTimeout(r, 1500));
  
        showNotification?.('Full SEO Nexus synchronized!', 'success');
        setSearchParams({ tab: 'keywords' }); // Return to start
        
        // Reset progress after a short delay
        setTimeout(() => setGenerationProgress(0), 3000);
      } catch (e: any) {
        console.error('[SEOLayout] SEO synthesis failed:', e);
        showNotification?.('SEO synthesis failed: ' + (e.message || 'Error'), 'error');
        setGenerationProgress(0);
      } finally {
        setIsLoading(false);
      }
  };

  React.useEffect(() => {
    const handleGlobalGenerate = () => handleGenerateAll();
    window.addEventListener('studio-generate-seo', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-seo', handleGlobalGenerate);
  }, [handleGenerateAll]);

  const handleGenerate = handleGenerateAll;

  React.useEffect(() => {
    console.log(`[SEOLayout] Active tab changed to: ${activeTab.toUpperCase()}`);
  }, [activeTab]);

  const handleTabChange = (tab: SEOTab) => {
    setSearchParams({ tab });
  };

  return (
    <SEOContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <SEOHeader
            onRegenerate={handleGenerate}
            isGenerating={isLoading}
            onNext={() => {
              startTransition(() => {
                navigate(`/studio/prompts`);
              });
            }}
            onPrev={() => {
              startTransition(() => {
                navigate(`/studio/storyboard`);
              });
            }}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedMetadata}
            session={session}
            episode={episode}
          />
        </div>

        <div className={s.tabs.tabsBar}>
          <div className={s.tabs.tabsBarGlow} />
          <div className={s.tabs.tabsBarInner}>
            <SEOTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
          <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
        </div>

        {activeTabContent && !isLoading && (
          <div className="mb-8">
            <SEOToolbar
              status="active"
              activeTab={activeTab}
              session={session}
              episode={episode}
              content={activeTabContent}
              isEditing={isEditing}
              onEditingChange={setIsEditing}
              onGenerateActive={handleGenerateActive}
              isGeneratingActive={isGeneratingActive}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + location.search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><SEOLoadingPage tab={activeTab} progress={generationProgress} /></div>}>
                {isLoading ? (
                  <SEOLoadingPage tab={activeTab} progress={generationProgress} />
                ) : (
                  <Outlet context={{ activeTab }} />
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SEOContext.Provider>
  );
}

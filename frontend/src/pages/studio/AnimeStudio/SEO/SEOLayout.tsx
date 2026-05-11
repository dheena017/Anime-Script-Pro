import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateMetadata } from '@/services/api/gemini';
import { useSEODispatch } from '@/contexts/generator';
import { SEOHeader } from './components/SEOHeader';
import { SEOToolbar } from './components/SEOToolbar';
import { SEOTabs, SEOTab } from './Tabs/SEOTabs';
import { SEOLoadingPage } from './components/SEOLoadingPage';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';
import { seoStyles as s } from './seoStyles';

export const SEOContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function SEOLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setHandlers] = React.useState<any>({});

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
    setGeneratedDistributionPlan
  } = useSEODispatch();

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
  
        const { generateYouTubeDescription, generateAltTexts, generateDistributionStrategy } = await import('@/services/api/gemini');
        
        // Sequence SEO generations with Response and Report flow
        setSearchParams({ tab: 'keywords' });
        console.log('[SEOLayout] Requesting metadata/keywords generation...');
        const metadata = await generateMetadata(generatedScript, selectedModel);
        setGeneratedMetadata(metadata);
        console.log(`[SEOLayout] Metadata generated successfully. Response length: ${JSON.stringify(metadata)?.length || 0} chars.`);
        showNotification?.('Keywords indexed.', 'success');
        setGenerationProgress(25);
        await new Promise(r => setTimeout(r, 2000));
  
        setSearchParams({ tab: 'description' });
        console.log('[SEOLayout] Requesting YouTube description generation...');
        const description = await generateYouTubeDescription(generatedScript, selectedModel);
        setGeneratedDescription(description);
        console.log(`[SEOLayout] Description generated successfully. Response length: ${description?.length || 0} chars.`);
        showNotification?.('Description synthesized.', 'success');
        setGenerationProgress(50);
        await new Promise(r => setTimeout(r, 2000));
  
        setSearchParams({ tab: 'alt-texts' });
        console.log('[SEOLayout] Requesting alt texts generation...');
        const altText = await generateAltTexts(generatedScript, selectedModel);
        setGeneratedAltText(altText);
        console.log(`[SEOLayout] Alt texts generated successfully. Response length: ${altText?.length || 0} chars.`);
        showNotification?.('Alt texts generated.', 'success');
        setGenerationProgress(75);
        await new Promise(r => setTimeout(r, 2000));
  
        setSearchParams({ tab: 'distribution' });
        console.log('[SEOLayout] Requesting distribution strategy generation...');
        const dist = await generateDistributionStrategy(generatedScript, selectedModel);
        setGeneratedDistributionPlan(dist);
        console.log(`[SEOLayout] Distribution strategy generated successfully. Response length: ${dist?.length || 0} chars.`);
        showNotification?.('Distribution plan ready.', 'success');
        setGenerationProgress(100);
        await new Promise(r => setTimeout(r, 2000));
  
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

  const activeTab = (searchParams.get('tab') as SEOTab) || 'keywords';

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

        {generatedMetadata && !isLoading && (
          <div className="mb-8">
            <SEOToolbar
              status="active"
              session={session}
              episode={episode}
              content={JSON.stringify(generatedMetadata)}
              isEditing={isEditing}
              onEditingChange={setIsEditing}
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
              transition={{ duration: 0.2, ease: "easeOut" }}
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

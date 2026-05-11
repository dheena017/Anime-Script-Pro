import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EpisodePackager from './components/EpisodePackager';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useLogs } from '@/contexts/LogContext';
import { generateImagePrompts, generateVideoPrompts } from '@/services/api/gemini';
import { PromptsHeader } from './components/PromptsHeader';
import { PromptsToolbar } from './components/PromptsToolbar';
import { PromptsTabs, PromptsTab } from './Tabs/PromptsTabs';
import { PromptsLoadingPage } from './components/PromptsLoadingPage';
import { PromptsEmptyState } from './components/PromptsEmptyState';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';

export const PromptsContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function PromptsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedImagePrompts,
    videoData,
    isLoading,
    generatedScript, selectedModel, session, episode,
    isSaving,
    castProfiles, castData, generatedSeriesPlan, generatedMetadata,
    contentType,
    generationProgress,
    isEditing,
    currentScriptId
  } = useGeneratorState();
  const {
    setGeneratedImagePrompts,
    setVideoData,
    setIsLoading,
    showNotification,
    setIsSaving,
    setIsEditing,
    syncCore,
    setGenerationProgress
  } = useGeneratorDispatch();

  const { user } = useAuth();
  const { addLog } = useLogs();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const handleSave = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      console.warn('[PromptsLayout] Save skipped: user is not authenticated.');
      return;
    }

    setIsSaving(true);
    try {
      console.info('[PromptsLayout] Saving prompts content.', { projectId });
      addLog('SAVE', 'START', 'Saving prompts content...');
      const { productionApi } = await import('@/services/api/production');
      await productionApi.updateContent(user.id, {
        cast_profiles: castProfiles,
        cast_data: castData,
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata
      }, projectId);
      showNotification?.('Prompts saved successfully!', 'success');
      console.info('[PromptsLayout] Prompts saved successfully.', { projectId });
      addLog('SAVE', 'SUCCESS', 'Prompts saved successfully.');
    } catch (e) {
      console.error('[PromptsLayout] Manual save failed.', e);
      showNotification?.('Sync Error', 'error');
      addLog('SAVE', 'ERROR', `Prompts save failed: ${(e as any)?.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
  };


  // Generate both image and video prompts (all prompts modules)
  const handleGenerateAll = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating prompts.', 'error');
      return;
    }

    setIsLoading(true);
    setGenerationProgress(10);
    try {
      // Image prompts first (switch to image tab)
      setSearchParams({ tab: 'image' });
      console.log('[PromptsLayout] Requesting image prompts generation...');
      setGenerationProgress(40);
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts as any);
      console.log(`[PromptsLayout] Image prompts generated successfully. Response length: ${prompts?.length || 0} chars.`);
      showNotification?.('Image prompts synthesized.', 'success');
      setGenerationProgress(70);
      await new Promise((r) => setTimeout(r, 2000));

      // Then video prompts (switch to video tab)
      setSearchParams({ tab: 'video' });
      console.log('[PromptsLayout] Requesting video prompts generation...');
      const vprompts = await generateVideoPrompts(generatedScript, selectedModel);
      setVideoData(vprompts as any);
      console.log(`[PromptsLayout] Video prompts generated successfully. Response length: ${JSON.stringify(vprompts)?.length || 0} chars.`);
      showNotification?.('Video prompts synthesized.', 'success');
      setGenerationProgress(100);
      await new Promise((r) => setTimeout(r, 2000));

      showNotification?.('All prompts generated successfully!', 'success');
      // Reset progress after a short delay
      setTimeout(() => setGenerationProgress(0), 3000);
    } catch (e: any) {
      console.error('[PromptsLayout] Failed to generate prompts:', e);
      showNotification?.('Failed to generate prompts: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const activeTab = (searchParams.get('tab') as PromptsTab) || 'image';

  React.useEffect(() => {
    console.log(`[PromptsLayout] Active tab changed to: ${activeTab.toUpperCase()}`);
  }, [activeTab]);

  const handleTabChange = (tab: PromptsTab) => {
    setSearchParams({ tab });
  };

  return (
    <PromptsContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <PromptsHeader
            onRegenerate={handlers.handleGenerate || handleGenerateAll}
            isGenerating={handlers.isGenerating || isLoading}
            onNext={() => {
              startTransition(() => {
                navigate(`/studio/screening`);
              });
            }}
            onPrev={() => {
              startTransition(() => {
                navigate(`/studio/seo`);
              });
            }}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={activeTab === 'video' ? !!videoData : !!generatedImagePrompts}
            session={session}
            episode={episode}
          />
        </div>

        <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 w-full flex justify-center">
            <PromptsTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
          <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
        </div>

        {((activeTab === 'image' && generatedImagePrompts) || (activeTab === 'video' && videoData)) && !isLoading && !handlers.isGenerating && (
          <div className="mb-8">
            <PromptsToolbar
              status="active"
              session={session}
              episode={episode}
              content={activeTab === 'video' ? JSON.stringify(videoData) : generatedImagePrompts}
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
              <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><PromptsLoadingPage tab={activeTab} progress={generationProgress} /></div>}>
                {(handlers.isGenerating || isLoading) ? (
                  <PromptsLoadingPage tab={activeTab} progress={generationProgress} />
                ) : (!generatedImagePrompts && !videoData) ? (
                  <PromptsEmptyState 
                    onLaunch={handleGenerateAll}
                    isGenerating={isLoading}
                  />
                ) : (
                  <div className="flex-1 flex flex-col">
                    {activeTab === 'video' ? <EpisodePackager /> : <Outlet context={{ activeTab }} />}
                  </div>
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PromptsContext.Provider>
  );
}




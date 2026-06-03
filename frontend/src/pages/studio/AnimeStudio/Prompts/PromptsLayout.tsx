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
import { promptsStyles as s } from './promptsStyles';

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
    characterProfiles, characterData, generatedSeriesPlan, generatedMetadata,
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
    setGenerationProgress,
    loadDemoProject
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
      await syncCore(projectId);
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

      // Then video prompts (switch to motion tab)
      setSearchParams({ tab: 'motion' });
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

  const rawTab = searchParams.get('tab');
  const activeTab: PromptsTab =
    rawTab === 'image' || rawTab === 'motion' || rawTab === 'negative' || rawTab === 'style'
      ? rawTab
      : rawTab === 'video'
        ? 'motion'
        : 'image';

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
            hasContent={activeTab === 'motion' ? !!videoData : !!generatedImagePrompts}
            session={session}
            episode={episode}
          />
        </div>

        <div className={s.tabs.tabsBar}>
          <div className={s.tabs.tabsBarGlow} />
          <div className={s.tabs.tabsBarInner}>
            <PromptsTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
          <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
        </div>

        {((activeTab === 'image' && generatedImagePrompts) || (activeTab === 'motion' && videoData)) && !isLoading && !handlers.isGenerating && (
          <div className="mb-8">
            <PromptsToolbar
              status="active"
              session={session}
              episode={episode}
              content={activeTab === 'motion' ? JSON.stringify(videoData) : generatedImagePrompts}
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
              <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20 text-xs font-black uppercase tracking-[0.2em] text-cyan-500/40 animate-pulse">Loading...</div>}>
                {(!generatedImagePrompts && !videoData) ? (
                  <PromptsEmptyState 
                    onLaunch={handleGenerateAll}
                    onLoadDemo={loadDemoProject}
                    isGenerating={isLoading}
                  />
                ) : (
                  <div className="flex-1 flex flex-col">
                    {activeTab === 'motion' ? <EpisodePackager /> : <Outlet context={{ activeTab }} />}
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




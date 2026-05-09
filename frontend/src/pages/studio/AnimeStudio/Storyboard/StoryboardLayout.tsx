import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateImagePrompts } from '@/services/api/gemini';

import { StoryboardHeader } from './components/StoryboardHeader';
import { StoryboardToolbar } from './components/StoryboardToolbar';
import { StoryboardTabs, StoryboardTab } from './Tabs/StoryboardTabs';

import { StoryboardLoadingPage } from './components/StoryboardLoadingPage';
import { StoryboardEmptyState } from './components/StoryboardEmptyState';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';

export const StoryboardContext = React.createContext<{
  setHandlers: (handlers: any) => void;
}>({ setHandlers: () => { } });

export default function StoryboardLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    generatedScript,
    generatedImagePrompts,
    isGeneratingImagePrompts,
    selectedModel,
    isSaving,
    contentType,
    generationProgress,
    currentScriptId,
    session,
    episode,
    isEditing
  } = useGeneratorState();
  const {
    setGeneratedImagePrompts,
    setIsGeneratingImagePrompts,
    showNotification,
    syncCore,
    setIsEditing,
    setGenerationProgress
  } = useGeneratorDispatch();

  useAuth();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const handleSave = async () => {
    await syncCore(projectId);
  };

  const handleGenerate = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before creating your storyboard.', 'error');
      return;
    }
    setGenerationProgress(5);
    setIsGeneratingImagePrompts(true);
    console.log('[StoryboardLayout] Requesting image prompts generation...');
    try {
      setSearchParams({ tab: 'frames' });
      const prompts = await generateImagePrompts(generatedScript, selectedModel);
      setGeneratedImagePrompts(prompts);
      setGenerationProgress(30);
      console.log(`[StoryboardLayout] Image prompts generated successfully. Response length: ${prompts?.length || 0} chars.`);
      await new Promise(r => setTimeout(r, 2000));
      
      setSearchParams({ tab: 'angles' });
      setGenerationProgress(45);
      await new Promise(r => setTimeout(r, 2000));
      
      setSearchParams({ tab: 'composition' });
      setGenerationProgress(60);
      await new Promise(r => setTimeout(r, 2000));
      
      setSearchParams({ tab: 'animatic' });
      setGenerationProgress(75);
      await new Promise(r => setTimeout(r, 2000));
      
      setSearchParams({ tab: 'audio' });
      setGenerationProgress(90);
      await new Promise(r => setTimeout(r, 2000));
      
      setSearchParams({ tab: 'frames' });
      setGenerationProgress(100);
      showNotification?.('Full Storyboard Sequence Generated!', 'success');
      
      // Reset progress after a short delay
      setTimeout(() => setGenerationProgress(0), 3000);
    } catch (e: any) {
      console.error('[StoryboardLayout] Failed to generate visuals:', e);
      showNotification?.('Failed to generate visuals: ' + (e.message || 'Error'), 'error');
      setGenerationProgress(0);
    } finally {
      setIsGeneratingImagePrompts(false);
    }
  };

  const activeTab = (searchParams.get('tab') as StoryboardTab) || 'frames';

  const handleTabChange = (tab: StoryboardTab) => {
    setSearchParams({ tab });
  };

  React.useEffect(() => {
    console.log(`[StoryboardLayout] Active tab changed to: ${activeTab.toUpperCase()}`);
  }, [activeTab]);

  React.useEffect(() => {
    const handleGlobalGenerate = () => {
      console.log('[StoryboardLayout] Global storyboard generation event received.');
      if (handlers.handleGenerateAll) {
        handlers.handleGenerateAll();
      } else {
        handleGenerate();
      }
    };
    window.addEventListener('studio-generate-storyboard', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-storyboard', handleGlobalGenerate);
  }, [handlers.handleGenerateAll, handleGenerate]);

  return (
    <StoryboardContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <StoryboardHeader
            onRegenerate={handlers.handleGenerateAll || handleGenerate}
            isGenerating={handlers.isGenerating || isGeneratingImagePrompts}
            onNext={() => {
              navigate(`/projects/${projectId}/seo`);
            }}
            onPrev={() => {
              navigate(`/projects/${projectId}/script`);
            }}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedImagePrompts}
            session={session}
            episode={episode}
            progress={handlers.productionProgress}
          />
        </div>

        <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 w-full flex justify-center">
            <StoryboardTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
          <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
        </div>

        {/* Toolbar Section */}
        {generatedImagePrompts && (
          <div className="mb-8 relative z-30">
            <StoryboardToolbar
              status={generatedImagePrompts ? 'active' : 'empty'}
              session={session}
              episode={episode}
              content={generatedImagePrompts}
              onEnhanceNarration={handlers.handleEnhanceAllNarration}
              onEnhanceVisuals={handlers.handleEnhanceAllVisuals}
              isGlobalEnhancing={handlers.isGlobalEnhancing}
              onAddScene={handlers.handleAddScene}
              isEditing={isEditing}
              onEditingChange={setIsEditing}
            />
          </div>
        )}

        {(handlers.isGenerating || isGeneratingImagePrompts) ? (
          <StoryboardLoadingPage tab={activeTab} progress={generationProgress} />
        ) : !generatedImagePrompts ? (
          <StoryboardEmptyState 
            onLaunch={handleGenerate}
            isGenerating={isGeneratingImagePrompts}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet context={{ activeTab }} />
          </motion.div>
        )}
      </div>
    </StoryboardContext.Provider>
  );
}




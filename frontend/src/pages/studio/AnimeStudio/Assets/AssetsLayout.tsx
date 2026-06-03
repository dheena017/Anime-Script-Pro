import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { AssetsHeader } from '../components/Assets/AssetsHeader';  
import { generateMetadata, generateYouTubeDescription, generateImagePrompts } from '@/services/api/gemini';
import { AssetsLoadingPage } from './AssetsLoadingPage';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';

import { assetsStyles as s } from './assetsStyles';

export default function AssetsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = React.useState(false);

  const {
    generatedMetadata,
    generatedDescription,
    generatedImagePrompts,
    isGeneratingMetadata,
    isGeneratingDescription,
    isGeneratingImagePrompts,
    generatedScript, selectedModel, session, episode,
    contentType,
    generationProgress,
    isSaving, currentScriptId
  } = useGeneratorState();
  const {
    setGeneratedMetadata,
    setGeneratedDescription,
    setGeneratedImagePrompts,
    setIsGeneratingMetadata,
    setIsGeneratingDescription,
    setIsGeneratingImagePrompts,
    showNotification,
    setGenerationProgress,
    syncCore
  } = useGeneratorDispatch();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const handleSave = async () => {
    await syncCore(projectId);
  };

  const handleGenerateAll = async () => {
    if (!generatedScript) {
      showNotification?.('Please write a script first before generating assets.', 'error');
      return;
    }
    
    setGenerationProgress(10);
    setIsGeneratingMetadata(true);
    setIsGeneratingDescription(true);
    setIsGeneratingImagePrompts(true);
    console.log('[AssetsLayout] Requesting all assets generation (Metadata, Description, Image Prompts)...');

    try {
      const [meta, desc, prompts] = await Promise.all([
        generateMetadata(generatedScript, selectedModel),
        generateYouTubeDescription(generatedScript, selectedModel),
        generateImagePrompts(generatedScript, selectedModel)
      ]);
      
      setGeneratedMetadata(meta);
      setGenerationProgress(40);
      setGeneratedDescription(desc);
      setGenerationProgress(70);
      setGeneratedImagePrompts(prompts);
      setGenerationProgress(100);
      console.log(`[AssetsLayout] Assets generated successfully.`);
      showNotification?.('All assets generated successfully!', 'success');
      
      // Reset progress after a short delay
      setTimeout(() => setGenerationProgress(0), 3000);
    } catch (e: any) {
      console.error('[AssetsLayout] Failed to generate assets:', e);
      showNotification?.('Failed to generate assets: ' + (e.message || 'Error'), 'error');
      setGenerationProgress(0);
    } finally {
      setIsGeneratingMetadata(false);
      setIsGeneratingDescription(false);
      setIsGeneratingImagePrompts(false);
    }
  };

  React.useEffect(() => {
    const handleGlobalGenerate = () => {
      console.log('[AssetsLayout] Global assets generation event received.');
      handleGenerateAll();
    };
    window.addEventListener('studio-generate-assets', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-assets', handleGlobalGenerate);
  }, [handleGenerateAll]);


  return (
    <div className={s.container}>
      <div className="studio-module-header">
        <AssetsHeader 
          onRegenerate={handleGenerateAll}
          isGenerating={isGeneratingMetadata || isGeneratingDescription || isGeneratingImagePrompts}
          onPrev={() => {
            startTransition(() => {
              navigate(`/studio/screening`);
            });
          }}
          onNext={() => {
            startTransition(() => {
              navigate(`/studio/engine`);
            });
          }}
          onSave={handleSave}
          isSaving={isSaving}
          session={session}
          episode={episode}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          hasContent={!!generatedMetadata || !!generatedDescription || !!generatedImagePrompts}
        />
      </div>

      <div className={s.tabs.tabsBar}>
        <div className={s.tabs.tabsBarGlow} />
        <div className={s.tabs.tabsBarInner}>
          <div className="flex items-center gap-12">
            <div className={s.tabs.nexusBadge}>
              <Search className={s.tabs.nexusIcon} />
              <span className={s.tabs.nexusLabel}>Assets_Nexus</span>
            </div>
          </div>
        </div>
        <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
      </div>

      <div className="flex-1 flex flex-col min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20 text-xs font-black uppercase tracking-[0.2em] text-cyan-500/40 animate-pulse">Loading...</div>}>
              <Outlet context={{ onLaunch: handleGenerateAll }} />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

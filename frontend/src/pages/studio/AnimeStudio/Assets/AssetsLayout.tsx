import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { AssetsHeader } from '../components/Assets/AssetsHeader';  
import { generateMetadata, generateYouTubeDescription, generateImagePrompts } from '@/services/api/gemini';
import { AssetsLoadingPage } from './AssetsLoadingPage';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';

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
    <div className="space-y-6">
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

      <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 w-full flex justify-center">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3 px-4 py-2 bg-studio/10 border border-studio/20 rounded-xl">
              <Search className="w-4 h-4 text-studio" />
              <span className="text-[10px] font-black text-studio uppercase tracking-[0.2em]">Assets_Nexus</span>
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
            <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><AssetsLoadingPage progress={generationProgress} /></div>}>
              {(isGeneratingMetadata || isGeneratingDescription || isGeneratingImagePrompts) ? (
                <AssetsLoadingPage progress={generationProgress} />
              ) : (
                <Outlet context={{ onLaunch: handleGenerateAll }} />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { ScriptHeader } from './components/ScriptHeader';
import { ScriptToolbar } from './components/ScriptToolbar';
import { ScriptLoadingPage } from './components/ScriptLoadingPage';
import { generateScript, generateMetadata } from '@/services/api/gemini';
import { generateScriptStream } from '@/services/generators/script';
import { ScriptTabs, ScriptTab } from './Tabs/ScriptTabs';
import { studioLog, reportTabChange, reportGeneration } from '@/lib/studio-logger';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';
import { scriptStyles as s } from './scriptStyles';

export const ScriptContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function ScriptLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const { showNotification } = useApp();
  const {
    generatedScript, isLoading, prompt, tone, audience,
    session, episode, numScenes, selectedModel, contentType,
    recapperPersona, characterRelationships, generatedWorld,
    generatedCharacters, generatedSeriesPlan, isSaving, generatedMetadata,
    generationProgress, isEditing, currentScriptId,
    promptLore, promptPowers, promptFactions, promptArchitecture,
    promptAtlas, promptCulture, promptSystems
  } = useGeneratorState();

  const {
    setGeneratedScript,
    setGeneratedImagePrompts,
    setGeneratedMetadata,
    setIsLoading,
    setGenerationProgress,
    syncCore,
    setIsEditing,
    setEpisode
  } = useGeneratorDispatch();

  useAuth();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const handleSave = async () => {
    await syncCore(projectId);
  };

  const handleGenerateAll = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first to write a script.', 'error');
      return;
    }

    setGenerationProgress(5);
    setIsLoading(true);
    setGeneratedScript(null);
    setGeneratedImagePrompts(null);
    setGeneratedMetadata(null);

    // Switch to teleprompter immediately so the user sees the stream
    setSearchParams({ tab: 'teleprompter' });

    try {
      const currentEpisodePlan = generatedSeriesPlan?.find((ep: any) => parseInt(ep.episode) === parseInt(episode));
      reportGeneration('ScriptLayout', `Script generation for Session ${session}, Episode ${episode}`, 'request', 'anime');

      // Combine all world building context
      const worldBuilding = [
        generatedWorld,
        promptLore,
        promptPowers,
        promptFactions,
        promptArchitecture,
        promptAtlas,
        promptCulture,
        promptSystems
      ].filter(Boolean).join('\n\n');

      const script = await generateScriptStream(
        prompt, tone, audience, session, episode, numScenes, selectedModel, contentType,
        recapperPersona, characterRelationships, worldBuilding, generatedCharacters,
        currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null,
        // onChunk: update the script live as tokens arrive
        (partial) => setGeneratedScript(partial),
      );

      setGeneratedScript(script);
      setGenerationProgress(50);
      reportGeneration('ScriptLayout', 'Script generation', 'success', 'anime', { length: script?.length || 0 });
      showNotification?.('Script drafted.', 'success');
      await new Promise((r) => setTimeout(r, 2000));

      // Review linguistics analysis
      setSearchParams({ tab: 'linguistics' });
      setGenerationProgress(60);
      await new Promise((r) => setTimeout(r, 2000));

      // Review beat sheet
      setSearchParams({ tab: 'beats' });
      setGenerationProgress(70);
      await new Promise((r) => setTimeout(r, 2000));

      // Review dialogue
      setSearchParams({ tab: 'dialogue' });
      setGenerationProgress(80);
      await new Promise((r) => setTimeout(r, 2000));

      // Generate & review metadata/SEO
      try {
        setSearchParams({ tab: 'metadata' });
        if (handlers.handleGenerateSEO) {
          reportGeneration('ScriptLayout', 'SEO metadata generation via handler', 'request', 'anime');
          await handlers.handleGenerateSEO();
        } else {
          reportGeneration('ScriptLayout', 'Metadata generation', 'request', 'anime');
          const metadata = await generateMetadata(script, selectedModel);
          setGeneratedMetadata(metadata as any);
          reportGeneration('ScriptLayout', 'Metadata generation', 'success', 'anime', { length: JSON.stringify(metadata)?.length || 0 });
        }
        setGenerationProgress(95);
        showNotification?.('Script metadata indexed.', 'success');
        await new Promise((r) => setTimeout(r, 2000));
      } catch (metaErr) {
        console.warn('Failed to generate metadata:', metaErr);
      }

      setSearchParams({ tab: 'teleprompter' });
      setGenerationProgress(100);
      showNotification?.('Full Script Synthesized!', 'success');
      // Reset progress after a short delay
      setTimeout(() => setGenerationProgress(0), 3000);
    } catch (e: any) {
      reportGeneration('ScriptLayout', 'Script Synthesization', 'failure', 'anime', e);
      showNotification?.('Failed to write script: ' + (e.message || 'Unknown error'), 'error');
      setGenerationProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFullSeries = async () => {
    if (!generatedSeriesPlan || generatedSeriesPlan.length === 0) {
      showNotification?.('No series roadmap detected. Generate a series plan first.', 'error');
      return;
    }

    setSearchParams({ tab: 'teleprompter' });
    setIsLoading(true);
    setGenerationProgress(5);

    try {
      const worldBuilding = [
        generatedWorld,
        promptLore,
        promptPowers,
        promptFactions,
        promptArchitecture,
        promptAtlas,
        promptCulture,
        promptSystems
      ].filter(Boolean).join('\n\n');

      for (let i = 0; i < generatedSeriesPlan.length; i++) {
        const ep = generatedSeriesPlan[i];
        const epNum = ep.episode;
        
        setEpisode(epNum);
        showNotification?.(`Synthesizing Episode ${epNum} (${i + 1}/${generatedSeriesPlan.length})...`, 'info');
        setGenerationProgress(((i) / generatedSeriesPlan.length) * 100);

        const script = await generateScriptStream(
          prompt, tone, audience, session, epNum, numScenes, selectedModel, contentType,
          recapperPersona, characterRelationships, worldBuilding, generatedCharacters,
          JSON.stringify(ep),
          (partial) => setGeneratedScript(partial),
        );

        setGeneratedScript(script);

        // Delay to allow UI to breathe and prevent rate limiting
        await new Promise(r => setTimeout(r, 1500));
      }

      setGenerationProgress(100);
      showNotification?.('Full Series Script Manifest Synthesized!', 'success');
    } catch (e: any) {
      showNotification?.('Batch generation failed: ' + e.message, 'error');
      setGenerationProgress(0);
    } finally {
      setIsLoading(false);
      setTimeout(() => setGenerationProgress(0), 4000);
    }
  };

  const activeTab = (searchParams.get('tab') as ScriptTab) || 'teleprompter';

  const handleTabChange = (tab: ScriptTab) => {
    setSearchParams({ tab });
  };

  React.useEffect(() => {
    reportTabChange('SCRIPT', activeTab, 'anime');
  }, [activeTab]);

  React.useEffect(() => {
    const handleGlobalGenerate = () => {
      studioLog('ScriptLayout', 'Global script generation event received.', 'anime');
      handleGenerateAll();
    };
    window.addEventListener('studio-generate-script', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-script', handleGlobalGenerate);
  }, [handleGenerateAll]);

  return (
    <ScriptContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <ScriptHeader
            onRegenerate={handleGenerateAll}
            onGenerateAll={handleGenerateFullSeries}
            isGenerating={isLoading}
            onNext={() => {
              startTransition(() => {
                navigate(`/studio/storyboard`);
              });
            }}
            onPrev={() => {
              startTransition(() => {
                navigate(`/studio/series`);
              });
            }}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedScript}
            session={session}
            episode={episode}
          />
        </div>

        <div className={s.tabs.tabsBar}>
          <div className={s.tabs.tabsBarGlow} />
          <div className={s.tabs.tabsBarInner}>
            <ScriptTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
          <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
        </div>

        {/* Toolbar Section */}
        {(generatedScript || generatedMetadata) && (
          <div className="mb-8 relative z-30">
            <ScriptToolbar
              status={generatedScript ? 'active' : 'empty'}
              session={session}
              episode={episode}
              content={activeTab === 'metadata' ? JSON.stringify(generatedMetadata) : generatedScript}
              onExport={handlers.exportToPDF}
              onViewSEO={handlers.handleGenerateSEO}
              onViewPrompts={handlers.handleGeneratePrompts}
              onViewStoryboard={handlers.handleGenerateVisuals}
              onExtend={handlers.handleContinueScript}
              onListen={handlers.playVoiceover}
              onNext={handlers.handleNextEpisode}
              onPrev={handlers.handlePrevEpisode}
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
              <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><ScriptLoadingPage tab={activeTab} progress={generationProgress} /></div>}>
                <Outlet context={{ activeTab }} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </ScriptContext.Provider>
  );
}




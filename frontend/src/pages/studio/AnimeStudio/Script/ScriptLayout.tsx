import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
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

export const ScriptContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function ScriptLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const { showNotification } = useApp();
  const {
    generatedScript, isLoading, prompt, tone, audience,
    session, episode, numScenes, selectedModel, contentType,
    recapperPersona, characterRelationships, generatedWorld,
    generatedCharacters, generatedSeriesPlan, isSaving, generatedMetadata,
    generationProgress, isEditing, currentScriptId
  } = useGeneratorState();

  const {
    setGeneratedScript,
    setGeneratedImagePrompts,
    setGeneratedMetadata,
    setIsLoading,
    setGenerationProgress,
    syncCore,
    setIsEditing
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

      const script = await generateScriptStream(
        prompt, tone, audience, session, episode, numScenes, selectedModel, contentType,
        recapperPersona, characterRelationships, generatedWorld, generatedCharacters,
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

  const activeTab = (searchParams.get('tab') as ScriptTab) || 'teleprompter';

  const handleTabChange = (tab: ScriptTab) => {
    setSearchParams({ tab });
  };

  React.useEffect(() => {
    reportTabChange('ScriptLayout', activeTab, 'anime');
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
            isGenerating={isLoading}
            onNext={() => {
              navigate(`/studio/storyboard`);
            }}
            onPrev={() => {
              navigate(`/studio/series`);
            }}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedScript}
            session={session}
            episode={episode}
          />
        </div>

        <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 w-full flex justify-center">
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

        {isLoading ? (
          <ScriptLoadingPage tab={activeTab} progress={generationProgress} />
        ) : (
          <Outlet context={{ activeTab }} />
        )}
      </div>

    </ScriptContext.Provider>
  );
}




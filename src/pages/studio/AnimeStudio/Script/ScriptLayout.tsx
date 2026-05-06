import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { ScriptHeader } from './components/ScriptHeader';
import { ScriptToolbar } from './components/ScriptToolbar';
import { ScriptLoadingPage } from './components/ScriptLoadingPage';
import { generateScript, generateMetadata } from '@/services/api/gemini';
import { ScriptTab } from './Tabs/ScriptTabs';
import { studioLog, reportTabChange, reportGeneration } from '@/lib/studio-logger';

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
    generatedCharacters, generatedSeriesPlan, isSaving
  } = useGeneratorState();

  const {
    setGeneratedScript, setIsLoading, syncCore,
    setGeneratedImagePrompts, setGeneratedMetadata
  } = useGeneratorDispatch();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerateAll = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first to write a script.', 'error');
      return;
    }

    setIsLoading(true);
    // Clear existing data to show empty states for pending tabs
    setGeneratedScript(null);
    setGeneratedImagePrompts(null);
    setGeneratedMetadata(null);
    try {
      const currentEpisodePlan = generatedSeriesPlan?.find((ep: any) => parseInt(ep.episode) === parseInt(episode));
      reportGeneration('ScriptLayout', `Script generation for Session ${session}, Episode ${episode}`, 'request', 'anime');
      const script = await generateScript(
        prompt, tone, audience, session, episode, numScenes, selectedModel, contentType,
        recapperPersona, characterRelationships, generatedWorld, generatedCharacters,
        currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null
      );
      setSearchParams({ tab: 'teleprompter' });
      setGeneratedScript(script);
      reportGeneration('ScriptLayout', 'Script generation', 'success', 'anime', { length: script?.length || 0 });
      showNotification?.('Script drafted.', 'success');
      await new Promise((r) => setTimeout(r, 2000));

      // Review linguistics analysis
      setSearchParams({ tab: 'linguistics' });
      await new Promise((r) => setTimeout(r, 2000));

      // Review beat sheet
      setSearchParams({ tab: 'beats' });
      await new Promise((r) => setTimeout(r, 2000));

      // Review dialogue
      setSearchParams({ tab: 'dialogue' });
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
        showNotification?.('Script metadata indexed.', 'success');
        await new Promise((r) => setTimeout(r, 2000));
      } catch (metaErr) {
        console.warn('Failed to generate metadata:', metaErr);
      }

      setSearchParams({ tab: 'teleprompter' });
      showNotification?.('Full Script Synthesized!', 'success');
    } catch (e: any) {
      reportGeneration('ScriptLayout', 'Script Synthesization', 'failure', 'anime', e);
      showNotification?.('Failed to write script: ' + (e.message || 'Unknown error'), 'error');
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
            onNext={() => navigate(`/${contentType.toLowerCase()}/storyboard`)}
            onPrev={() => navigate(`/${contentType.toLowerCase()}/series`)}
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
            <ScriptToolbar
              status={generatedScript ? 'active' : 'empty'}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              session={session}
              episode={episode}
              content={generatedScript}
              onExport={handlers.exportToPDF}
              onViewSEO={handlers.handleGenerateSEO}
              onViewPrompts={handlers.handleGeneratePrompts}
              onViewStoryboard={handlers.handleGenerateVisuals}
              onExtend={handlers.handleContinueScript}
              onListen={handlers.playVoiceover}
              onNext={handlers.handleNextEpisode}
              onPrev={handlers.handlePrevEpisode}
              showTabsOnly={true}
            />
          </div>
        </div>

        {isLoading ? (
          <ScriptLoadingPage tab={activeTab} />
        ) : (
          <Outlet context={{ activeTab }} />
        )}
      </div>

    </ScriptContext.Provider>
  );
}




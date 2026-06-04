import React, { useEffect, useCallback, Suspense, startTransition } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams, useParams, useOutlet } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { useLogs } from '@/contexts/LogContext';

// Local Studio Components
import { ProductionCore } from '@/pages/studio/components/studio/core/ProductionCore';
import { SessionLogs } from '@/pages/studio/components/studio/core/SessionLogs';
import { StudioSideBar } from '@/pages/studio/components/studio/layout/StudioSideBar';
import { AnimeStudioSideBar } from './components/layout/AnimeStudioSideBar';
import { AnimeStudioTopBar } from './components/layout/AnimeStudioTopBar';
import { StudioFooter } from '@/pages/studio/components/studio/layout/StudioFooter';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioIntelligenceHUD } from '@/pages/studio/components/studio/layout/StudioIntelligenceHUD';

import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';

/**
 * AnimeLayout - Production Node v2.1
 * Handles the main production loop for Anime studio type.
 */
export default function AnimeLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const [searchParams] = useSearchParams();
  const { showNotification } = useApp();
  const { projectId: urlProjectId } = useParams();
  const projectId = urlProjectId || location.state?.projectId;
  const basePath = '/studio'; // Force clean URL path
  const projectIdFromUrl = projectId;
  const { addLog } = useLogs();

  // Sync Creative Engine state with URL query parameter
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // Default closed
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = React.useState(true);
  const [globalSidebarCollapsed, setGlobalSidebarCollapsed] = React.useState(true); // Default closed

  const toggleLeftSidebar = () => setLeftSidebarCollapsed((prev) => !prev);
  const toggleGlobalSidebar = () => setGlobalSidebarCollapsed((prev) => !prev);

  // Disable scroll when sidebar is open
  useEffect(() => {
    if (!globalSidebarCollapsed || sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [globalSidebarCollapsed, sidebarOpen]);

  // Update URL when sidebar state changes
  const toggleEngine = () => {
    setSidebarOpen((prev) => {
      const newState = !prev;
      const newParams = new URLSearchParams(location.search);
      if (newState) {
        newParams.set('engine', 'open');
      } else {
        newParams.delete('engine');
      }
      navigate({ search: newParams.toString() }, { replace: true });
      return newState;
    });
  };

  const {
    prompt, tone, audience, episode, session, numScenes, selectedModel,
    isLoading, isSaving, generatedScript, generatedCharacters,
    generatedSeriesPlan, generatedWorld, currentScriptId,
    history, characterRelationships, recapperPersona, numEpisodes,
    temperature, maxTokens, topP, topK
  } = useGeneratorState();

  const {
    setPrompt, setTone, setAudience, setEpisode, setSession, setNumScenes,
    setSelectedModel, setIsLoading, setIsSaving, setGeneratedScript,
    setGeneratedCharacters, setGeneratedSeriesPlan, setGeneratedWorld,
    setCurrentScriptId, setContentType, setCharacterData, setCharacterList,
    setCharacterRelationships, setVisualData, setGeneratedMetadata,
    setGeneratedImagePrompts, addLog: addGeneratorLog, setTheme, setRecapperPersona,
    syncCore, setGenerationProgress
  } = useGeneratorDispatch();

  // Initialize content type and handle "Fresh Entry" reset
  useEffect(() => {
    setContentType('Anime');
    
    // Check for hard browser reload
    const isReload = window.performance
      .getEntriesByType('navigation')
      .map((nav) => (nav as PerformanceNavigationTiming).type)
      .includes('reload');

    if (isReload && projectId) {
      console.info('[AnimeLayout] Hard reload detected. Purging session for fresh entry.');
      setCurrentScriptId(null);
      navigate('/studio', { replace: true });
      return;
    }

    if (projectId) {
      if (projectId !== currentScriptId) {
        console.info('[AnimeLayout] Syncing project from URL parameter:', projectId);
        setCurrentScriptId(projectId);
      }
    } else {
      // If we're at /studio without an ID, ensure we are in a fresh, empty state
      if (currentScriptId !== null) {
        console.info('[AnimeLayout] Starting fresh session. Clearing project context.');
        setCurrentScriptId(null);
      }
    }
  }, [setContentType, projectId, currentScriptId, setCurrentScriptId, navigate]);

  useEffect(() => {
    if (!currentScriptId || !location.pathname.startsWith('/studio')) {
      return;
    }

    const suffix = location.pathname.replace(/^\/studio/, '');
    const nextPath = `/projects/${currentScriptId}${suffix || '/engine'}`;
    navigate({ pathname: nextPath, search: location.search }, { replace: true, state: location.state });
  }, [currentScriptId, location.pathname, location.search, location.state, navigate]);

  const handleSaveCurrent = async () => {
    if (!generatedScript || !user) return;
    await syncCore();
  };

  /**
   * Master Orchestration Loop
   * Triggers the full sequential production cycle.
   */
  const handleMasterGenerate = useCallback(async () => {
    if (!prompt.trim() || !user) {
      showNotification?.('Please enter a story prompt first to start Master Generate.', 'error');
      return;
    }
    setIsLoading(true);
    setGenerationProgress(2);
    addGeneratorLog("MASTER_GENERATOR", "INITIALIZED", "Starting Full Production Cycle...", selectedModel);
    showNotification?.('Full Production Active — Generating all modules in sequence...', 'success');

    try {
      // Dynamic imports to optimize initial bundle
      const { generateWorld } = await import('@/services/prompts/world/worldGenerator');
      const { generateCharacters } = await import('@/services/prompts/character/characterGenerator');
      const { generateSeriesPlan } = await import('@/services/generators/seriesGenerator');
      const { generateImagePrompts, generateMetadata } = await import('@/services/api/gemini');

      // PHASE 1: WORLD Architecture
      setGenerationProgress(5);
      addGeneratorLog("WORLD", "STARTING", "Building World Foundation and Setting... [Target: world_bible.json]", selectedModel);
      const world = await generateWorld(prompt, selectedModel, 'Anime');
      setGeneratedWorld(world);
      addGeneratorLog("WORLD", "COMPLETED", "World foundation ready. [Saved to: world_bible.json]", selectedModel);

      // PHASE 2: Character Creation
      setGenerationProgress(25);
      addGeneratorLog("CHARACTERS", "STARTING", "Designing Character Profiles and Traits... [Target: character_dna.json]", selectedModel);
      const castResult = await generateCharacters(prompt, selectedModel, 'Anime', world);
      if (typeof castResult === 'object' && castResult.characters) {
        setGeneratedCharacters(castResult.markdown);
        setCharacterData(castResult);
        setCharacterList(castResult.characters);
        if (castResult.relationships) {
          setCharacterRelationships(JSON.stringify(castResult.relationships));
        }
      } else {
        setGeneratedCharacters(castResult as string);
      }
      addGeneratorLog("CHARACTERS", "COMPLETED", "Characters manifest generated. [Saved to: character_dna.json]", selectedModel);

      // PHASE 3: Series Structure
      setGenerationProgress(40);
      addGeneratorLog("SERIES", "STARTING", `Designing Series Overall Structure (${numEpisodes || 'unknown'} Episodes)... [Target: series_blueprint.json]`, selectedModel);
      const seriesPlan = await generateSeriesPlan(
        prompt,
        selectedModel,
        'Anime',
        numEpisodes,
        world,
        typeof castResult === 'string' ? castResult : castResult.markdown,
        false, // expandSequentially - Disabled: single-pass series generation prevents repeated per-episode AI calls.
        {
          session: session || undefined,
          episode: episode || '1',
          numScenes: numScenes ? parseInt(numScenes, 10) : undefined,
          temperature,
          maxTokens,
          topP,
          topK
        }
      );
      setGeneratedSeriesPlan(seriesPlan);
      addGeneratorLog("SERIES", "COMPLETED", "Series structure and beats mapped. [Saved to: series_blueprint.json]", selectedModel);
     
      // PHASE 5: Visual Planning (Storyboard)
      setGenerationProgress(75);
      addGeneratorLog("STORYBOARD", "STARTING", "Creating Visual Descriptions for Scenes... [Target: visual_prompts.json]", selectedModel);
      const visualPrompts = await generateImagePrompts(selectedModel);
      setGeneratedImagePrompts(visualPrompts);
      setVisualData({ 0: ["pending"] });
      addGeneratorLog("STORYBOARD", "COMPLETED", "Visual prompts created. [Saved to: visual_prompts.json]", selectedModel);

      // PHASE 6: Content Metadata
      setGenerationProgress(90);
      addGeneratorLog("SEO", "STARTING", "Generating Content Metadata and Tags... [Target: seo_metadata.json]", selectedModel);
      const seo = await generateMetadata(selectedModel);
      setGeneratedMetadata(seo);
      addGeneratorLog("SEO", "COMPLETED", "Metadata generation complete. [Saved to: seo_metadata.json]", selectedModel);
      setGenerationProgress(100);

      showNotification?.('Production Process Complete: All Modules Prepared', 'success');
      setGenerationProgress(100);
      setTimeout(() => setGenerationProgress(0), 3000);
      navigate(`${basePath}/console`);
    } catch (error: any) {
      console.error("Production Failed:", error);
      addGeneratorLog("CORE", "FAILURE", error.message || "Unknown error during production", selectedModel);
      showNotification?.(`Production Failure: ${error.message || 'Check logs'}`, 'error');
      setGenerationProgress(0);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, user, selectedModel, tone, audience, numScenes, recapperPersona, characterRelationships, setGeneratedWorld, setGeneratedCharacters, setCharacterData, setCharacterList, setCharacterRelationships, setGeneratedSeriesPlan, setGeneratedScript, setGeneratedImagePrompts, setVisualData, setGeneratedMetadata, showNotification, addGeneratorLog, navigate, basePath, setIsLoading, syncCore]);

  const handleWorldGenerate = useCallback(async () => {
    if (!prompt.trim() || !user) {
      showNotification?.('Please enter a story prompt first to generate the world.', 'error');
      return;
    }
    setIsLoading(true);
    setGenerationProgress(10);
    addGeneratorLog("WORLD", "INITIALIZED", "Generating World Foundation... [Target: world_bible.json]", selectedModel);

    try {
      const { generateWorld } = await import('@/services/prompts/world/worldGenerator');
      const world = await generateWorld(prompt, selectedModel, 'Anime');
      setGeneratedWorld(world);
      addGeneratorLog("WORLD", "COMPLETED", "Lore synchronized to core. [Saved to: world_bible.json]", selectedModel);
      showNotification?.('World Lore synthesized successfully!', 'success');
      setGenerationProgress(100);
      setTimeout(() => setGenerationProgress(0), 3000);
    } catch (error: any) {
      console.error("World Generation Failed:", error);
      addGeneratorLog("WORLD", "FAILURE", error.message || "Unknown error", selectedModel);
      showNotification?.(`World Generation Failure: ${error.message}`, 'error');
      setGenerationProgress(0);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, user, selectedModel, setGeneratedWorld, addGeneratorLog, showNotification, setIsLoading]);

  useEffect(() => {
    const handleGenerateSignal = () => handleMasterGenerate();
    const handleWorldSignal = () => handleWorldGenerate();

    window.addEventListener('studio-generate-all', handleGenerateSignal);
    window.addEventListener('studio-generate-world', handleWorldSignal);

    return () => {
      window.removeEventListener('studio-generate-all', handleGenerateSignal);
      window.removeEventListener('studio-generate-world', handleWorldSignal);
    };
  }, [handleMasterGenerate, handleWorldGenerate]);


  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first.', 'error');
      return;
    }
    setIsLoading(true);
    setGenerationProgress(10);
    navigate(`${basePath}/script`);

    try {
      const currentEpisodePlan = generatedSeriesPlan?.find((ep: any) => parseInt(ep.episode) === parseInt(episode));
      setGenerationProgress(100);
      setCurrentScriptId(null);
      showNotification?.('Script written successfully!', 'success');
      setGenerationProgress(100);
      setTimeout(() => setGenerationProgress(0), 3000);
    } catch (error) {
      console.error("Single generation persistence failed:", error);
      showNotification?.('Generation failed. Please try again.', 'error');
      setGenerationProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex h-screen w-full overflow-hidden z-[1000] studio-engine-root">
      <StudioIntelligenceHUD />
      {/* GLOBAL HUB SIDEBAR (Far Left) */}
      <div className="relative z-[501] border-r border-zinc-800/20">
        <StudioSideBar
          collapsed={globalSidebarCollapsed}
          setCollapsed={setGlobalSidebarCollapsed}
        />
      </div>

      {/* ANIME STUDIO SIDEBAR (Next to Hub) */}
      <AnimeStudioSideBar
        basePath={basePath}
        handleGenerate={handleMasterGenerate}
        isLoading={isLoading}
        rightSidebarOpen={sidebarOpen}
        onToggleRightSidebar={toggleEngine}
        collapsed={leftSidebarCollapsed}
        onToggleCollapse={toggleLeftSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Backdrop Overlays (No Animation, Pure Black) */}
        {!globalSidebarCollapsed && (
          <div
            onClick={() => setGlobalSidebarCollapsed(true)}
            className="fixed inset-0 bg-black z-[490] cursor-pointer"
          />
        )}

        {sidebarOpen && (
          <div
            onClick={toggleEngine}
            className="absolute inset-0 bg-black z-[40] cursor-pointer"
          />
        )}

        {!leftSidebarCollapsed && (
          <div
            onClick={toggleLeftSidebar}
            className="absolute inset-0 bg-black z-[40] cursor-pointer"
          />
        )}

        {!sidebarOpen && (
          <AnimeStudioTopBar
            onToggleEngine={toggleEngine}
            isEngineOpen={sidebarOpen}
            onToggleSidebar={toggleLeftSidebar}
            isSidebarCollapsed={leftSidebarCollapsed}
            onToggleGlobalSidebar={toggleGlobalSidebar}
            isGlobalSidebarOpen={!globalSidebarCollapsed}
          />
        )}

        {/* Main Production Workspace */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="min-h-full flex flex-col">
            <div className="w-full max-w-7xl mx-auto px-0 sm:px-8 py-8 relative z-10 flex-1">
              <div id="studio-content-area" className="w-full min-h-[calc(100vh-250px)] bg-black/60 backdrop-blur-xl border border-cyan-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] relative flex flex-col">
                <div className="relative z-10 w-full flex-1 flex flex-col">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex-1 flex flex-col"
                    >
                      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><StudioLoading message="Synchronizing Production Node..." /></div>}>
                        <div className="flex-1 flex flex-col">
                          {outlet ? React.cloneElement(outlet as React.ReactElement, { key: location.pathname }) : <Outlet />}
                        </div>
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Intelligence Console - Integrated Control Strip */}
              <div className="mt-6">
                <SessionLogs
                  history={history}
                  setPrompt={setPrompt}
                  setTone={setTone}
                  setAudience={setAudience}
                  setEpisode={setEpisode}
                  setSession={setSession}
                  setContentType={setContentType}
                  setSelectedModel={setSelectedModel}
                  setGeneratedMetadata={setGeneratedMetadata}
                  theme="cyan"
                />
              </div>
            </div>

            {/* Studio Footer */}
            <div className="mt-32">
              <StudioFooter />
            </div>
          </div>
        </div>
      </div>

      {/* Creative Engine Sidepanel */}
      <ProductionCore
        isOpen={sidebarOpen}
        onToggle={toggleEngine}
        prompt={prompt} setPrompt={setPrompt}
        tone={tone} setTone={setTone}
        audience={audience} setAudience={setAudience}
        session={session} setSession={setSession}
        episode={episode} setEpisode={setEpisode}
        numScenes={numScenes} setNumScenes={setNumScenes}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        recapperPersona={recapperPersona} setRecapperPersona={setRecapperPersona}
        characterRelationships={characterRelationships || ''}
        setCharacterRelationships={setCharacterRelationships}
        worldBuilding={generatedWorld || ''}
        setWorldBuilding={setGeneratedWorld}
        characterProfiles={generatedCharacters || ''}
        setCharacterProfiles={setGeneratedCharacters}
        handleGenerate={handleGenerate}
        handleMasterGenerate={handleMasterGenerate}
        handleSaveCurrent={handleSaveCurrent}
        isLoading={isLoading}
        isSaving={isSaving}
        generatedScript={generatedScript}
        currentScriptId={currentScriptId}
        user={user}
        basePath={basePath}
        navigate={navigate}
        contentType="Anime"
        theme="cyan"
        setTheme={setTheme}
      />
    </div>
  );
}

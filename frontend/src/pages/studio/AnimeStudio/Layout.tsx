import React, { useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  const { showNotification } = useApp();
  const { addLog } = useLogs();

  // Sync Creative Engine state with URL query parameter
  const [sidebarOpen, setSidebarOpen] = React.useState(false); // Default closed
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = React.useState(true);
  const [globalSidebarCollapsed, setGlobalSidebarCollapsed] = React.useState(true); // Default closed

  const toggleLeftSidebar = () => setLeftSidebarCollapsed(!leftSidebarCollapsed);
  const toggleGlobalSidebar = () => setGlobalSidebarCollapsed(!globalSidebarCollapsed);

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
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    const newParams = new URLSearchParams(location.search);
    if (newState) {
      newParams.set('engine', 'open');
    } else {
      newParams.delete('engine');
    }
    navigate({ search: newParams.toString() }, { replace: true });
  };

  const {
    prompt, tone, audience, episode, session, numScenes, selectedModel,
    isLoading, isSaving, generatedScript, generatedCharacters,
    generatedSeriesPlan, generatedWorld, currentScriptId,
    history, characterRelationships, recapperPersona
  } = useGeneratorState();

  const {
    setPrompt, setTone, setAudience, setEpisode, setSession, setNumScenes,
    setSelectedModel, setIsLoading, setIsSaving, setGeneratedScript,
    setGeneratedCharacters, setGeneratedSeriesPlan, setGeneratedWorld,
    setCurrentScriptId, setContentType, setCastData, setCastList,
    setCharacterRelationships, setVisualData, setGeneratedMetadata,
    setGeneratedImagePrompts, addLog: addGeneratorLog, setTheme, setRecapperPersona
  } = useGeneratorDispatch();

  // Initialize content type for this layout
  useEffect(() => {
    setContentType('Anime');
  }, [setContentType]);

  const basePath = '/anime';

  const handleSaveCurrent = async () => {
    if (!generatedScript || !user) return;
    setIsSaving(true);
    try {
      console.info('[AnimeLayout] Creating or updating project record.', { prompt });
      addLog('SAVE', 'START', 'Saving current anime project...');
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: prompt || "Untitled Anime Project",
          content_type: 'Anime',
          prompt: prompt,
          vibe: tone,
          model_used: selectedModel
        })
      });

      if (!res.ok) throw new Error("Failed to save project");
      const project = await res.json();
      setCurrentScriptId(project.id);
      console.info('[AnimeLayout] Project save completed.', { projectId: project.id });
      showNotification?.('Project saved successfully', 'success');
      addLog('SAVE', 'SUCCESS', 'Current anime project saved.');
    } catch (error) {
      console.error('[AnimeLayout] Save failed.', error);
      showNotification?.('Failed to save project', 'error');
      addLog('SAVE', 'ERROR', `Project save failed: ${(error as any)?.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
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
    addGeneratorLog("MASTER_GENERATOR", "INITIALIZED", "Starting Full Production Cycle...");
    showNotification?.('Full Production Active — Generating all modules in sequence...', 'success');

    try {
      // Dynamic imports to optimize initial bundle
      const { generateWorld } = await import('@/services/generators/world');
      const { generateCharacters } = await import('@/services/generators/characters');
      const { generateSeriesPlan } = await import('@/services/generators/series');
      const { generateScript, generateImagePrompts, generateMetadata } = await import('@/services/api/gemini');

      // PHASE 1: WORLD Architecture
      addGeneratorLog("WORLD", "STARTING", "Building World Foundation and Setting...");
      const world = await generateWorld(prompt, selectedModel, 'Anime');
      setGeneratedWorld(world);
      addGeneratorLog("WORLD", "COMPLETED", "World foundation ready.");

      // PHASE 2: Character Creation
      addGeneratorLog("CAST", "STARTING", "Designing Character Profiles and Traits...");
      const castResult = await generateCharacters(prompt, selectedModel, 'Anime', world);
      if (typeof castResult === 'object' && castResult.characters) {
        setGeneratedCharacters(castResult.markdown);
        setCastData(castResult);
        setCastList(castResult.characters);
        if (castResult.relationships) {
          setCharacterRelationships(JSON.stringify(castResult.relationships));
        }
      } else {
        setGeneratedCharacters(castResult as string);
      }
      addGeneratorLog("CAST", "COMPLETED", "Cast manifest generated.");

      // PHASE 3: Series Structure
      addGeneratorLog("SERIES", "STARTING", "Designing Series Overall Structure...");
      const seriesPlan = await generateSeriesPlan(prompt, selectedModel, 'Anime', 12, world, typeof castResult === 'string' ? castResult : castResult.markdown);
      setGeneratedSeriesPlan(seriesPlan);
      addGeneratorLog("SERIES", "COMPLETED", "Series structure and beats mapped.");

      // PHASE 4: Script Writing
      addGeneratorLog("SCRIPT", "STARTING", "Generating Episode 1 Script...");
      const ep1Plan = seriesPlan?.find((ep: any) => parseInt(ep.episode) === 1);
      const script = await generateScript(
        prompt, tone, audience, "1", "1", numScenes, selectedModel, 'Anime',
        recapperPersona, characterRelationships, world, typeof castResult === 'string' ? castResult : castResult.markdown, ep1Plan ? JSON.stringify(ep1Plan) : null
      );
      setGeneratedScript(script);
      addGeneratorLog("SCRIPT", "COMPLETED", "Script generated successfully.");

      // PHASE 5: Visual Planning (Storyboard)
      addGeneratorLog("STORYBOARD", "STARTING", "Creating Visual Descriptions for Scenes...");
      const visualPrompts = await generateImagePrompts(script, selectedModel);
      setGeneratedImagePrompts(visualPrompts);
      setVisualData({ 0: ["pending"] });
      addGeneratorLog("STORYBOARD", "COMPLETED", "Visual prompts created.");

      // PHASE 6: Content Metadata
      addGeneratorLog("SEO", "STARTING", "Generating Content Metadata and Tags...");
      const seo = await generateMetadata(script, selectedModel);
      setGeneratedMetadata(seo);
      addGeneratorLog("SEO", "COMPLETED", "Metadata generation complete.");

      showNotification?.('Production Process Complete: All Modules Prepared', 'success');
      navigate(`${basePath}/world`);
    } catch (error: any) {
      console.error("Production Failed:", error);
      addGeneratorLog("CORE", "FAILURE", error.message || "Unknown error during production");
      showNotification?.(`Production Failure: ${error.message || 'Check logs'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, user, selectedModel, tone, audience, numScenes, recapperPersona, characterRelationships, setGeneratedWorld, setGeneratedCharacters, setCastData, setCastList, setCharacterRelationships, setGeneratedSeriesPlan, setGeneratedScript, setGeneratedImagePrompts, setVisualData, setGeneratedMetadata, showNotification, addGeneratorLog, navigate, basePath, setIsLoading]);

  const handleWorldGenerate = useCallback(async () => {
    if (!prompt.trim() || !user) {
      showNotification?.('Please enter a story prompt first to generate the world.', 'error');
      return;
    }
    setIsLoading(true);
    addGeneratorLog("WORLD", "INITIALIZED", "Generating World Foundation...");

    try {
      const { generateWorld } = await import('@/services/generators/world');
      const world = await generateWorld(prompt, selectedModel, 'Anime');
      setGeneratedWorld(world);
      addGeneratorLog("WORLD", "COMPLETED", "Lore synchronized to core.");
      showNotification?.('World Lore synthesized successfully!', 'success');
    } catch (error: any) {
      console.error("World Generation Failed:", error);
      addGeneratorLog("WORLD", "FAILURE", error.message || "Unknown error");
      showNotification?.(`World Generation Failure: ${error.message}`, 'error');
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
    navigate(`${basePath}/script`);

    try {
      const { generateScript } = await import('@/services/api/gemini');
      const currentEpisodePlan = generatedSeriesPlan?.find((ep: any) => parseInt(ep.episode) === parseInt(episode));
      const script = await generateScript(prompt, tone, audience, session, episode, numScenes, selectedModel, 'Anime', recapperPersona, characterRelationships, generatedWorld, generatedCharacters, currentEpisodePlan ? JSON.stringify(currentEpisodePlan) : null);
      setGeneratedScript(script);
      setCurrentScriptId(null);
      showNotification?.('Script written successfully!', 'success');

      if (user) {
        // 1. Create/Initialize Project
        const projectRes = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: prompt.slice(0, 30) || "Single Generation",
            content_type: 'Anime',
            prompt: prompt,
            vibe: tone,
            model_used: selectedModel
          })
        });

        if (projectRes.ok) {
          const project = await projectRes.json();
          setCurrentScriptId(project.id);

          // 2. Save the Actual Script Content
          await fetch("/api/scripts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: `Script: ${project.name}`,
              content: script,
              project_id: project.id
            })
          });

          // 3. Log the Production Method (Vibe)
          await fetch("/api/methods", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: tone,
              description: `Production vibe used for project ${project.id}`
            })
          });

          // 4. Archive the Prompt
          await fetch("/api/prompts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: prompt,
              context: `SINGLE_GEN_SEED_PROMPT_ID_${project.id}`
            })
          });
        }
      }
    } catch (error) {
      console.error("Single generation persistence failed:", error);
      showNotification?.('Generation failed. Please try again.', 'error');
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
                        <div className="flex-1 flex flex-col">
                          <Outlet />
                        </div>
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
        castProfiles={generatedCharacters || ''}
        setCastProfiles={setGeneratedCharacters}
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

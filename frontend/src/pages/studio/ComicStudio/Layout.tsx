import React, { useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { studioLog } from '@/lib/studio-logger';

// Local Studio Components
import { ComicStudioSideBar } from './components/ComicStudioSideBar';
import { ComicStudioTopBar } from './components/ComicStudioTopBar';
import { StudioSideBar } from '@/pages/studio/components/studio/layout/StudioSideBar';
import { StudioFooter } from '@/pages/studio/components/studio/layout/StudioFooter';
import { ProductionFlowBar } from '@/pages/studio/components/studio/layout/ProductionFlowBar';
import { ProductionCore } from '@/pages/studio/components/studio/core/ProductionCore';
import { SessionLogs } from '@/pages/studio/components/studio/core/SessionLogs';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { StudioIntelligenceHUD } from '../components/studio/layout/StudioIntelligenceHUD';

export default function ComicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useApp();

  const {
    prompt, tone, audience, episode, session, numScenes, selectedModel,
    isLoading, history } = useGeneratorState();

  const {
    setIsLoading, addLog, setPrompt, setTone, setAudience,
    setEpisode, setSession, setNumScenes, setSelectedModel, setGeneratedMetadata, setContentType
  } = useGeneratorDispatch();

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

  const toggleEngine = () => {
    const newState = !sidebarOpen;
    studioLog('ComicLayout', `${newState ? 'Opening' : 'Closing'} Creative Engine...`, 'comic');
    setSidebarOpen(newState);
    const newParams = new URLSearchParams(location.search);
    if (newState) newParams.set('engine', 'open');
    else newParams.delete('engine');
    navigate({ search: newParams.toString() }, { replace: true });
  };

  useEffect(() => {
    setContentType('Comic');
  }, [setContentType]);

  const basePath = '/comic';

  const handleMasterGenerate = useCallback(async () => {
    if (!prompt.trim() || !user) {
      showNotification?.('Missing Core Parameter: Enter a production prompt.', 'error');
      return;
    }
    setIsLoading(true);
    studioLog('ComicLayout', 'Initializing Master Production Cycle...', 'comic');
    addLog("COMIC_CORE", "INITIALIZED", "Orchestrating Comic Production Cycle...");
    setTimeout(() => {
      setIsLoading(false);
      studioLog('ComicLayout', 'Production Complete. Redirecting to World Builder.', 'success');
      showNotification?.('Production Complete: All Elements Prepared', 'success');
      navigate(`${basePath}/world`);
    }, 2000);
  }, [prompt, user, setIsLoading, addLog, showNotification, navigate, basePath]);

  React.useEffect(() => {
    studioLog('ComicLayout', `Navigation detected: ${location.pathname}`, 'comic');
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 bg-black flex h-screen w-full overflow-hidden z-[1000] comic-studio-root">
      {/* Intelligence HUD (Persistent) */}
      <StudioIntelligenceHUD />

      {/* GLOBAL HUB SIDEBAR (Far Left) */}
      <div className="relative z-[501] border-r border-amber-500/20">
        <StudioSideBar
          collapsed={globalSidebarCollapsed}
          setCollapsed={setGlobalSidebarCollapsed}
        />
      </div>

      {/* COMIC STUDIO SIDEBAR (Next to Hub) */}
      <ComicStudioSideBar
        basePath={basePath}
        handleGenerate={handleMasterGenerate}
        isLoading={isLoading}
        rightSidebarOpen={sidebarOpen}
        onToggleRightSidebar={toggleEngine}
        collapsed={leftSidebarCollapsed}
        onToggleCollapse={toggleLeftSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Backdrop Blur Overlays */}
        <AnimatePresence>
          {/* Global Hub Backdrop */}
          {!globalSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setGlobalSidebarCollapsed(true)}
              className="fixed inset-0 bg-black/60 z-[490] cursor-pointer"
            />
          )}

          {/* Engine Backdrop */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={toggleEngine}
              className="absolute inset-0 bg-black/60 z-[40] cursor-pointer"
            />
          )}

          {/* Sidebar Backdrop */}
          {!leftSidebarCollapsed && (
            <motion.div
              animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={toggleLeftSidebar}
              className="absolute inset-0 bg-black/40 z-[40] cursor-pointer"
            />
          )}
        </AnimatePresence>

        {!sidebarOpen && (
          <ComicStudioTopBar
            onToggleEngine={toggleEngine}
            isEngineOpen={sidebarOpen}
            onToggleSidebar={toggleLeftSidebar}
            isSidebarCollapsed={leftSidebarCollapsed}
            onToggleGlobalSidebar={toggleGlobalSidebar}
            isGlobalSidebarOpen={!globalSidebarCollapsed}
          />
        )}

        {/* Production Flow Monitor */}
        <ProductionFlowBar basePath={basePath} />

        {/* Main Production Workspace */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <div className="min-h-full flex flex-col">
            <div className="w-full max-w-7xl mx-auto px-0 py-8 relative z-10 flex-1">
              <div id="studio-content-area" className="w-full min-h-[calc(100vh-250px)] bg-[#1a150b]/60 backdrop-blur-xl border border-amber-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] relative overflow-hidden flex flex-col">
                <div className="relative z-10 w-full flex-1 flex flex-col">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      <React.Suspense fallback={<StudioLoading fullPage={false} message="Opening Comic Studio" submessage="Connecting to the studio..." />}>
                        <div className="flex-1 flex flex-col justify-center">
                          <Outlet />
                        </div>
                      </React.Suspense>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Intelligence Console */}
              <div className="mt-8">
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
                  theme="amber"
                />
              </div>
            </div>

            {/* Studio Footer with Gap */}
            <div className="mt-40">
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
        handleGenerate={handleMasterGenerate}
        handleMasterGenerate={handleMasterGenerate}
        handleSaveCurrent={() => { }} // Placeholder for Comic save
        isLoading={isLoading}
        isSaving={false}
        generatedScript={null}
        currentScriptId={null}
        user={user}
        basePath={basePath}
        navigate={navigate}
        contentType="Comic"
        theme="amber"
      />
    </div>
  );
}

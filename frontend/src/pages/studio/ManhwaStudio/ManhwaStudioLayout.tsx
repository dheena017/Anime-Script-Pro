import React, { useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { studioLog } from '@/lib/studio-logger';

// Local Studio Components
import { ManhwaStudioSideBar } from './components/ManhwaStudioSideBar';
import { ManhwaStudioTopBar } from './components/ManhwaStudioTopBar';
import { StudioSideBar } from '@/pages/studio/components/studio/layout/StudioSideBar';
import { StudioFooter } from '@/pages/studio/components/studio/layout/StudioFooter';
import { ProductionFlowBar } from '@/pages/studio/components/studio/layout/ProductionFlowBar';
import { StudioIntelligenceHUD } from '@/pages/studio/components/studio/layout/StudioIntelligenceHUD';
import { ProductionCore } from '@/pages/studio/components/studio/core/ProductionCore';
import { SessionLogs } from '@/pages/studio/components/studio/core/SessionLogs';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { useStudioRealtimeData } from '@/hooks/useStudioRealtimeData';

export default function ManhwaLayout() {
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
  const realtimeData = useStudioRealtimeData(user?.id);

  const [sidebarOpen, setSidebarOpen] = React.useState(false); // Default closed
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = React.useState(false);
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
    studioLog('ManhwaLayout', `${newState ? 'Opening' : 'Closing'} Creative Engine...`, 'manhwa');
    setSidebarOpen(newState);
    const newParams = new URLSearchParams(location.search);
    if (newState) newParams.set('engine', 'open');
    else newParams.delete('engine');
    navigate({ search: newParams.toString() }, { replace: true });
  };

  useEffect(() => {
    setContentType('Manhwa');
  }, [setContentType]);

  const basePath = '/manhwa';

  const handleMasterGenerate = useCallback(async () => {
    if (!prompt.trim() || !user) {
      showNotification?.('Missing Core Parameter: Enter a production prompt.', 'error');
      return;
    }
    setIsLoading(true);
    studioLog('ManhwaLayout', 'Initializing Master Production Cycle...', 'manhwa');
    addLog("MANHWA_CORE", "INITIALIZED", "Orchestrating Manhwa Production Cycle...");
    setTimeout(() => {
      setIsLoading(false);
      studioLog('ManhwaLayout', 'Production Complete. Redirecting to World Builder.', 'success');
      showNotification?.('Production Complete: All Elements Prepared', 'success');
      navigate(`${basePath}/world`);
    }, 2000);
  }, [prompt, user, setIsLoading, addLog, showNotification, navigate, basePath]);

  React.useEffect(() => {
    studioLog('ManhwaLayout', `Navigation detected: ${location.pathname}`, 'manhwa');
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 bg-[#0d0a05] flex h-screen w-full overflow-hidden z-[1000] manhwa-studio-root">
      {/* Intelligence HUD (Persistent) */}
      <StudioIntelligenceHUD />

      {/* GLOBAL HUB SIDEBAR (Far Left) */}
      <div className="relative z-[501] border-r border-violet-500/20">
        <StudioSideBar
          collapsed={globalSidebarCollapsed}
          setCollapsed={setGlobalSidebarCollapsed}
        />
      </div>

      {/* MANHWA STUDIO SIDEBAR (Next to Hub) */}
      <ManhwaStudioSideBar
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
          <ManhwaStudioTopBar
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
              <div id="studio-content-area" className="w-full min-h-[calc(100vh-250px)] bg-[#100c14]/60 backdrop-blur-xl border border-violet-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] relative overflow-hidden flex flex-col">
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
                      <React.Suspense fallback={<StudioLoading fullPage={false} message="Opening Manhwa Studio" submessage="Connecting to the studio..." />}>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="mx-8 mb-4 rounded-2xl border border-violet-500/10 bg-black/30 px-4 py-3 text-xs text-zinc-300">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-black uppercase tracking-[0.25em] text-violet-300/80">Live API Flow</span>
                              <span>
                                {realtimeData.isLoading ? 'Syncing studio state across pages...' : 'Studio state is synchronized through the API.'}
                              </span>
                              <span className="text-zinc-500">
                                {realtimeData.lastSyncedAt ? `Last update ${new Date(realtimeData.lastSyncedAt).toLocaleTimeString()}` : 'Waiting for first sync'}
                              </span>
                              <span className="text-zinc-500">
                                Logs: {realtimeData.recentLogs.length}
                              </span>
                            </div>
                          </div>
                          <Outlet context={realtimeData} />
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
                  theme="violet"
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
        handleSaveCurrent={() => { }} // Placeholder for Manhwa save
        isLoading={isLoading}
        isSaving={false}
        generatedScript={null}
        currentScriptId={null}
        user={user}
        basePath={basePath}
        navigate={navigate}
        contentType="Manhwa"
        theme="violet"
      />
    </div>
  );
}

import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { EngineHeader } from './components/EngineHeader';
import { EngineToolbar } from './components/EngineToolbar';
import { EngineTab } from './tabs/EngineTabs';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';
import { engineStyles as s } from './engineStyles';

export const EngineContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function EngineLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    session, episode, generatedScript, isSaving,
    temperature, maxTokens, selectedModel, tone, audience,
    contentType, currentScriptId,
    generationProgress
  } = useGeneratorState();
  const { setIsSaving, showNotification, syncCore, setGenerationProgress } = useGeneratorDispatch();
  const { user } = useAuth();

  const handleSaveCurrent = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      return;
    }
    
    // Use the centralized syncCore which handles full project persistence and UI refresh
    await syncCore();
  };

  const activeTab = (searchParams.get('tab') as EngineTab) || 'status';

  const handleTabChange = (tab: EngineTab) => {
    setSearchParams({ tab });
  };

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  return (
    <EngineContext.Provider value={{ setHandlers: () => {} }}>
      <div className="space-y-6">
<div className={s.layout.moduleHeader}>
        <EngineHeader
          session={session}
          episode={episode}
          onPrev={() => {
            startTransition(() => {
              navigate(`${currentScriptId ? `/projects/${currentScriptId}` : '/studio'}/screening`);
            });
          }}
          onNext={() => {
            startTransition(() => {
              navigate(`${currentScriptId ? `/projects/${currentScriptId}` : '/studio'}/world`);
            });
          }}
          onSave={handleSaveCurrent}
          isSaving={isSaving}
          hasContent={!!generatedScript}
        />
      </div>

      <div className={s.tabs.tabsBar}>
         <div className={s.tabs.tabsBarGlow} />
         
         <div className={s.tabs.tabsBarInner}>
          <EngineToolbar
            status={generatedScript ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
            content={generatedScript}
            showTabsOnly={true}
          />
        </div>
        <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
      </div>

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
              <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20 text-xs font-black uppercase tracking-[0.2em] text-cyan-500 animate-pulse">Initializing Engine Node...</div>}>
                <Outlet context={{ activeTab }} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </EngineContext.Provider>
  );
}

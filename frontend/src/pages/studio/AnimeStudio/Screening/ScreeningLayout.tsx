import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { ScreeningHeader } from './components/ScreeningHeader';
import { ScreeningToolbar } from './components/ScreeningToolbar';
import { ScreeningTabs, ScreeningTab } from './Tabs/ScreeningTabs';
import { ScreeningLoadingPage } from './components/ScreeningLoadingPage';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';
import { screeningStyles as s } from './screeningStyles';

export const ScreeningContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function ScreeningLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [handlers, setHandlers] = React.useState<any>({});

  const {
    session, episode, isSaving, generatedScript,
    contentType, currentScriptId,
    generationProgress,
    isEditing
  } = useGeneratorState();
  const { syncCore, setIsEditing, setGenerationProgress } = useGeneratorDispatch();

  useAuth();

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  const handleSave = async () => {
    await syncCore(projectId);
  };

  React.useEffect(() => {
    const handleGlobalGenerate = () => {
      if (handlers.handleFullRender) {
        handlers.handleFullRender();
      }
    };
    window.addEventListener('studio-generate-screening', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-screening', handleGlobalGenerate);
  }, [handlers.handleFullRender]);

  const activeTab = (searchParams.get('tab') as ScreeningTab) || 'preview';

  React.useEffect(() => {
    console.log(`[ScreeningLayout] Active tab changed to: ${activeTab.toUpperCase()}`);
  }, [activeTab]);

  const handleTabChange = (tab: ScreeningTab) => {
    setSearchParams({ tab });
  };

  return (
    <ScreeningContext.Provider value={{ setHandlers }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <ScreeningHeader
            session={session}
            episode={episode}
            onPrev={() => {
              startTransition(() => {
                navigate(`/studio/prompts`);
              });
            }}
            onNext={() => {
              startTransition(() => {
                navigate(`/studio/assets`);
              });
            }}
            onRender={handlers.handleFullRender}
            isRendering={handlers.isRendering}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedScript}
          />
        </div>

        <div className={s.tabs.tabsBar}>
          <div className={s.tabs.tabsBarGlow} />
          <div className={s.tabs.tabsBarInner}>
            <ScreeningTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
          <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
        </div>

        {!handlers.isRendering && (
          <div className="mb-8">
            <ScreeningToolbar
              status="active"
              session={session}
              episode={episode}
              activeSession={handlers.activeSession}
              setActiveSession={handlers.setActiveSession}
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
              <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><ScreeningLoadingPage tab={activeTab} progress={generationProgress} /></div>}>
                {handlers.isRendering ? (
                  <ScreeningLoadingPage tab={activeTab} progress={generationProgress} />
                ) : (
                  <Outlet context={{ activeTab }} />
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ScreeningContext.Provider>
  );
}




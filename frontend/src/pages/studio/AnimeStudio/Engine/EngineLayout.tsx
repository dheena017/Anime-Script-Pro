import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { EngineHeader } from './components/EngineHeader';
import { EngineToolbar } from './components/EngineToolbar';
import { EngineTab } from './tabs/EngineTabs';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';

export const EngineContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function EngineLayout() {
  const navigate = useNavigate();
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
<div className="studio-module-header">
        <EngineHeader
          session={session}
          episode={episode}
          onPrev={() => {
            navigate(`/studio/screening`);
          }}
          onNext={() => {
            navigate(`/studio/world`);
          }}
          onSave={handleSaveCurrent}
          isSaving={isSaving}
          hasContent={!!generatedScript}
        />
      </div>

      <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
         
         <div className="relative z-10 w-full flex justify-center">
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet context={{ activeTab }} />
        </motion.div>
      </div>
    </EngineContext.Provider>
  );
}

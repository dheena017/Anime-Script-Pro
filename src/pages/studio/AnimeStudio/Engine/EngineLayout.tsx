import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { EngineHeader } from './components/EngineHeader';
import { EngineToolbar } from './components/EngineToolbar';
import { EngineTab } from './tabs/EngineTabs';

export const EngineContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
}>({ setHandlers: () => { } });

export default function EngineLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    session, episode, generatedScript, isSaving, setIsSaving, showNotification,
    temperature, maxTokens, selectedModel, tone, audience,
    contentType
  } = useGenerator();

  const { user } = useAuth();

  const handleSaveCurrent = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { engineApi } = await import('@/services/api/engine');
      await engineApi.updateConfig(user.id, {
        temperature,
        max_tokens: maxTokens,
        selected_model: selectedModel,
        vibe: tone,
        audience: audience
      });
      showNotification?.('Engine Matrix Synchronized', 'success');
    } catch (e) {
      console.error("Manual sync failed:", e);
      showNotification?.('Sync Error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const activeTab = (searchParams.get('tab') as EngineTab) || 'status';

  const handleTabChange = (tab: EngineTab) => {
    setSearchParams({ tab });
  };

  return (
    <EngineContext.Provider value={{ setHandlers: () => {} }}>
      <div className="space-y-6">
<div className="studio-module-header">
        <EngineHeader
          session={session}
          episode={episode}
          onPrev={() => navigate(`/${contentType.toLowerCase()}/screening`)}
          onNext={() => navigate(`/${contentType.toLowerCase()}/world`)}
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

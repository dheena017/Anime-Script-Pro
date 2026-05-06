import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProtocolsHeader } from './components/ProtocolsHeader';
import { ProtocolsToolbar } from './components/ProtocolsToolbar';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';

export const ProtocolsContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}>({ 
  setHandlers: () => { },
  searchQuery: '',
  setSearchQuery: () => { }
});

export default function ProtocolsLayout() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { 
    isSaving, setIsSaving, showNotification, generatedScript,
    castProfiles, castData, generatedSeriesPlan, generatedMetadata,
    session, episode, contentType
  } = useGenerator();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { productionApi } = await import('@/services/api/production');
      await productionApi.updateContent(user.id, {
        cast_profiles: castProfiles,
        cast_data: castData,
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata
      });
      showNotification('Protocols saved successfully!', 'success');
    } catch (e) {
      console.error("Manual sync failed:", e);
      showNotification('Failed to save protocols', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtocolsContext.Provider value={{ setHandlers: () => {}, searchQuery, setSearchQuery }}>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="studio-module-header">
          <ProtocolsHeader
            session={session}
            episode={episode}
            onPrev={() => navigate(`/${contentType.toLowerCase()}/world`)}
            onNext={() => navigate(`/${contentType.toLowerCase()}/cast`)}
            onRegenerate={() => {
              // Placeholder logic for regenerating protocols
              showNotification?.('Refreshing Protocol Matrix...', 'info');
              // Actual logic would go here
            }}
            isGenerating={false} // Would be tied to state if logic implemented
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedScript}

          />
        </div>

        <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 w-full flex justify-center">
            <ProtocolsToolbar showTabsOnly={true} />
          </div>
        </div>


        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </ProtocolsContext.Provider>
  );
}





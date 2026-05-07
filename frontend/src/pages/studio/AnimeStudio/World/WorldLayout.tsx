import React, { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { WorldHeader } from './components/WorldHeader';
import { WorldToolbar } from './components/WorldToolbar';
import { WorldTabs, WorldTab } from './tabs/WorldTabs';
import { reportTabChange } from '@/lib/studio-logger';
import { WorldCommandCenterProvider, useWorldCommandCenter } from './context/WorldCommandCenter';

export default function WorldLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<WorldTab>('manifest');
  const { session, episode, contentType, syncCore, isSaving, generatedWorld } = useGenerator();

  useAuth();

  const handleTabChange = (tab: WorldTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    reportTabChange('WorldLayout', activeTab, 'anime');
  }, [activeTab]);

  return (
    <WorldCommandCenterProvider
      activeTab={activeTab}
      setActiveTab={handleTabChange}
    >
      <WorldStudioContent 
        navigate={navigate}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        session={session}
        episode={episode}
        contentType={contentType}
        syncCore={syncCore}
        isSaving={isSaving}
        generatedWorld={generatedWorld}
      />
    </WorldCommandCenterProvider>
  );
}

function WorldStudioContent({ 
  navigate, 
  activeTab, 
  handleTabChange, 
  session, 
  episode, 
  contentType, 
  syncCore, 
  isSaving,
  generatedWorld
}: any) {
  const { generateAll, isGeneratingAny, progress } = useWorldCommandCenter();

  return (
    <div className="space-y-6">
      <div className="studio-module-header">
        <WorldHeader
          isGenerating={isGeneratingAny}
          onRegenerate={generateAll}
          session={session}
          episode={episode}
          onPrev={() => navigate(`/${contentType.toLowerCase()}/engine`)}
          onNext={() => navigate(`/${contentType.toLowerCase()}/cast`)}
          onSave={syncCore}
          isSaving={isSaving}
          hasContent={!!generatedWorld}
        />
      </div>

      <div className="studio-tabs-bar sticky top-0 z-50 flex flex-col items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-4 relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 w-full flex justify-center">
          <WorldTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        
        {(isGeneratingAny || (progress > 0 && progress < 100)) && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
            <div 
              className="h-full bg-studio shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <Outlet context={{ activeTab, setActiveTab: handleTabChange }} />
    </div>
  );
}

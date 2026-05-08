import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { CastHeader } from './components/CastHeader';
import { CastEmptyState } from './components/CastEmptyState';
import { CastToolbar, CastTab } from './components/CastToolbar';
import { CastTabs } from './Tabs/CastTabs';
import { RegistryTab } from './Tabs/RegistryTab';
import { VoiceTab } from './Tabs/VoiceTab';
import { CombatTab } from './Tabs/CombatTab';
import { ArcsTab } from './Tabs/ArcsTab';
import { DynamicsTab } from './Tabs/DynamicsTab';
import { TechnicalTab } from './Tabs/TechnicalTab';
import RelationshipsPage from './Tabs/Relationships/RelationshipsPage';
import {
  generateCharacters
} from '../../../../services/api/gemini';
import { CastLoadingPage } from './CastLoadingPage';
import { MOCK_CAST_DATA } from '@/services/generators/mockData';
import { studioLog, reportTabChange, reportGeneration } from '@/lib/studio-logger';

export const CastContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
  handleLoadDemo?: () => void;
}>({ setHandlers: () => { } });

export const CastTabActionsContext = React.createContext<{
  isAnalyzingCast?: boolean;
  handleGenerateCharacter?: () => Promise<any>;
  handleGenerateDNA?: () => Promise<any>;
  handleGenerateDynamics?: () => Promise<any>;
  handleGenerateIntegrity?: () => Promise<any>;
}>({});

export default function CastLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [handlers, setHandlers] = React.useState<any>({});

  const getTabFromPath = (path: string): CastTab => {
    if (path.includes('/voice')) return 'voice';
    if (path.includes('/combat')) return 'combat';
    if (path.includes('/arcs')) return 'arcs';
    if (path.includes('/dynamics')) return 'dynamics';
    if (path.includes('/relationships')) return 'relationships';
    if (path.includes('/technical')) return 'technical';
    return 'registry';
  };

  const [activeTab, setActiveTab] = React.useState<CastTab>(() => getTabFromPath(location.pathname));

  const { showNotification } = useApp();
  const {
    prompt, selectedModel, contentType, generatedWorld,
    session, episode, generatedCharacters, isSaving, isGeneratingCharacters, isAnalyzingCast,
    generationProgress, numCharacters, castList  } = useGeneratorState();

  const {
    setIsGeneratingCharacters, setCastData, setCastList,
    setGeneratedCharacters, setCharacterRelationships, syncCore,
    setCastDNA, setCastDynamics, setCastIntegrity  } = useGeneratorDispatch();

  useAuth();

  const handleLoadDemo = () => {
    setCastData(MOCK_CAST_DATA);
    setCastList(MOCK_CAST_DATA.characters);
    setGeneratedCharacters(MOCK_CAST_DATA.markdown);
    if (MOCK_CAST_DATA.relationships) {
      setCharacterRelationships(JSON.stringify(MOCK_CAST_DATA.relationships));
    }
    showNotification?.('Aetheria sample cast loaded successfully.', 'success');
  };

  const handleSave = async () => {
    await syncCore();
  };

  // Removed DNA, Dynamics, and Integrity generation as tabs were removed

  const handleGenerateAll = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first before creating characters.', 'error');
      return;
    }

    setIsGeneratingCharacters(true);
    try {
      // Clear existing data
      setCastData(null);
      setCastList([]);
      setGeneratedCharacters(null);
      setCharacterRelationships(null);
      setCastDNA(null);
      setCastDynamics(null);
      setCastIntegrity(null);

      let result: any = null;
      if (handlers && handlers.handleGenerateCharacter) {
        try {
          await handlers.handleGenerateCharacter();
        } catch (hErr) {
          console.warn('Registered handler for character generation failed:', hErr);
        }
      } else {
        reportGeneration('CastLayout', 'Characters generation', 'request', 'anime');
        result = await generateCharacters(prompt, selectedModel, contentType, generatedWorld || undefined, numCharacters);
        reportGeneration('CastLayout', 'Characters generation', 'success', 'anime', { length: JSON.stringify(result)?.length || 0 });
      }

      if (result) {
        if (typeof result === 'object' && result !== null) {
          if ('characters' in result) {
            setCastData(result);
            setCastList(result.characters);
            setGeneratedCharacters(JSON.stringify(result, null, 2));
          }
          if ('markdown' in result) {
            setGeneratedCharacters(result.markdown as string);
          }
          if (result.relationships) {
            setCharacterRelationships(JSON.stringify(result.relationships));
          }
        } else {
          setGeneratedCharacters(result as string);
        }
      }

      showNotification?.('Cast Nexus Synthesized.', 'success');
      navigate(`/${contentType.toLowerCase()}/cast`);
    } catch (e: any) {
      reportGeneration('CastLayout', 'Full Cast Synthesization', 'failure', 'anime', e);
      showNotification?.('Failed to create characters: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingCharacters(false);
    }
  };

  const handleTabChange = (tab: CastTab) => {
    setActiveTab(tab);
  };

  React.useEffect(() => {
    const handleTriggerGenerate = () => {
      handleGenerateAll();
    };

    window.addEventListener('studio-generate-cast', handleTriggerGenerate);
    return () => window.removeEventListener('studio-generate-cast', handleTriggerGenerate);
  }, [handleGenerateAll]);

  React.useEffect(() => {
    const routeTab = getTabFromPath(location.pathname);
    if (location.pathname !== `/${contentType.toLowerCase()}/cast`) {
      setActiveTab(routeTab);
    }
  }, [location.pathname, contentType]);

  React.useEffect(() => {
    reportTabChange('CastLayout', activeTab, 'anime');
  }, [activeTab]);

  React.useEffect(() => {
    const handleGlobalGenerate = () => {
      studioLog('CastLayout', 'Global cast generation event received.', 'anime');
      handleGenerateAll();
    };
    window.addEventListener('studio-generate-cast', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-cast', handleGlobalGenerate);
  }, [handleGenerateAll]);

  const routeTab = getTabFromPath(location.pathname);
  const isDetailRoute = location.pathname.includes('/cast/characters/') || location.pathname.includes('/cast/relationships/');
  const shouldRenderOutlet = isDetailRoute && activeTab === routeTab;
  const loadingStates = {
    registry: isGeneratingCharacters,
  };

  const handleViewCharacter = (charName: string) => {
    navigate(`/${contentType.toLowerCase()}/cast/characters/${charName}`);
  };

  const renderTabContent = () => {
    if (!castList || castList.length === 0) {
      return (
        <CastEmptyState 
          onLaunch={handleGenerateAll} 
          onLoadDemo={handleLoadDemo} 
          isGenerating={isGeneratingCharacters} 
        />
      );
    }

    switch (activeTab) {
      case 'voice': return <VoiceTab />;
      case 'combat': return <CombatTab />;
      case 'arcs': return <ArcsTab />;
      case 'dynamics': return <DynamicsTab />;
      case 'relationships': return <RelationshipsPage />;
      case 'technical': return <TechnicalTab />;
      default: return <RegistryTab onViewCharacter={handleViewCharacter} />;
    }
  };

  return (
    <CastContext.Provider value={{ setHandlers, handleLoadDemo }}>
        <CastTabActionsContext.Provider value={{
          isAnalyzingCast,
          ...(handlers || {}),
        }}>
      <div className="space-y-6">
        <div className="studio-module-header">
          <CastHeader
            isGenerating={handlers.isGenerating || isGeneratingCharacters || isAnalyzingCast}
            onRegenerate={handlers.handleGenerateCharacter || handleGenerateAll}
            session={session}
            episode={episode}
            onPrev={() => navigate(`/${contentType.toLowerCase()}/world`)}
            onNext={() => navigate(`/${contentType.toLowerCase()}/series`)}
            onSave={handleSave}
            isSaving={isSaving}
            hasContent={!!generatedCharacters}
          />
        </div>

        <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 w-full flex justify-center">
            <CastTabs activeTab={activeTab} setActiveTab={handleTabChange} loadingStates={loadingStates} />
          </div>
        </div>

        {/* Toolbar Section */}
        {generatedCharacters && (
          <div className="mb-8 relative z-30">
            <CastToolbar
              status={generatedCharacters ? 'active' : 'empty'}
              session={session}
              episode={episode}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              content={generatedCharacters}
            />
          </div>
        )}

        {(isGeneratingCharacters || isAnalyzingCast) ? (
          <CastLoadingPage tab={activeTab} progress={generationProgress} />
        ) : shouldRenderOutlet ? (
          <Outlet context={{
            activeTab,
            setActiveTab: handleTabChange,
            handleGenerateCharacter: handlers.handleGenerateCharacter,
            isAnalyzingCast
          }} />
        ) : (
          renderTabContent()
        )}
      </div>
      </CastTabActionsContext.Provider>
    </CastContext.Provider>
  );
}





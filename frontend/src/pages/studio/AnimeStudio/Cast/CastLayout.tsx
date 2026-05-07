import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { CastHeader } from './components/CastHeader';
import { CastToolbar, CastTab } from './components/CastToolbar';
import { CastTabs } from './Tabs/CastTabs';
import { RegistryTab } from './Tabs/RegistryTab';
import CharactersPage from './Tabs/Characters/CharactersPage';
import { DNAPage } from './DNAPage';
import { DynamicsPage } from './DynamicsPage';
import { IntegrityTab } from './Tabs/IntegrityTab';
import { AddLeadTab } from './Tabs/AddLeadTab';
import RelationshipsPage from './Tabs/Relationships/RelationshipsPage';
import {
  generateCharacters,
  generateRelationships,
  generateCastDNA,
  generateCastDynamics,
  generateCastIntegrity
} from '../../../../services/api/gemini';
import { CastLoadingPage } from './CastLoadingPage';
import { MOCK_CAST_DATA } from '@/services/generators/mockData';
import { studioLog, reportTabChange, reportGeneration } from '@/lib/studio-logger';

export const CastContext = React.createContext<{
  setHandlers: React.Dispatch<React.SetStateAction<any>>;
  handleLoadDemo?: () => void;
}>({ setHandlers: () => { } });

export const CastTabActionsContext = React.createContext<{
  handleGenerateDNA?: () => Promise<void>;
  handleGenerateDynamics?: () => Promise<void>;
  handleGenerateIntegrity?: () => Promise<void>;
  isAnalyzingCast?: boolean;
}>({});

export default function CastLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [handlers, setHandlers] = React.useState<any>({});

  const getTabFromPath = (path: string): CastTab => {
    if (path.includes('/cast/relationships') || path.includes('/cast/matrix')) return 'matrix';
    if (path.includes('/cast/characters')) return 'characters';
    if (path.includes('/cast/integrity')) return 'integrity';
    if (path.includes('/cast/add-lead')) return 'add-lead';
    if (path.includes('/cast/dna')) return 'dna';
    if (path.includes('/cast/dynamics')) return 'dynamics';
    if (path.endsWith('/cast')) return 'registry';
    return 'registry';
  };

  const [activeTab, setActiveTab] = React.useState<CastTab>(() => getTabFromPath(location.pathname));

  const { showNotification } = useApp();
  const {
    prompt, selectedModel, contentType, generatedWorld,
    session, episode, generatedCharacters, isSaving, isGeneratingCharacters, isAnalyzingCast,
    castList, characterRelationships, castDNA, castDynamics, castIntegrity
  } = useGeneratorState();

  const {
    setIsGeneratingCharacters, setCastData, setCastList,
    setGeneratedCharacters, setCharacterRelationships, syncCore,
    setCastDNA, setCastDynamics, setCastIntegrity, setIsAnalyzingCast
  } = useGeneratorDispatch();

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

  const handleGenerateDNA = async () => {
    if (!castList || castList.length === 0) return;
    setIsAnalyzingCast?.(true);
    reportGeneration('CastLayout', 'Trait Analysis (DNA)', 'request', 'anime');
    try {
      const dna = await generateCastDNA(JSON.stringify(castList), prompt, selectedModel);
      setCastDNA?.(dna);
      reportGeneration('CastLayout', 'Trait Analysis (DNA)', 'success', 'anime', { length: dna?.length || 0 });
      showNotification?.('Trait Analysis synchronized.', 'success');
    } catch (e: any) {
      reportGeneration('CastLayout', 'Trait Analysis (DNA)', 'failure', 'anime', e);
    } finally {
      setIsAnalyzingCast?.(false);
    }
  };

  const handleGenerateDynamics = async () => {
    if (!castList || castList.length === 0) return;
    setIsAnalyzingCast?.(true);
    reportGeneration('CastLayout', 'Relationship Dynamics', 'request', 'anime');
    try {
      const dyn = await generateCastDynamics(characterRelationships || '[]', JSON.stringify(castList), selectedModel);
      setCastDynamics?.(dyn);
      reportGeneration('CastLayout', 'Relationship Dynamics', 'success', 'anime', { length: dyn?.length || 0 });
      showNotification?.('Relationship Dynamics synchronized.', 'success');
    } catch (e: any) {
      reportGeneration('CastLayout', 'Relationship Dynamics', 'failure', 'anime', e);
    } finally {
      setIsAnalyzingCast?.(false);
    }
  };

  const handleGenerateIntegrity = async () => {
    if (!castList || castList.length === 0) return;
    setIsAnalyzingCast?.(true);
    reportGeneration('CastLayout', 'Integrity Audit', 'request', 'anime');
    try {
      const audit = await generateCastIntegrity(JSON.stringify(castList), selectedModel);
      setCastIntegrity?.(audit);
      reportGeneration('CastLayout', 'Integrity Audit', 'success', 'anime', { length: audit?.length || 0 });
      showNotification?.('Integrity Audit complete.', 'success');
    } catch (e: any) {
      reportGeneration('CastLayout', 'Integrity Audit', 'failure', 'anime', e);
    } finally {
      setIsAnalyzingCast?.(false);
    }
  };

  // Generate characters and relationships (all cast-related modules)
  const handleGenerateAll = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first before creating characters.', 'error');
      return;
    }

    setIsGeneratingCharacters(true);
    try {
      // Clear existing data to show empty states for pending tabs
      setCastData(null);
      setCastList([]);
      setGeneratedCharacters(null);
      setCharacterRelationships(null);
      setCastDNA(null);
      setCastDynamics(null);
      setCastIntegrity(null);

      // Start at Registry view
      const base = `/${contentType.toLowerCase()}/cast`;
      let result: any = null;
      if (handlers && handlers.handleGenerateCharacter) {
        try {
          await handlers.handleGenerateCharacter();
        } catch (hErr) {
          console.warn('Registered handler for character generation failed:', hErr);
        }
        // try to read generated castList from state via dispatch
        // we can't synchronously obtain the result object here, but state setters below will pick it up
      } else {
        reportGeneration('CastLayout', 'Characters generation', 'request', 'anime');
        result = await generateCharacters(prompt, selectedModel, contentType, generatedWorld || undefined);
        reportGeneration('CastLayout', 'Characters generation', 'success', 'anime', { length: JSON.stringify(result)?.length || 0 });
      }

      let characters: any[] = [];
      if (result) {
        if (typeof result === 'object' && result !== null) {
          if ('characters' in result) {
            setCastData(result);
            setCastList(result.characters);
            setGeneratedCharacters(JSON.stringify(result, null, 2));
            characters = result.characters;
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

      // Navigation flow (Response and Report)
      navigate(`${base}/characters`);
      await new Promise((r) => setTimeout(r, 2000));

      // Generate relationships
      try {
        const castNames = characters.length ? characters.map((c: any) => c.name) : [];
        if (castNames.length) {
          const castListStr = castNames.join(', ');
          reportGeneration('CastLayout', `Relationships for: ${castListStr}`, 'request', 'anime');
          const rels = await generateRelationships(prompt, castListStr, selectedModel, contentType);
          setCharacterRelationships(JSON.stringify(rels));
          reportGeneration('CastLayout', 'Relationships generation', 'success', 'anime', { length: JSON.stringify(rels)?.length || 0 });
          navigate(`${base}/relationships`);
          await new Promise((r) => setTimeout(r, 2000));
        } else {
          navigate(`${base}/relationships`);
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (relErr: any) {
        reportGeneration('CastLayout', 'Relationships generation', 'failure', 'anime', relErr);
      }

      // Run deep analysis
      navigate(`${base}/dna`);
      await handleGenerateDNA();
      await new Promise((r) => setTimeout(r, 2000));

      navigate(`${base}/dynamics`);
      await handleGenerateDynamics();
      await new Promise((r) => setTimeout(r, 2000));

      navigate(`${base}/integrity`);
      await handleGenerateIntegrity();
      await new Promise((r) => setTimeout(r, 2000));

      showNotification?.('Full Cast Nexus Synthesized.', 'success');
      navigate(`${base}/characters`);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'characters':
        return <CharactersPage />;
      case 'matrix':
        return <RelationshipsPage />;
      case 'dna':
        return <DNAPage />;
      case 'dynamics':
        return <DynamicsPage />;
      case 'integrity':
        return <IntegrityTab />;
      case 'add-lead':
        return <AddLeadTab />;
      case 'registry':
      default:
        return <RegistryTab />;
    }
  };

  return (
    <CastContext.Provider value={{ setHandlers, handleLoadDemo }}>
      <CastTabActionsContext.Provider value={{
        handleGenerateDNA,
        handleGenerateDynamics,
        handleGenerateIntegrity,
        isAnalyzingCast
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
            <CastTabs activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
        </div>

        {/* Toolbar Section */}
        {(generatedCharacters || characterRelationships || castDNA || castDynamics || castIntegrity) && (
          <div className="mb-8 relative z-30">
            <CastToolbar
              status={generatedCharacters ? 'active' : 'empty'}
              session={session}
              episode={episode}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              content={
                activeTab === 'characters' || activeTab === 'registry' ? generatedCharacters :
                activeTab === 'matrix' ? characterRelationships :
                activeTab === 'dna' ? JSON.stringify(castDNA) :
                activeTab === 'dynamics' ? JSON.stringify(castDynamics) :
                activeTab === 'integrity' ? JSON.stringify(castIntegrity) :
                generatedCharacters
              }
            />
          </div>
        )}

        {(isGeneratingCharacters || isAnalyzingCast) ? (
          <CastLoadingPage tab={activeTab} />
        ) : shouldRenderOutlet ? (
          <Outlet context={{
            activeTab,
            setActiveTab: handleTabChange,
            handleGenerateCharacter: handlers.handleGenerateCharacter,
            handleGenerateDNA,
            handleGenerateDynamics,
            handleGenerateIntegrity,
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





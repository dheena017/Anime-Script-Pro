import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateSeriesPlan } from '@/services/api/gemini';
import { SeriesHeader } from './components/SeriesHeader';
import { SeriesToolbar } from './components/SeriesToolbar';
import { SeriesTab } from './Tabs/SeriesTabs';
import { SeriesLoadingPage } from './components/SeriesLoadingPage';
import { SeriesCommandCenterProvider } from './context/SeriesCommandCenter';

export default function SeriesLayout() {
  const navigate = useNavigate();
  const [showScaffolder, setShowScaffolder] = React.useState(false);
  const location = useLocation();

  const {
    prompt,
    selectedModel,
    contentType,
    session,
    episode,
    generatedWorld,
    generatedCharacters,
    showNotification,
    isSaving,
    syncCore,
    isGeneratingSeries,
    setIsGeneratingSeries,
    generatedSeriesPlan,
    setGeneratedSeriesPlan,
    setGeneratedWorld,
    setGeneratedWorldLore,
    setGeneratedWorldPowers,
    setGeneratedWorldFactions,
    setGeneratedWorldArchitecture,
    setGeneratedWorldAtlas,
    setGeneratedWorldCulture,
    setGeneratedWorldSystems,
    setCastData,
    setCastList,
    setGeneratedCharacters,
    setCharacterRelationships,
    setCastDNA,
    setCastDynamics,
    setCastIntegrity,
    setGeneratedScript,
    setGeneratedImagePrompts,
    setGeneratedMetadata
  } = useGenerator();

  useAuth();

  const handleSave = async () => {
    await syncCore();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first before creating the series plan.', 'error');
      return;
    }
    setIsGeneratingSeries(true);
    try {
      // Full Project Reset: Clear all downstream data at the start of series generation
      setGeneratedSeriesPlan(null);
      setGeneratedWorld(null);
      setGeneratedWorldLore(null);
      setGeneratedWorldPowers(null);
      setGeneratedWorldFactions(null);
      setGeneratedWorldArchitecture(null);
      setGeneratedWorldAtlas(null);
      setGeneratedWorldCulture(null);
      setGeneratedWorldSystems(null);
      setCastData(null);
      setCastList([]);
      setGeneratedCharacters(null);
      setCharacterRelationships(null);
      setCastDNA(null);
      setCastDynamics(null);
      setCastIntegrity(null);
      setGeneratedScript(null);
      setGeneratedImagePrompts(null);
      setGeneratedMetadata(null);

      const totalEpisodes = 12; // Default
      console.log(`[SeriesLayout] Requesting series plan generation for ${totalEpisodes} episodes...`);
      const plan = await generateSeriesPlan(prompt, selectedModel, contentType, totalEpisodes, generatedWorld || undefined, generatedCharacters || undefined);
      setGeneratedSeriesPlan(plan);
      console.log(`[SeriesLayout] Series plan generated successfully. Response length: ${JSON.stringify(plan)?.length || 0} chars.`);
      
      // Response and Report Flow
      const base = `/${contentType.toLowerCase()}/series`;
      navigate(base); // roadmap
      await new Promise(r => setTimeout(r, 2000));
      
      navigate(`${base}/blueprint`);
      await new Promise(r => setTimeout(r, 2000));
      
      navigate(`${base}/episodes`);
      await new Promise(r => setTimeout(r, 2000));
      
      navigate(`${base}/timeline`);
      await new Promise(r => setTimeout(r, 2000));
      
      navigate(`${base}/arcs`);
      await new Promise(r => setTimeout(r, 2000));
      
      navigate(`${base}/assets`);
      await new Promise(r => setTimeout(r, 2000));

      navigate(base); // Return to roadmap
      showNotification?.('Full Series Blueprint Synthesized!', 'success');
    } catch (error: any) {
      console.error('[SeriesLayout] Failed to create series plan:', error);
      showNotification?.('Failed to create series plan: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsGeneratingSeries(false);
    }
  };

  const getActiveTab = (): SeriesTab => {
    const path = location.pathname;
    if (path.includes('/series/episodes')) return 'episodes';
    if (path.includes('/series/arcs')) return 'arcs';
    if (path.includes('/series/blueprint')) return 'blueprint';
    if (path.includes('/series/assets')) return 'assets';
    if (path.includes('/series/timeline')) return 'timeline';

    if (path.endsWith('/series') || path.includes('/series/roadmap')) return 'roadmap';

    return 'roadmap';
  };

  const [activeTab, setActiveTab] = React.useState<SeriesTab>(() => getActiveTab());

  const handleTabChange = (tab: SeriesTab) => {
    setActiveTab(tab);
  };

  React.useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  React.useEffect(() => {
    console.log(`[SeriesLayout] Active tab changed to: ${activeTab.toUpperCase()}`);
  }, [activeTab]);

  React.useEffect(() => {
    const handleGlobalGenerate = () => {
      console.log('[SeriesLayout] Global series generation event received.');
      handleGenerate();
    };
    window.addEventListener('studio-generate-series', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-series', handleGlobalGenerate);
  }, [handleGenerate]);

  return (
    <div className="space-y-6">
      <div className="studio-module-header">
        <SeriesHeader
          onRegenerate={handleGenerate}
          isGenerating={isGeneratingSeries}
          onPrev={() => navigate(`/${contentType.toLowerCase()}/cast`)}
          onNext={() => navigate(`/${contentType.toLowerCase()}/script`)}
          onSave={handleSave}
          isSaving={isSaving}
          hasContent={!!generatedSeriesPlan}
          session={session}
          episode={episode}
        />
      </div>

      <div className="studio-tabs-bar sticky top-0 z-40 flex items-center justify-center p-3 md:p-4 bg-[#050505]/95 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl mb-8 relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 w-full flex justify-center">
          <SeriesToolbar
            status={generatedSeriesPlan ? 'active' : 'empty'}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            session={session}
            episode={episode}
            onToggleScaffolder={() => setShowScaffolder(!showScaffolder)}
            showScaffolder={showScaffolder}
            onManifestClick={() => handleTabChange('roadmap')}
            onExportClick={() => {
              if (!generatedSeriesPlan) return;
              const blob = new Blob([JSON.stringify(generatedSeriesPlan, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `series-manifest-S${session}-E${episode}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            content={generatedSeriesPlan ? JSON.stringify(generatedSeriesPlan, null, 2) : null}
            showTabsOnly={true}
          />
        </div>
      </div>

      <SeriesCommandCenterProvider
        seriesPlan={(generatedSeriesPlan as any)?.episodes || []}
        handlers={{
          generateSeriesPlan: handleGenerate,
          updateEpisode: () => {},
          syncSeries: syncCore
        }}
      >
        {isGeneratingSeries ? (
          <SeriesLoadingPage tab={activeTab} />
        ) : (
          <Outlet context={{ showScaffolder, setShowScaffolder, activeTab }} />
        )}
      </SeriesCommandCenterProvider>
    </div>
  );
}




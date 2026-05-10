import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateSeriesPlan } from '@/services/api/gemini';
import { SeriesHeader } from './components/SeriesHeader';
import { SeriesToolbar } from './components/SeriesToolbar';
import { SeriesTabs, SeriesTab } from './Tabs/SeriesTabs';
import { SeriesLoadingPage } from './components/SeriesLoadingPage';
import { cn } from '@/lib/utils';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';

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
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    generatedCharacters,
    castList,
    characterRelationships,
    castDNA,
    currentScriptId,
    isSaving,
    isGeneratingSeries,
    generatedSeriesPlan,
    generationProgress
  } = useGeneratorState();

  const {
    setIsGeneratingSeries,
    setGeneratedSeriesPlan,
    setGeneratedScript,
    setGeneratedImagePrompts,
    setGeneratedMetadata,
    syncCore,
    showNotification,
    addLog: addGeneratorLog,
    setGenerationProgress
  } = useGeneratorDispatch();

  const [generationError, setGenerationError] = React.useState<string | null>(null);

  const projectId = React.useMemo(() => {
    const parsedProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    return Number.isFinite(parsedProjectId) ? parsedProjectId : undefined;
  }, [currentScriptId]);

  useAuth();

  const handleSave = async () => {
    await syncCore(projectId);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification?.('Please enter a story prompt first before creating the series plan.', 'error');
      return;
    }
    setGenerationError(null);
    setIsGeneratingSeries(true);
    setGenerationProgress(5);
    addGeneratorLog?.("SERIES", "STARTING", "Synthesizing full series roadmap and episode beats...");

    try {
      // We only reset the Series Plan, not the World or Cast. 
      // This allows the AI to use existing World/Cast data as the "Blueprint".
      setGeneratedSeriesPlan(null);
      setGeneratedScript(null);
      setGeneratedImagePrompts(null);
      setGeneratedMetadata(null);

      const totalEpisodes = 12; // Default
      
      // BUILD THE SOURCE OF TRUTH (WORLD BIBLE)
      const worldBible = [
        `MANIFEST: ${generatedWorld || 'N/A'}`,
        `HISTORY: ${generatedWorldLore || 'N/A'}`,
        `POWERS: ${generatedWorldPowers || 'N/A'}`,
        `FACTIONS: ${generatedWorldFactions || 'N/A'}`,
        `ARCHITECTURE: ${generatedWorldArchitecture || 'N/A'}`,
        `ATLAS: ${generatedWorldAtlas || 'N/A'}`,
        `CULTURE: ${generatedWorldCulture || 'N/A'}`,
        `SYSTEMS: ${generatedWorldSystems || 'N/A'}`
      ].join('\n\n');

      // BUILD THE CAST DNA
      const castContext = [
        `CHARACTERS: ${JSON.stringify(castList || [])}`,
        `RELATIONSHIPS: ${characterRelationships || 'N/A'}`,
        `DNA METADATA: ${JSON.stringify(castDNA || {})}`
      ].join('\n\n');

      console.log(`[SeriesLayout] Requesting series plan generation for ${totalEpisodes} episodes using full story bible...`);
      const rawPlan = await generateSeriesPlan(
        prompt, 
        selectedModel, 
        contentType, 
        totalEpisodes, 
        worldBible, 
        castContext
      );

      // Ensure we have a valid array
      const plan = Array.isArray(rawPlan) ? rawPlan : [];
      setGeneratedSeriesPlan(plan);
      console.log(`[SeriesLayout] Series plan synthesized. Count: ${plan.length} episodes.`);
      addGeneratorLog?.("SERIES", "SUCCESS", `Blueprint ready with ${plan.length} episodes.`);
      setGenerationProgress(100);
      
      // Response and Report Flow - Instant Impact
      const base = `/studio/series`;
      
      // We navigate directly to episodes now to avoid "one by one" delay feeling
      navigate(`${base}/episodes`); 
      
      console.log('[SeriesLayout] UI Transition complete. Final plan state:', {
        exists: !!plan,
        count: plan?.length,
        firstTitle: plan?.[0]?.title
      });
      showNotification?.('Full Series Blueprint Synthesized!', 'success');
    } catch (error: any) {
      const msg = error.message || 'Unknown error during synthesis';
      console.error('[SeriesLayout] Failed to create series plan:', error);
      setGenerationError(msg);
      addGeneratorLog?.("SERIES", "ERROR", `Synthesis failed: ${msg}`);
      showNotification?.('Failed to create series plan: ' + msg, 'error');
      
      // Stay on loading page for a few seconds to show the error before closing
      await new Promise(r => setTimeout(r, 4000));
    } finally {
      setIsGeneratingSeries(false);
      setGenerationProgress(0);
    }
  };

  const getActiveTab = (): SeriesTab => {
    const path = location.pathname;
    if (path.includes('/series/episodes')) return 'episodes';
    if (path.includes('/series/blueprint')) return 'blueprint';
    if (path.includes('/series/assets')) return 'assets';
    if (path.includes('/series/roadmap')) return 'roadmap';

    if (path.endsWith('/series')) return 'episodes';

    return 'episodes';
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
    <div className={cn("transition-all duration-700", generatedSeriesPlan && generatedSeriesPlan.length > 0 ? "space-y-6" : "space-y-0")}>
      {/* Global Header - Always visible for context and navigation */}
      <div className="studio-module-header">
        <SeriesHeader
          onRegenerate={handleGenerate}
          isGenerating={isGeneratingSeries}
          onClear={() => {
            setGeneratedSeriesPlan(null);
            setGeneratedScript(null);
            setGeneratedImagePrompts(null);
            setGeneratedMetadata(null);
            showNotification?.('Production manifest cleared', 'info');
          }}
          onPrev={() => {
            navigate(`/studio/cast`);
          }}
          onNext={() => {
            navigate(`/studio/script`);
          }}
          onManifest={() => handleTabChange('blueprint')}
          isManifestActive={activeTab === 'blueprint'}
          onSave={handleSave}
          isSaving={isSaving}
          hasContent={Boolean(generatedSeriesPlan && generatedSeriesPlan.length > 0)}
          session={session}
          episode={episode}
        />
      </div>

      {/* Tabs Bar - Always visible but clean and sticky */}
      <div className={cn(
        "studio-tabs-bar sticky top-0 z-40 flex items-center justify-center py-4 px-3 md:px-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 group transition-all duration-500",
        !(generatedSeriesPlan && generatedSeriesPlan.length > 0) && "border-t"
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-studio/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10 w-full flex justify-center">
          <SeriesTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
      </div>

      {/* Toolbar Section - Only show when content exists */}
      {generatedSeriesPlan && generatedSeriesPlan.length > 0 && (
        <div className="mb-8 relative z-30">
          <SeriesToolbar
            status="active"
            session={session}
            episode={episode}
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
            content={JSON.stringify(generatedSeriesPlan, null, 2)}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="relative flex-1">
        {isGeneratingSeries ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <SeriesLoadingPage 
              tab={activeTab} 
              progress={generationProgress} 
              error={generationError}
              title="Generating All Series Tabs"
              description="Orchestrating Roadmap, Episodes, Blueprint, and Assets..."
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <Outlet context={{ showScaffolder, setShowScaffolder, activeTab }} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { generateSeriesPlan } from '@/services/api/gemini';
import { SeriesHeader } from './components/SeriesHeader';
import { SeriesToolbar } from './components/SeriesToolbar';
import { SeriesTabs, SeriesTab } from './Tabs/SeriesTabs';
import { SeriesLoadingPage } from './components/SeriesLoadingPage';
import { cn } from '@/lib/utils';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';
import { seriesStyles as s } from './seriesStyles';
import { studioLog } from '@/lib/dev-console-logs';

export default function SeriesLayout() {
  const navigate = useNavigate();
  const [showScaffolder, setShowScaffolder] = React.useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

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
    characterList,
    characterRelationships,
    characterDNA,
    currentScriptId,
    isSaving,
    isGeneratingSeries,
    generatedSeriesPlan,
    generationProgress,
    temperature,
    maxTokens,
    topP,
    topK
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

  const getStoryboardBasePath = () => (
    currentScriptId ? `/projects/${currentScriptId}` : '/studio'
  );

  const handleGenerate = React.useCallback(async (episodesToGenerate: number, numScenes: number, sessionsToGenerate: number) => {
    if (!prompt) {
      showNotification?.('Project prompt is missing. Please define your series core logline.', 'warning');
      return;
    }
    setGenerationError(null);
    setIsGeneratingSeries(true);
    setGenerationProgress(5);
    addGeneratorLog?.("SERIES", "STARTING", `Synthesizing full series roadmap across ${sessionsToGenerate} sessions and ${episodesToGenerate} episode beats...`);

    try {
      // We only reset the Series Plan, not the World or Cast. 
      // This allows the AI to use existing World/Cast data as the "Blueprint".
      setGeneratedSeriesPlan(null);
      setGeneratedScript(null);
      setGeneratedImagePrompts(null);
      setGeneratedMetadata(null);

      const totalEpisodes = episodesToGenerate * sessionsToGenerate;

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
        `CHARACTERS: ${JSON.stringify(characterList || [])}`,
        `RELATIONSHIPS: ${characterRelationships || 'N/A'}`,
        `DNA METADATA: ${JSON.stringify(characterDNA || {})}`
      ].join('\n\n');

      studioLog("SERIES", `Requesting series plan generation for ${totalEpisodes} episodes using full story bible...`, 'anime');
      const rawPlan = await generateSeriesPlan(
        prompt,
        selectedModel,
        contentType,
        totalEpisodes,
        worldBible,
        castContext,
        true, // expandSequentially - Enable this to generate detailed scenes for each episode
        {
          session: String(sessionsToGenerate), // Pass custom sessions to the API as a string
          episodesPerSession: episodesToGenerate,
          episode,
          temperature,
          maxTokens,
          topP,
          topK,
          numScenes
        }
      );

      // Ensure we have a valid array
      const plan = Array.isArray(rawPlan) ? rawPlan : [];
      setGeneratedSeriesPlan(plan);
      studioLog("SERIES", `Series plan synthesized. Count: ${plan.length} episodes.`, 'success');
      addGeneratorLog?.("SERIES", "SUCCESS", `Series roadmap ready with ${plan.length} episodes.`);
      setGenerationProgress(100);

      // Response and Report Flow - Instant Impact
      const base = `/studio/series`;

      studioLog("SERIES", `UI Transition complete. Final plan state: ${plan?.length} episodes.`, 'info', {
        exists: !!plan,
        count: plan?.length,
        firstTitle: plan?.[0]?.title
      });
      showNotification?.('Full Series Roadmap Synthesized!', 'success');
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
  }, [
    prompt,
    selectedModel,
    contentType,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    characterList,
    characterRelationships,
    characterDNA,
    setGeneratedSeriesPlan,
    setGeneratedScript,
    setGeneratedImagePrompts,
    setGeneratedMetadata,
    setIsGeneratingSeries,
    setGenerationProgress,
    showNotification,
    addGeneratorLog,
    setSearchParams,
    temperature,
    maxTokens,
    topP,
    topK,
    session,
    episode
  ]);

  const VALID_TABS: SeriesTab[] = ['episodes', 'assets', 'blueprint'];
  const pathname = location.pathname;
  const pathTab = pathname.split('/').pop() as SeriesTab;
  const queryTab = searchParams.get('tab') as SeriesTab | null;

  const activeTab: SeriesTab = (queryTab && VALID_TABS.includes(queryTab))
    ? queryTab
    : (pathTab && VALID_TABS.includes(pathTab))
      ? pathTab
      : 'blueprint';

  const handleTabChange = (tab: SeriesTab) => {
    startTransition(() => {
      setSearchParams({ tab });
    });
  };

  React.useEffect(() => {
    studioLog("ROUTER", `Active tab changed to: ${activeTab.toUpperCase()}`, 'info');
  }, [activeTab]);

  React.useEffect(() => {
    const handleGlobalGenerate = (e: any) => {
      studioLog("SERIES", 'Global series generation event received.', 'anime');
      const hasDetail = e && e.detail;
      const customSessions = hasDetail ? e.detail.sessions : undefined;
      const customEpisodes = hasDetail ? e.detail.episodes : undefined;
      const customScenes = hasDetail ? e.detail.scenes : undefined;

      if (customSessions === undefined || customEpisodes === undefined || customScenes === undefined) {
        showNotification?.('Generation event must include explicit sessions, episodes and scenes counts.', 'warning');
        return;
      }

      handleGenerate(Number(customEpisodes), Number(customScenes), Number(customSessions));
    };
    window.addEventListener('studio-generate-series', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-series', handleGlobalGenerate);
  }, [handleGenerate]);

  return (
    <div className={cn("transition-all duration-700", generatedSeriesPlan && generatedSeriesPlan.length > 0 ? "space-y-6" : "space-y-0")}>
      {/* Global Header - Always visible for context and navigation */}
      <div className="studio-module-header">
        <SeriesHeader
          onPrev={() => {
            startTransition(() => {
              navigate(`${getStoryboardBasePath()}/cast`);
            });
          }}
          onNext={() => {
            startTransition(() => {
              navigate(`${getStoryboardBasePath()}/storyboard`);
            });
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
      <div className={s.tabs.tabsBar}>
        <div className={s.tabs.tabsBarGlow} />
        <div className={s.tabs.tabsBarInner}>
          <SeriesTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        <StudioTabsProgressBar progress={generationProgress} theme="cyan" />
      </div>

      {/* Toolbar Section - Always visible for Diagnostics */}
      <div className="mb-8 relative z-30">
        <SeriesToolbar
          status={generatedSeriesPlan && generatedSeriesPlan.length > 0 ? 'active' : 'empty'}
          session={session}
          episode={episode}
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
          onAddEpisode={() => {
            const nextEpNum = (generatedSeriesPlan?.length || 0) + 1;
            const nextEpId = nextEpNum < 10 ? `0${nextEpNum}` : `${nextEpNum}`;
            const newEpisode = {
              episode: nextEpId,
              title: `New Production Cycle ${nextEpId}`,
              hook: "A new narrative thread begins here.",
              summary: "This episode is currently in the conceptual phase. Generate specs to populate.",
              setting: "To be defined",
              emotional_arc: "Neutral",
              asset_matrix: { characters: [], locations: [], vfx: [] },
              detailed_episode_spec: { acts: [] }
            };
            setGeneratedSeriesPlan([...(generatedSeriesPlan || []), newEpisode]);
            showNotification?.(`Episode ${nextEpId} added to production roadmap`, 'success');
          }}
          onFilterArchive={() => {
            showNotification?.('Archive filtering system active. Showing all production units.', 'info');
          }}
          content={generatedSeriesPlan ? JSON.stringify(generatedSeriesPlan, null, 2) : null}
        />
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
            <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><SeriesLoadingPage tab={activeTab} progress={generationProgress} /></div>}>
              {isGeneratingSeries ? (
                <SeriesLoadingPage
                  tab={activeTab}
                  progress={generationProgress}
                  error={generationError}
                  title="Generating All Series Tabs"
                  description="Orchestrating Roadmap, Episodes, and Assets..."
                />
              ) : (
                <Outlet context={{ showScaffolder, setShowScaffolder, activeTab }} />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

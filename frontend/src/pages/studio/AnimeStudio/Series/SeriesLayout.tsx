import React, { startTransition, Suspense } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';
import { SeriesHeader } from './components/SeriesHeader';
import { SeriesToolbar } from './components/SeriesToolbar';
import { SeriesTabs, SeriesTab } from './Tabs/SeriesTabs';
import { cn } from '@/lib/utils';
import { StudioTabsProgressBar } from '@/pages/studio/components/studio/layout/StudioTabsProgressBar';
import { seriesStyles as s } from './seriesStyles';
import { studioLog } from '@/lib/dev-console-logs';
import { generateSeriesPlan } from '@/services/generators/seriesGenerator';

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
    generatedScript,
    generationProgress,
    temperature,
    maxTokens,
    topP,
    topK,
    numEpisodes,
    numScenes
  } = useGeneratorState();

  const {
    setIsGeneratingSeries,
    setGeneratedSeriesPlan,
    setGeneratedScript,
    setGeneratedImagePrompts,
    setGeneratedMetadata,
    setSession: setGlobalSession,
    setNumEpisodes: setGlobalNumEpisodes,
    setNumScenes: setGlobalNumScenes,
    syncCore,
    showNotification,
    addLog: addGeneratorLog,
    setGenerationProgress,
    stopGeneration
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

  const MAX_TOTAL_EPISODES = 120;

  type GenerateSeriesArgs = {
    episodesPerSession: number;
    sessions: number;
    scenes: number;
    frames?: number;
  };

  const handleGenerate = React.useCallback(async (params: GenerateSeriesArgs) => {
    const { episodesPerSession, scenes: resolvedScenes, sessions: resolvedSessions, frames: resolvedFrames } = params;

    const episodesCount = Number(episodesPerSession);
    const sceneCount = Number(resolvedScenes);
    const sessionsCount = Number(resolvedSessions);
    const framesCount = resolvedFrames !== undefined ? Number(resolvedFrames) : undefined;

    console.log('🎬 [handleGenerate] CALLED with:', { episodesPerSession: episodesCount, scenes: sceneCount, sessions: sessionsCount });

    const missingFields: string[] = [];
    if (!Number.isFinite(sessionsCount) || sessionsCount <= 0) missingFields.push('Session Count');
    if (!Number.isFinite(episodesCount) || episodesCount <= 0) missingFields.push('Episodes Per Session');
    if (!Number.isFinite(sceneCount) || sceneCount <= 0) missingFields.push('Scenes Per Episode');

    if (missingFields.length > 0) {
      const message = `Please enter valid values for: ${missingFields.join(', ')}.`;
      console.error('❌ [handleGenerate] Missing or invalid generation fields:', { missingFields, episodesPerSession, resolvedScenes, resolvedSessions, resolvedFrames });
      showNotification?.(message, 'error');
      setGenerationError(message);
      return;
    }

    if (framesCount !== undefined && (!Number.isFinite(framesCount) || framesCount <= 0)) {
      const message = `Frames Per Scene must be a positive number.`;
      console.error('❌ [handleGenerate] Invalid frames count:', { framesCount });
      showNotification?.(message, 'error');
      setGenerationError(message);
      return;
    }
    
    const totalEpisodes = episodesCount * sessionsCount;
    if (totalEpisodes > MAX_TOTAL_EPISODES) {
      console.warn(`Requested ${totalEpisodes} total episodes exceeds the safe generation cap of ${MAX_TOTAL_EPISODES}.`);
      showNotification?.(`Total episodes (${totalEpisodes}) is too high for a single AI generation pass. Reduce sessions or episodes to ${MAX_TOTAL_EPISODES} total or fewer.`, 'warning');
      setGenerationError(`Too many episodes requested: ${totalEpisodes}. Reduce sessions or episodes.`);
      return;
    }

    if (!prompt) {
      console.error('❌ [handleGenerate] Missing prompt:', prompt);
      showNotification?.('Project prompt is missing. Please define your series core logline.', 'warning');
      return;
    }
    
    console.log('🎬 [handleGenerate] Prompt validated, starting generation');
    setGenerationError(null);
    setGlobalSession(String(sessionsCount));
    setGlobalNumEpisodes(episodesCount);
    setGlobalNumScenes(String(sceneCount));
    startTransition(() => {
      setSearchParams({ tab: 'blueprint' });
    });
    setIsGeneratingSeries(true);
    setGenerationProgress(5);
    addGeneratorLog?.("SERIES", "STARTING", `Synthesizing full series roadmap across ${sessionsCount} sessions and ${episodesCount} episode beats...`);

    try {
      // We only reset the Series Plan, not the World or Cast. 
      // This allows the AI to use existing World/Cast data as the "Blueprint".
      setGeneratedSeriesPlan(null);
      setGeneratedScript(null);
      setGeneratedImagePrompts(null);
      setGeneratedMetadata(null);

      const totalEpisodes = episodesCount * sessionsCount;

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

      const plan: any[] = [];
      for (let episodeIndex = 0; episodeIndex < totalEpisodes; episodeIndex += 1) {
        const episodeNumber = episodeIndex + 1;
        studioLog("SERIES", `Generating episode ${episodeNumber} of ${totalEpisodes}...`, 'info');
        setGenerationProgress(Math.round((episodeIndex / totalEpisodes) * 80) + 10);

        try {
          const batch = await generateSeriesPlan(
            prompt,
            selectedModel,
            contentType,
            1,
            worldBible,
            castContext,
            true,
            {
              session: String(sessionsCount),
              episodesPerSession: episodesCount,
              totalEpisodes,
              episode: String(episodeNumber),
              episodeOffset: episodeIndex,
              temperature,
              maxTokens,
              topP,
              topK,
              numScenes: sceneCount,
              numFrames: Number.isFinite(framesCount as number) ? framesCount : undefined,
            }
          );

          const nextEpisode = Array.isArray(batch) && batch.length > 0 ? batch[0] : null;
          if (nextEpisode) {
            plan.push(nextEpisode);
            setGeneratedSeriesPlan([...plan]);
            addGeneratorLog?.("SERIES", "PROGRESS", `Episode ${episodeNumber}/${totalEpisodes} generated.`);
            setGenerationProgress(Math.round(((episodeNumber) / totalEpisodes) * 90) + 5);
          } else {
            console.warn(`Episode ${episodeNumber} returned no usable data.`);
          }
        } catch (episodeError: any) {
          const episodeMsg = episodeError?.message || `Episode ${episodeNumber} generation failed.`;
          console.error(`[SeriesLayout] ${episodeMsg}`, episodeError);
          addGeneratorLog?.("SERIES", "WARNING", `Episode ${episodeNumber} failed: ${episodeMsg}`);
          setGenerationError(episodeMsg);
          showNotification?.(`Episode ${episodeNumber} failed; partial plan is available.`, 'warning');
          break;
        }
      }

      const rawPlan = plan;
      const finalPlan = Array.isArray(rawPlan) ? rawPlan : [];
      setGeneratedSeriesPlan(finalPlan);
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

  const hasSeriesOutput = Boolean(
    (generatedSeriesPlan && generatedSeriesPlan.length > 0) ||
    (generatedScript && generatedScript.trim().length > 0)
  );
  const VALID_TABS: SeriesTab[] = hasSeriesOutput
    ? ['episodes', 'blueprint', 'ai-output']
    : ['blueprint'];
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
      console.log('🎬 [SeriesLayout EVENT LISTENER] Received studio-generate-series event:', e?.detail);
      studioLog("SERIES", 'Global series generation event received.', 'anime');
      const hasDetail = e && e.detail;
      const customSessions = hasDetail ? e.detail.sessions : undefined;
      const customEpisodes = hasDetail ? (e.detail.episodesPerSession ?? e.detail.episodes) : undefined;
      const customScenes = hasDetail ? e.detail.scenes : undefined;
      const customFrames = hasDetail ? e.detail.frames : undefined;

      console.log('🎬 [SeriesLayout EVENT LISTENER] Parsed values:', { customSessions, customEpisodes, customScenes, customFrames });

      if (customSessions === undefined || customEpisodes === undefined || customScenes === undefined) {
        console.error('❌ [SeriesLayout EVENT LISTENER] Missing required values');
        showNotification?.('Generation event must include explicit sessions, episodes and scenes counts.', 'warning');
        return;
      }

      console.log('🎬 [SeriesLayout EVENT LISTENER] Calling handleGenerate with:', { episodesPerSession: customEpisodes, scenes: customScenes, sessions: customSessions, frames: customFrames });
      handleGenerate({
        episodesPerSession: Number(customEpisodes),
        scenes: Number(customScenes),
        sessions: Number(customSessions),
        frames: customFrames !== undefined ? Number(customFrames) : undefined,
      });
    };
    window.addEventListener('studio-generate-series', handleGlobalGenerate);
    return () => window.removeEventListener('studio-generate-series', handleGlobalGenerate);
  }, [handleGenerate]);

  return (
    <div className={cn(generatedSeriesPlan && generatedSeriesPlan.length > 0 ? "space-y-6" : "space-y-0")}>
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
          onGenerate={() => {
            if (isGeneratingSeries) {
              stopGeneration?.();
              return;
            }

            handleGenerate({
              episodesPerSession: numEpisodes,
              sessions: Number(session),
              scenes: Number(numScenes)
            });
          }}
          isSaving={isSaving}
          isGenerating={isGeneratingSeries}
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
          <div className="flex-1 flex flex-col">
            <Suspense fallback={<div className="flex-1" />}>
              <Outlet context={{ showScaffolder, setShowScaffolder, activeTab, onGenerateSeries: handleGenerate }} />
            </Suspense>
          </div>
      </div>
    </div>
  );
}

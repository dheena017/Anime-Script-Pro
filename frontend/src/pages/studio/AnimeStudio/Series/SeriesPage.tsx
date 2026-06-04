import React from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { generateProductionSequences } from '@/lib/sequence-utils';
import { apiRequest } from '@/lib/api-utils';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SeriesTab } from './Tabs/SeriesTabs';
import { BlueprintTab } from './Tabs/BlueprintTab';
import { AIOutputTab } from './Tabs/AIOutputTab';


import { SeriesEmptyState } from './components/SeriesEmptyState';
import EpisodesPage from './Episodes/EpisodesPage';

import { seriesStyles as s } from './seriesStyles';

export function SeriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncDate, setLastSyncDate] = React.useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const context = useOutletContext<{ activeTab?: SeriesTab; onGenerateSeries?: (params: { episodesPerSession: number; sessions: number; scenes: number; frames?: number }) => void }>();
  const activeTab = context?.activeTab || 'episodes';

  const {
    generatedSeriesPlan,
    isGeneratingSeries,
    generatedScript,
    prompt,
    currentScriptId,
    contentType,
    productionSequence,
    isEditing,
  } = useGeneratorState();
  const {
    setGeneratedSeriesPlan,
    setProductionSequence,
    setSession,
    setNumEpisodes,
    setNumScenes,
    setEpisode,
    syncCore,
    showNotification,
    loadDemoProject
  } = useGeneratorDispatch();

  const projectId = React.useMemo(() => {
    const currentProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    if (Number.isFinite(currentProjectId)) {
      return currentProjectId;
    }

    const promptProjectId = Number.parseInt(prompt, 10);
    return Number.isFinite(promptProjectId) ? promptProjectId : undefined;
  }, [currentScriptId, prompt]);

  const studioBase = currentScriptId ? `/projects/${currentScriptId}` : '/studio';

  const handleLoadDemo = () => {
    loadDemoProject();
  };

  const handleUpdateEpisode = (index: number, updates: any) => {
    if (!generatedSeriesPlan) return;
    const newPlan = [...generatedSeriesPlan];
    newPlan[index] = { ...newPlan[index], ...updates };
    setGeneratedSeriesPlan(newPlan);
  };



  const applySequenceItem = (sess: number, ep: number, scen: number) => {
    setSession(sess.toString());
    setEpisode(ep.toString());

    const explicitIndex = productionSequence.findIndex(
      (unit) => unit.sess === sess && unit.ep === ep && unit.scen === scen
    );

    let sceneIndex = explicitIndex >= 0 ? explicitIndex : Math.max(0, scen - 1);

    const sceneRows = generatedScript
      ? generatedScript
        .split('\n')
        .filter((line) => line.includes('|') && !line.includes('---'))
        .slice(1)
      : [];

    if (sceneRows.length === 0) {
      showNotification?.('Storyboard scenes are not generated yet. Opening storyboard workspace.', 'info');
      navigate(`${studioBase}/storyboard/scenes`);
      return;
    }

    if (sceneIndex >= sceneRows.length) {
      sceneIndex = sceneRows.length - 1;
      showNotification?.(`Requested scene is outside the generated range. Loading Scene ${sceneIndex + 1} instead.`, 'info');
    }

    const currentUnit = productionSequence.find(
      (unit) => unit.sess === sess && unit.ep === ep && unit.scen === scen
    );
    showNotification?.(
      `Loaded ${currentUnit?.sessionName || `Session ${sess}`} / E${ep} / ${currentUnit?.sceneName || `Scene ${scen}`}.`,
      'success'
    );
    navigate(`${studioBase}/storyboard/scenes/${sceneIndex}`);
  };

  const handleManifestContinue = async (config: { episodes: number; sessions?: number; scenes?: number; persist?: boolean }) => {
    console.log('🎬 [handleManifestContinue] Called with config:', config);
    
    // Require explicit sessions and scenes — do not silently default values.
    if (config.sessions === undefined || config.scenes === undefined) {
      const error = 'Missing sessions or scenes in config';
      console.error('❌ [handleManifestContinue]', error);
      showNotification?.('Please provide explicit session and scene counts before continuing.', 'warning');
      throw new Error(error);
    }

    const resolvedSessions = config.sessions;
    const resolvedScenes = config.scenes;
    const shouldPersist = config.persist ?? false;

    const sequence = generateProductionSequences(
      resolvedSessions,
      config.episodes,
      resolvedScenes
    );
    // Persist scaffolding selections into global generator state so HUD and other modules reflect them
    setProductionSequence(sequence);
    try {
      setNumEpisodes?.(config.episodes);
      setNumScenes?.(String(resolvedScenes));
      setSession?.(String(resolvedSessions));
    } catch (e) {
      // ignore if not available
      console.warn('[handleManifestContinue] Warning setting state values:', e);
    }
    
    if (!user) {
      const error = 'User not authenticated';
      console.warn('⚠️ [handleManifestContinue]', error, '- Skipping database sync but will continue with AI generation');
      // Don't throw - allow series generation to proceed via event dispatch
      showNotification?.('Skipping database sync (not authenticated) - AI generation will proceed', 'info');
      return;
    }

    if (!shouldPersist) {
      console.info('🎬 [handleManifestContinue] Temporary generation requested; skipping database persistence.');
      return;
    }
    
    console.log('🎬 [handleManifestContinue] User authenticated, syncing scenes to database');
    setIsSyncing(true);

    try {
      let activeProjectId = projectId;

      if (!activeProjectId) {
        const error = 'No active project ID';
        console.warn('⚠️ [handleManifestContinue]', error, '- Skipping database sync');
        showNotification?.('Project not yet saved - skipping database sync (will still generate series)', 'info');
        return;
      }

      const scenesPayload = sequence.map((u, idx) => {
        const globalEpIndex = (u.sess - 1) * config.episodes + u.ep;
        const sceneNumber = (globalEpIndex - 1) * resolvedScenes + u.scen;
        return {
          scene_number: sceneNumber,
          status: 'QUEUED',
          visual_variance_index: Math.floor(idx / 4)
        };
      });

      console.log('🎬 [handleManifestContinue] Calling API to create scenes:', { project_id: activeProjectId, sceneCount: scenesPayload.length });
      
      const resJson = await apiRequest<{ episodes?: Array<any>; scenes?: Array<any> }>('/api/scenes', {
        method: 'POST',
        label: 'Bulk Scene Sync',
        body: JSON.stringify({
          project_id: activeProjectId,
          scenes: scenesPayload,
          scenes_per_episode: resolvedScenes
        })
      });

      const createdEpisodesCount = (resJson.episodes || []).length;
      const createdScenesCount = (resJson.scenes || []).length;
      console.log('🎬 [handleManifestContinue] Scenes created successfully:', { createdEpisodesCount, createdScenesCount });
      
      showNotification?.(`Successfully materialized ${createdScenesCount} scenes across ${createdEpisodesCount} episodes`, 'success');
      setLastSyncDate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('⚠️ [handleManifestContinue] Production Matrix Sync failed:', error);
      showNotification?.('Database sync failed: ' + (error as Error).message + ' (will continue with AI generation)', 'warning');
      // Don't rethrow - allow series generation to proceed via event dispatch
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    await syncCore(projectId);
  };



  const renderTabContent = () => {
    if ((!generatedSeriesPlan || generatedSeriesPlan.length === 0) && activeTab !== 'blueprint') {
      return (
        <SeriesEmptyState
          onLaunch={() => setSearchParams({ tab: 'blueprint' })}
          onLoadDemo={loadDemoProject}
          isGenerating={isGeneratingSeries}
        />
      );
    }

    switch (activeTab) {
      case 'ai-output':
        return <AIOutputTab plan={generatedSeriesPlan || []} script={generatedScript} />;
      case 'episodes':
        return <EpisodesPage />;
      case 'blueprint':
        return (
          <BlueprintTab
            showScaffolder={true}
            onManifestContinue={handleManifestContinue}
            onGenerateSeries={context?.onGenerateSeries}
            isSyncing={isSyncing}
            lastSyncDate={lastSyncDate}
            productionSequence={productionSequence}
            applySequenceItem={applySequenceItem}
            plan={generatedSeriesPlan || []}
            onViewEpisode={(epNum, section) => navigate(`${studioBase}/series/episodes/${epNum}${section ? `?section=${section}` : ''}`)}
          />
        );


      default:
        return <EpisodesPage />;
    }
  };

  return (
    <div data-testid="marker-series-planning">
      <Card className={cn(
        s.page.mainCard,
      )}>
        <div className={s.page.contentWrapper}>
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
}

export default SeriesPage;

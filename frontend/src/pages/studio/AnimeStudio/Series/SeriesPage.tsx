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

import { AssetsTab } from './Tabs/AssetsTab';
import { SeriesEmptyState } from './components/SeriesEmptyState';
import EpisodesPage from './Episodes/EpisodesPage';

import { SeriesLoadingPage } from './components/SeriesLoadingPage';

import { seriesStyles as s } from './seriesStyles';

export function SeriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncDate, setLastSyncDate] = React.useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const context = useOutletContext<{ activeTab?: SeriesTab }>();
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

  const handleLoadDemo = () => {
    loadDemoProject();
  };

  const handleUpdateEpisode = (index: number, updates: any) => {
    if (!generatedSeriesPlan) return;
    const newPlan = [...generatedSeriesPlan];
    newPlan[index] = { ...newPlan[index], ...updates };
    setGeneratedSeriesPlan(newPlan);
  };

  const handleUpdateAssetMatrix = (index: number, updates: any) => {
    if (!generatedSeriesPlan) return;
    const newPlan = [...generatedSeriesPlan];
    newPlan[index] = {
      ...newPlan[index],
      asset_matrix: { ...newPlan[index].asset_matrix, ...updates }
    };
    setGeneratedSeriesPlan(newPlan);
  };

  const applySequenceItem = (sess: number, ep: number, scen: number) => {
    setSession(sess.toString());
    setEpisode(ep.toString());

    const studioBase = currentScriptId ? `/projects/${currentScriptId}` : '/studio';

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

  const handleManifestContinue = async (config: { sessions: number; episodes: number; scenes: number }) => {
    const sequence = generateProductionSequences(
      config.sessions,
      config.episodes,
      config.scenes
    );
    setProductionSequence(sequence);

    if (!user) return;
    setIsSyncing(true);

    try {
      let activeProjectId = projectId;

      if (!activeProjectId) {
        showNotification?.('Project must be saved to establish database link. Please save manually to continue.', 'warning');
        return;
      }

      const scenesPayload = sequence.map((u, idx) => {
        const sceneNumber = (u.ep - 1) * config.scenes + u.scen;
        return {
          scene_number: sceneNumber,
          status: 'QUEUED',
          visual_variance_index: Math.floor(idx / 4)
        };
      });

      const resJson = await apiRequest<{ episodes?: Array<any>; scenes?: Array<any> }>('/api/scenes', {
        method: 'POST',
        label: 'Bulk Scene Sync',
        body: JSON.stringify({ project_id: activeProjectId, scenes: scenesPayload })
      });

      const createdEpisodesCount = (resJson.episodes || []).length;
      const createdScenesCount = (resJson.scenes || []).length;
      showNotification?.(`Successfully materialized ${createdScenesCount} scenes across ${createdEpisodesCount} episodes`, 'success');
      setLastSyncDate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Production Matrix Sync Failed:', error);
      showNotification?.('Failed to sync production roadmap: ' + (error as Error).message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    await syncCore(projectId);
  };

  const getLoadingMessage = () => {
    switch (activeTab) {
      case 'assets': return "Calculating Resource Matrix...";
      case 'episodes': return "Indexing Episodes Library...";
      default: return "Mapping Production Roadmap...";
    }
  };

  const renderTabContent = () => {
    // Only show global loading if NOT on the blueprint tab (which has its own HUD)
    if (isGeneratingSeries) {
      return (
        <SeriesLoadingPage
          message={getLoadingMessage()}
          subtext="AI model is processing episodic metadata"
        />
      );
    }

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
      case 'episodes':
        return <EpisodesPage />;
      case 'blueprint':
        return (
          <BlueprintTab
            showScaffolder={true}
            onManifestContinue={handleManifestContinue}
            isSyncing={isSyncing}
            lastSyncDate={lastSyncDate}
            productionSequence={productionSequence}
            applySequenceItem={applySequenceItem}
            plan={generatedSeriesPlan || []}
          />
        );

      case 'assets':
        return <AssetsTab plan={generatedSeriesPlan || []} />;
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

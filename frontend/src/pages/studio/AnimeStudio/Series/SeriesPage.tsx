import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { generateProductionSequences } from '@/lib/sequence-utils';
import { apiRequest } from '@/lib/api-utils';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SeriesTab } from './Tabs/SeriesTabs';

// Modularized Tab Components
import { RoadmapTab } from './Tabs/RoadmapTab';
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
  const context = useOutletContext<{ activeTab?: SeriesTab }>();
  const activeTab = context?.activeTab || 'episodes';

  const {
    generatedSeriesPlan,
    isGeneratingSeries,
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

  const applySequenceItem = (sess: number, ep: number) => {
    setSession(sess.toString());
    setEpisode(ep.toString());
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
        showNotification?.('Auto-saving project to establish database link...', 'info');
        activeProjectId = await syncCore();
        if (!activeProjectId) {
          throw new Error('Could not auto-save project. Please save manually first.');
        }
      }

      const scenesPayload = sequence.map((u, idx) => {
        const sceneNumber = (u.ep - 1) * 16 + u.scen;
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
      case 'blueprint': return "Architecting Production Sequence...";
      case 'episodes': return "Indexing Episodes Library...";
      default: return "Mapping Production Roadmap...";
    }
  };

  const renderTabContent = () => {
    if (isGeneratingSeries) {
      return (
        <SeriesLoadingPage
          message={getLoadingMessage()}
          subtext="AI model is processing episodic metadata"
        />
      );
    }
    
    if (!generatedSeriesPlan || generatedSeriesPlan.length === 0) {
      return (
        <SeriesEmptyState
          onLaunch={() => window.dispatchEvent(new CustomEvent('studio-generate-series'))}
          onLoadDemo={loadDemoProject}
          isGenerating={isGeneratingSeries}
        />
      );
    }

    switch (activeTab) {
      case 'roadmap':
        return (
          <RoadmapTab
            plan={generatedSeriesPlan || []}
            isEditing={isEditing}
            onUpdateEpisode={handleUpdateEpisode}
            onUpdateAssetMatrix={handleUpdateAssetMatrix}
            onFocusEpisode={(epNum) => {
              const studioBase = currentScriptId ? `/projects/${currentScriptId}` : '/studio';
              setEpisode(epNum);
              navigate(`${studioBase}/script`);
            }}
            onViewEpisode={(epNum) => {
              const studioBase = currentScriptId ? `/projects/${currentScriptId}` : '/studio';
              navigate(`${studioBase}/series/episodes/${epNum}`);
            }}
          />
        );
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
        activeTab === 'roadmap' ? "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:border-studio/50" : ""
      )}>
        <div className={cn(
          s.page.innerBorder,
          activeTab === 'roadmap' ? "border-studio/20 group-hover/card:border-studio/40" : ""
        )} />

        <div className={s.page.contentWrapper}>
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
}





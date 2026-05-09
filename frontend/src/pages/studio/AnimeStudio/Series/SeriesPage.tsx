import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useGenerator } from '@/hooks/useGenerator';
import { generateProductionSequences } from '@/lib/sequence-utils';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { SeriesTab } from './Tabs/SeriesTabs';

// Modularized Tab Components
import { RoadmapTab } from './Tabs/RoadmapTab';
import { BlueprintTab } from './Tabs/BlueprintTab';
import { AssetsTab } from './Tabs/AssetsTab';
import { SeriesEmptyState } from './components/SeriesEmptyState';
import EpisodesPage from './Episodes/EpisodesPage';

import { MOCK_SERIES_PLAN } from '@/services/generators/mockData';
import { SeriesLoadingPage } from './components/SeriesLoadingPage';

export function SeriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncDate, setLastSyncDate] = React.useState<string | null>(null);
  const context = useOutletContext<{ activeTab?: SeriesTab }>();
  const activeTab = context?.activeTab || 'episodes';

  const {
    generatedSeriesPlan,
    setGeneratedSeriesPlan,
    isGeneratingSeries,
    prompt,
    currentScriptId,
    contentType,
    productionSequence,
    setProductionSequence,
    setSession,
    setEpisode,
    syncCore,
    isEditing,
    showNotification
  } = useGenerator();

  const projectId = React.useMemo(() => {
    const currentProjectId = currentScriptId ? Number.parseInt(currentScriptId, 10) : undefined;
    if (Number.isFinite(currentProjectId)) {
      return currentProjectId;
    }

    const promptProjectId = Number.parseInt(prompt, 10);
    return Number.isFinite(promptProjectId) ? promptProjectId : undefined;
  }, [currentScriptId, prompt]);

  const handleLoadDemo = () => {
    setGeneratedSeriesPlan(MOCK_SERIES_PLAN);
    showNotification?.('Loaded "Aetheria" Sample Production Manifest', 'success');
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
      if (!projectId) {
        throw new Error('Missing project id');
      }

      const uniqueEpisodes = Array.from(new Set(sequence.map(u => u.ep)));
      const episodesPayload = uniqueEpisodes.map(epNum => ({ episode_number: epNum, title: `Episode ${epNum}` }));

      const epsRes = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ project_id: projectId, episodes: episodesPayload })
      });

      if (!epsRes.ok) throw new Error('Failed to create episodes');
      const createdEpisodes = await epsRes.json();

      const episodeMap: Record<number, number> = {};
      (createdEpisodes || []).forEach((e: any) => {
        if (e.episode_number != null && e.id != null) episodeMap[Number(e.episode_number)] = Number(e.id);
        if (e.episode_number != null && e.episode_id != null) episodeMap[Number(e.episode_number)] = Number(e.episode_id);
      });

      const scenesPayload = sequence.map((u, idx) => {
        const sceneNumber = (u.ep - 1) * 16 + u.scen;
        const epId = episodeMap[u.ep];
        return {
          episode_id: epId,
          scene_number: sceneNumber,
          status: 'QUEUED',
          visual_variance_index: Math.floor(idx / 4)
        };
      });

      const res = await fetch('/api/scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ project_id: projectId, scenes: scenesPayload })
      });

      if (!res.ok) throw new Error('Bulk sync failed');
      const resJson = await res.json();
      const createdEpisodesCount = (resJson.episodes || []).length;
      const createdScenesCount = (resJson.scenes || []).length;
      showNotification?.(`Synced ${createdScenesCount} scenes and ${createdEpisodesCount} episodes`, 'success');
      setLastSyncDate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Bulk sync failed:', error);
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

    switch (activeTab) {
      case 'roadmap':
        return (
          <RoadmapTab
            plan={generatedSeriesPlan || []}
            isEditing={isEditing}
            onUpdateEpisode={handleUpdateEpisode}
            onUpdateAssetMatrix={handleUpdateAssetMatrix}
            onFocusEpisode={(epNum) => {
              setEpisode(epNum);
              navigate(`/${contentType.toLowerCase()}/script`);
            }}
            onViewEpisode={(epNum) => {
              navigate(`/${contentType.toLowerCase()}/series/episodes/${epNum}`);
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
        "bg-[#030303]/40 backdrop-blur-md overflow-hidden rounded-3xl relative group/card transition-all duration-700",
        activeTab === 'roadmap'
          ? "border-studio/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:border-studio/50"
          : "border-zinc-800/30 hover:border-zinc-700"
      )}>
        <div className={cn(
          "absolute inset-0 border-[1px] rounded-3xl pointer-events-none transition-colors duration-700",
          activeTab === 'roadmap' ? "border-studio/20 group-hover/card:border-studio/40" : "border-white/5"
        )} />

        <div className="w-full p-8 lg:p-10 max-w-[1400px] mx-auto">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
}





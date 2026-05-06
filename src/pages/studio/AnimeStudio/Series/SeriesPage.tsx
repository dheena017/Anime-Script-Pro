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
import { ArcsTab } from './Tabs/ArcsTab';
import { AssetsTab } from './Tabs/AssetsTab';
import { TimelineTab } from './Tabs/TimelineTab';
import { SeriesEmptyState } from './components/SeriesEmptyState';
import EpisodesPage from './Episodes/EpisodesPage';

import { MOCK_SERIES_PLAN } from '@/services/generators/mockData';
import { SeriesLoadingPage } from './components/SeriesLoadingPage';

export function SeriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSyncDate, setLastSyncDate] = React.useState<string | null>(null);
  const { activeTab } = useOutletContext<{ activeTab: SeriesTab }>();

  const {
    generatedSeriesPlan,
    setGeneratedSeriesPlan,
    isGeneratingSeries,
    prompt,
    contentType,
    productionSequence,
    setProductionSequence,
    setSession,
    setEpisode,
    isEditing,
    showNotification
  } = useGenerator();

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
      // Validate project id
      if (!prompt || String(prompt).trim() === '') {
        throw new Error('Missing project id');
      }

      // Create any missing episodes first so we have their ids
      const uniqueEpisodes = Array.from(new Set(sequence.map(u => u.ep)));
      const episodesPayload = uniqueEpisodes.map(epNum => ({ episode_number: epNum, title: `Episode ${epNum}` }));

      const epsRes = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ project_id: prompt, episodes: episodesPayload })
      });

      if (!epsRes.ok) throw new Error('Failed to create episodes');
      const createdEpisodes = await epsRes.json();
      // createdEpisodes may be an array of episode objects with id and episode_number
      const episodeMap: Record<number, number> = {};
      (createdEpisodes || []).forEach((e: any) => {
        if (e.episode_number != null && e.id != null) episodeMap[Number(e.episode_number)] = Number(e.id);
        if (e.episode_number != null && e.episode_id != null) episodeMap[Number(e.episode_number)] = Number(e.episode_id);
      });

      // Build scenes payload including per-scene episode_id
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
        body: JSON.stringify({ project_id: prompt, scenes: scenesPayload })
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

  const getLoadingMessage = () => {
    switch (activeTab) {
      case 'arcs': return "Synthesizing Narrative Arcs...";
      case 'assets': return "Calculating Resource Matrix...";
      case 'timeline': return "Estimating Production Schedule...";
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

    if (!generatedSeriesPlan) {
      return (
        <SeriesEmptyState
          onLaunch={() => {
            window.dispatchEvent(new CustomEvent('studio-generate-series'));
          }}
          onLoadDemo={handleLoadDemo}
          isGenerating={isGeneratingSeries}
        />
      );
    }

    switch (activeTab) {
      case 'roadmap':
        return (
          <RoadmapTab
            plan={generatedSeriesPlan}
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
            plan={generatedSeriesPlan}
          />
        );
      case 'arcs':
        return <ArcsTab plan={generatedSeriesPlan} />;
      case 'assets':
        return <AssetsTab plan={generatedSeriesPlan} />;
      case 'timeline':
        return <TimelineTab plan={generatedSeriesPlan} />;
      default:
        return (
          <RoadmapTab
            plan={generatedSeriesPlan}
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





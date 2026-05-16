import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useState } from 'react';
import { SeriesView } from '../components/SeriesView';
import { SeriesEmptyTab } from '../components/SeriesEmptyTab';

export default function EpisodesPage() {
  const navigate = useNavigate();
  const {
    generatedSeriesPlan,
    isEditing,
    contentType,
    currentScriptId
  } = useGeneratorState();
  const { setGeneratedSeriesPlan, setEpisode } = useGeneratorDispatch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const studioBase = currentScriptId ? `/projects/${currentScriptId}` : '/studio';

  const handleUpdateEpisode = (index: number, updates: any) => {
    if (!generatedSeriesPlan) return;
    const newPlan = [...generatedSeriesPlan];
    newPlan[index] = { ...newPlan[index], ...updates };
    setGeneratedSeriesPlan(newPlan);
  };

  const handleAddEpisode = () => {
    const nextNum = (generatedSeriesPlan?.length || 0) + 1;
    const newEpisode = {
      episode: nextNum.toString(),
      title: `Untitled Episode ${nextNum}`,
      hook: "Enter a compelling narrative hook here...",
      setting: "Default Location",
      runtime: "24:00",
      focus_characters: [],
      emotional_arc: "Developing",
      asset_matrix: {
        sound: "Pending Synthesis",
        image: "Pending Synthesis",
        video: "Pending Synthesis",
        scene_count: 0
      }
    };
    
    const newPlan = [...(generatedSeriesPlan || []), newEpisode];
    setGeneratedSeriesPlan(newPlan);
    navigate(`${studioBase}/series/episodes/${nextNum}/edit`);
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

  return (
    <div className="space-y-8 pb-20">
      {/* Cinematic Header Section */}
      {generatedSeriesPlan && generatedSeriesPlan.length > 0 ? (
        <>

          {/* Episodes List */}
          <SeriesView
            plan={generatedSeriesPlan}
            isEditing={isEditing}
            viewMode={viewMode}
            onUpdateEpisode={handleUpdateEpisode}
            onUpdateAssetMatrix={handleUpdateAssetMatrix}
            onViewEpisode={(epNum: string, section?: string) => {
              navigate(`${studioBase}/series/episodes/${epNum}${section ? `?section=${section}` : ''}`);
            }}
            onFocusEpisode={(epNum: string) => {
              setEpisode(epNum);
              navigate(`${studioBase}/script`);
            }}
          />
        </>
      ) : (
        <SeriesEmptyTab 
          icon={Film}
          title="Episodes Library Empty"
          description="No episodes have been sequenced yet. Generate a series plan first to unlock episode synthesis."
          accentColor="cyan"
        />
      )}
    </div>
  );
}


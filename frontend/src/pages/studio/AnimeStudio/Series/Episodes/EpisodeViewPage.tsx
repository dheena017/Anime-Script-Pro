import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Play,
  Clock,
  Users,
  MapPin,
  Heart,
  Share2,
  MoreHorizontal,
  Layout as LayoutGrid,
  Video,
  Volume2,
  Camera,
  Activity
} from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { SceneCard } from '../components/SceneCard';
import SceneView from '../components/SceneView';
import { generateScene } from '@/services/api/gemini';
import { SeriesEpisode } from '../components/SeriesCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

export default function EpisodeViewPage() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const { generatedSeriesPlan, contentType, setEpisode, selectedModel, setGeneratedSeriesPlan } = useGenerator();

  const episode = generatedSeriesPlan?.find(ep =>
    String(ep.episode) === String(episodeId)
  );

  if (!episode) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em]">Episode Not Found</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  const handleFocus = () => {
    setEpisode(episode.episode);
    navigate(`/${contentType.toLowerCase()}/script`);
  };

  // Flatten scenes from detailed_episode_spec
  const scenes: any[] = React.useMemo(() => {
    const spec = episode.detailed_episode_spec;
    if (!spec || !Array.isArray(spec.acts)) return [];
    const out: any[] = [];
    spec.acts.forEach((act: any, ai: number) => {
      (act.scenes || []).forEach((s: any, si: number) => {
        out.push({
          ...s,
          act: act.act || ai + 1,
          index: out.length + 1
        });
      });
    });
    return out;
  }, [episode]);

  const [selectedSceneIndex, setSelectedSceneIndex] = React.useState<number | null>(scenes.length > 0 ? scenes[0].index : null);

  React.useEffect(() => {
    if (scenes.length > 0 && selectedSceneIndex === null) setSelectedSceneIndex(scenes[0].index);
  }, [scenes, selectedSceneIndex]);

  const handleSelectScene = (index: number) => {
    setSelectedSceneIndex(index);
  };

  const handleRegenerateScene = async (index: number) => {
    const scene = scenes.find(s => s.index === index);
    if (!scene) return;

    try {
      const beat = scene.summary || scene.visual_direction || '';
      const output = await generateScene(episode.title || contentType || 'Anime', beat, selectedModel || undefined, null, null, { temperature: 0.7, maxTokens: 1024 });

      // update generatedSeriesPlan with new sceneOutput
      const planCopy: SeriesEpisode[] = JSON.parse(JSON.stringify(generatedSeriesPlan || []));
      const epIndex = planCopy.findIndex((e: any) => String(e.episode) === String(episode.episode));
      if (epIndex >= 0) {
        const spec = planCopy[epIndex].detailed_episode_spec;
        if (spec && Array.isArray(spec.acts)) {
          for (const act of spec.acts) {
            const s = (act.scenes || []).find((ss: any) => ss.scene_id === scene.scene_id || ss.index === index);
            if (s) {
              s.sceneOutput = output;
              break;
            }
          }
        }

        setGeneratedSeriesPlan(planCopy as any);
      }
    } catch (err) {
      console.error('Regenerate scene failed', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-zinc-500 hover:text-white h-12 px-6 rounded-2xl"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-2xl">
            <Button
              variant="ghost"
              disabled={parseInt(episodeId || '1') <= 1}
              onClick={() => navigate(`/${contentType.toLowerCase()}/series/episodes/${parseInt(episodeId || '1') - 1}`)}
              className="w-10 h-10 rounded-xl text-zinc-500 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              EP {episodeId} / {generatedSeriesPlan?.length}
            </span>
            <Button
              variant="ghost"
              disabled={parseInt(episodeId || '1') >= (generatedSeriesPlan?.length || 0)}
              onClick={() => navigate(`/${contentType.toLowerCase()}/series/episodes/${parseInt(episodeId || '1') + 1}`)}
              className="w-10 h-10 rounded-xl text-zinc-500 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 border-zinc-800 text-zinc-400 rounded-2xl px-5">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="h-12 border-zinc-800 text-zinc-400 rounded-2xl px-5">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => navigate(`/${contentType.toLowerCase()}/series/episodes/${episodeId}/edit`)}
            className="h-12 bg-zinc-800 text-white hover:bg-zinc-700 rounded-2xl px-6"
          >
            <Edit3 className="w-4 h-4 mr-2" /> Edit Details
          </Button>
          <Button
            onClick={handleFocus}
            className="h-12 bg-studio text-black font-black uppercase hover:bg-studio/80 shadow-studio rounded-2xl px-8"
          >
            <Play className="w-4 h-4 mr-2" /> Focus Episode
          </Button>
        </div>
      </div>

      {/* Main Content Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-studio/10 border border-studio/30 flex flex-col items-center justify-center text-studio">
                <span className="text-[10px] font-black uppercase opacity-50">EP</span>
                <span className="font-black text-2xl">{episode.episode}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                  <Activity className="w-3 h-3 text-studio" /> Narrative Milestone
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <Clock className="w-3 h-3" /> {episode.runtime || '24:00'}
                </div>
                <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                  {episode.title}
                </h1>
              </div>
            </div>

            <div className="relative p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-studio/50" />
              <p className="text-xl text-zinc-300 font-medium italic leading-relaxed">
                "{episode.hook}"
              </p>
            </div>
          </div>

          {/* Production Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-black/40 border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-studio">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Primary Setting</span>
              </div>
              <p className="text-lg text-white font-bold">{episode.setting || 'Unknown'}</p>
            </Card>
            <Card className="p-6 bg-black/40 border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-purple-400">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Focus Cast</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {episode.focus_characters?.map((char: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    {char}
                  </Badge>
                )) || <span className="text-zinc-600">None defined</span>}
              </div>
            </Card>
            <Card className="p-6 bg-black/40 border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-pink-400">
                <Heart className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Emotional Arc</span>
              </div>
              <p className="text-white font-medium">{episode.emotional_arc || 'Neutral'}</p>
            </Card>
          </div>

          {/* Scenes */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Scene Breakdown</h3>
              <p className="text-sm text-zinc-500">{scenes.length} scenes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scenes.map((s, i) => (
                  <SceneCard
                    key={s.scene_id || i}
                    scene={s}
                    index={s.index}
                    onSelect={() => handleSelectScene(s.index)}
                    onRegenerate={() => handleRegenerateScene(s.index)}
                  />
                ))}
              </div>

              <div className="lg:col-span-1">
                <SceneView
                  scene={scenes.find(s => s.index === selectedSceneIndex) || null}
                  index={selectedSceneIndex || undefined}
                  onClose={() => setSelectedSceneIndex(null)}
                  onRegenerate={() => selectedSceneIndex && handleRegenerateScene(selectedSceneIndex)}
                  onNext={() => selectedSceneIndex && selectedSceneIndex < scenes.length && setSelectedSceneIndex(selectedSceneIndex + 1)}
                  onPrev={() => selectedSceneIndex && selectedSceneIndex > 1 && setSelectedSceneIndex(selectedSceneIndex - 1)}
                  totalScenes={scenes.length}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Assets */}
        <div className="space-y-6">
          <Card className="p-8 bg-[#050505]/60 border-studio/10 rounded-[2.5rem] space-y-8">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-studio" /> Asset Manifest
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-studio/10 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5 text-studio" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Audio Forge</p>
                  <p className="text-xs text-zinc-300 font-bold">{episode.asset_matrix?.sound || 'Pending Synthesis'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Visual DNA</p>
                  <p className="text-xs text-zinc-300 font-bold">{episode.asset_matrix?.image || 'Pending Synthesis'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Motion Engine</p>
                  <p className="text-xs text-zinc-300 font-bold">{episode.asset_matrix?.video || 'Pending Synthesis'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-center">
                <p className="text-[24px] font-black text-studio tracking-tighter leading-none">
                  {episode.asset_matrix?.scene_count || 0}
                </p>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Total Scenes Configured</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


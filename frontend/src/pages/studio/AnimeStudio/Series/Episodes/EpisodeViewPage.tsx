import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Play, 
  Clock, 
  BookOpen, 
  Sparkles,
  Activity,
  MapPin,
  Heart,
  LayoutGrid,
  Zap
} from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import React from 'react';
import { SceneCard } from '../components/SceneCard';
import { TechnicalMatrixTable } from '../components/TechnicalMatrixTable';
import SceneView from '../components/SceneView';
import { expandEpisodeDetails, regenerateSingleScene } from '@/services/api/gemini';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * EpisodeViewPage - Narrative & Technical Detail Node
 * A comprehensive view that combines high-fidelity narrative metadata
 * with the technical scene matrix for a unified production audit.
 */
export default function EpisodeViewPage() {
  const { id: episodeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    generatedSeriesPlan, 
    currentScriptId,
    generatedWorld,
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldArchitecture,
    generatedWorldAtlas,
    generatedWorldCulture,
    generatedWorldSystems,
    characterList,
    characterDNA,
    characterRelationships,
    selectedModel,
    contentType,
    numScenes,
    numEpisodes
  } = useGeneratorState();

  const { setEpisode, setSession, showNotification, setGeneratedSeriesPlan } = useGeneratorDispatch();

  const studioBase = currentScriptId ? `/projects/${currentScriptId}` : '/studio';

  const episode = generatedSeriesPlan?.find(ep =>
    String(ep.episode) === String(episodeId)
  );

  const [viewMode, setViewMode] = React.useState<'artistic' | 'technical'>('technical');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = React.useState<number | null>(null);

  // Auto-scroll to section if provided in query params
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section === 'scenes') {
      scrollToScenes();
    }
  }, [location, episode]);

  const scrollToScenes = () => {
    const element = document.getElementById('technical-matrix');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  if (!episode) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <p className="text-zinc-500 font-black uppercase tracking-[0.2em]">Sequence Not Found</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  const currentIndex = generatedSeriesPlan?.findIndex(ep => 
    String(ep.episode) === String(episodeId)
  ) ?? -1;

  const prevEpisode = currentIndex > 0 ? generatedSeriesPlan?.[currentIndex - 1] : null;
  const nextEpisode = (generatedSeriesPlan && currentIndex < generatedSeriesPlan.length - 1) 
    ? generatedSeriesPlan[currentIndex + 1] : null;

  const handleFocus = () => {
    const epIndex = generatedSeriesPlan?.findIndex(ep => String(ep.episode) === String(episodeId)) ?? -1;
    if (epIndex !== -1 && numEpisodes) {
      const calculatedSession = Math.floor(epIndex / numEpisodes) + 1;
      const calculatedEpInSession = (epIndex % numEpisodes) + 1;
      setSession(String(calculatedSession));
      setEpisode(String(calculatedEpInSession));
    } else {
      if (episode.session) setSession(String(episode.session));
      setEpisode(episode.episode);
    }
    navigate(`${studioBase}/script`);
  };

  // Compile scenes array injecting act and index properties for technical compliance
  const scenes: any[] = [];
  if (episode.detailed_episode_spec?.acts) {
    episode.detailed_episode_spec.acts.forEach((act: any, ai: number) => {
      (act.scenes || []).forEach((s: any) => {
        scenes.push({ 
          ...s, 
          act: act.act || ai + 1, 
          index: scenes.length + 1 
        });
      });
    });
  }

  const totalScenes = scenes.length;
  const currentScene = selectedSceneIndex !== null ? scenes[selectedSceneIndex] : null;

  // Scene Generation / Materialization pipeline handler
  const handleGenerateScenes = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    showNotification?.('Generating production scenes...', 'info');

    try {
      // 1. Build world bible
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

      // 2. Build cast context
      const castContext = [
        `CHARACTERS: ${JSON.stringify(characterList || [])}`,
        `RELATIONSHIPS: ${characterRelationships || 'N/A'}`,
        `DNA METADATA: ${JSON.stringify(characterDNA || {})}`
      ].join('\n\n');

      const numScenesVal = parseInt(String(episode.asset_matrix?.scene_count)) || parseInt(numScenes) || 16;
      
      // 3. Call expandEpisodeDetails
      const expandedEpisode = await expandEpisodeDetails(
        episode,
        selectedModel,
        contentType || 'Anime',
        worldBible,
        castContext,
        numScenesVal
      );

      // 4. Validate output
      if (!expandedEpisode?.detailed_episode_spec?.acts?.length) {
        throw new Error("AI did not return a valid scene blueprint.");
      }

      // 5. Update state
      const updatedPlan = generatedSeriesPlan!.map(ep =>
        String(ep.episode) === String(episode.episode) ? expandedEpisode : ep
      );

      setGeneratedSeriesPlan(updatedPlan);
      showNotification?.('Scenes generated successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to generate episode scenes:', err);
      showNotification?.('Failed to generate scenes: ' + (err.message || String(err)), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Individual Scene Regeneration handler
  const handleRegenerateScene = async (sceneIndex: number) => {
    if (isGenerating) return;
    setIsGenerating(true);
    showNotification?.(`Regenerating scene ${sceneIndex + 1}...`, 'info');

    try {
      // 1. Build world bible
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

      // 2. Build cast context
      const castContext = [
        `CHARACTERS: ${JSON.stringify(characterList || [])}`,
        `RELATIONSHIPS: ${characterRelationships || 'N/A'}`,
        `DNA METADATA: ${JSON.stringify(characterDNA || {})}`
      ].join('\n\n');

      const targetScene = scenes[sceneIndex];
      const prevScene = sceneIndex > 0 ? scenes[sceneIndex - 1] : undefined;
      const nextScene = sceneIndex < scenes.length - 1 ? scenes[sceneIndex + 1] : undefined;

      // 3. Call AI single scene generator
      const regeneratedScene = await regenerateSingleScene(
        targetScene,
        episode,
        selectedModel,
        contentType || 'Anime',
        worldBible,
        castContext,
        { prevScene, nextScene }
      );

      // 4. Update the detailed episode acts and scenes list
      if (!regeneratedScene || !regeneratedScene.scene_id) {
        throw new Error("AI did not return a valid regenerated scene.");
      }

      // Re-map the acts array with the new scene substituted
      const updatedActs = episode.detailed_episode_spec.acts.map((act: any) => {
        const hasScene = (act.scenes || []).some((s: any) => String(s.scene_id) === String(targetScene.scene_id));
        if (hasScene) {
          return {
            ...act,
            scenes: act.scenes.map((s: any) => 
              String(s.scene_id) === String(targetScene.scene_id) ? regeneratedScene : s
            )
          };
        }
        return act;
      });

      const updatedEpisode = {
        ...episode,
        detailed_episode_spec: {
          ...episode.detailed_episode_spec,
          acts: updatedActs
        }
      };

      const updatedPlan = generatedSeriesPlan!.map(ep =>
        String(ep.episode) === String(episode.episode) ? updatedEpisode : ep
      );

      setGeneratedSeriesPlan(updatedPlan);
      showNotification?.(`Scene ${sceneIndex + 1} regenerated successfully!`, 'success');
      
      // Auto-focus the newly regenerated scene index
      setSelectedSceneIndex(sceneIndex);
    } catch (err: any) {
      console.error('Failed to regenerate single scene:', err);
      showNotification?.('Failed to regenerate scene: ' + (err.message || String(err)), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-24 pb-32">
      {/* Narrative Navigation Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-transparent opacity-20 pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate(`${studioBase}/series`)}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-studio/20 hover:border-studio/40 hover:text-studio transition-all duration-500 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          
          <div className="flex flex-col">
            <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] mb-1">Story Manifest</span>
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
              <Button
                variant="ghost"
                disabled={!prevEpisode}
                onClick={() => navigate(`${studioBase}/series/episodes/${prevEpisode?.episode}`)}
                className="w-9 h-9 rounded-xl text-zinc-500 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="px-4 py-1.5 bg-studio/10 border border-studio/20 rounded-xl">
                <span className="text-xs font-black text-studio uppercase tracking-widest font-mono">
                  EP {episodeId}
                </span>
              </div>
              <Button
                variant="ghost"
                disabled={!nextEpisode}
                onClick={() => navigate(`${studioBase}/series/episodes/${nextEpisode?.episode}`)}
                className="w-9 h-9 rounded-xl text-zinc-500 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Global Action Header */}
        <div className="flex items-center gap-3 relative z-10">
              <Button
                onClick={scrollToScenes}
                className="h-12 bg-studio/5 border border-studio/10 text-studio hover:bg-studio/10 hover:border-studio/20 rounded-2xl px-6 font-black uppercase tracking-widest text-xs transition-all group"
              >
                <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" /> Technical Matrix
              </Button>
              <Button
                disabled={isGenerating}
                onClick={handleGenerateScenes}
                className={cn(
                  "h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-xs transition-all group",
                  scenes.length > 0 
                    ? "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20"
                    : "bg-studio text-black hover:bg-studio/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                )}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                    Materializing...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-studio" />
                    {scenes.length > 0 ? "Regenerate Scenes" : "Generate Scenes"}
                  </>
                )}
              </Button>
              <Button
                onClick={() => navigate(`${studioBase}/series/episodes/${episodeId}/edit`)}
                className="h-12 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 rounded-2xl px-6 font-black uppercase tracking-widest text-xs transition-all"
              >
                <Edit3 className="w-4 h-4 mr-2" /> Modify Script
              </Button>
              <Button
                onClick={handleFocus}
                className="h-14 bg-studio text-black font-black uppercase hover:bg-studio/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] rounded-2xl px-10 tracking-widest text-xs transition-all"
              >
                <Play className="w-4 h-4 mr-3" /> Focus Episode
              </Button>
        </div>
      </div>

      {/* Narrative Focus Content */}
      <div className="space-y-16">
        {/* Title Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-studio shadow-[0_0_15px_rgba(6,182,212,0.5)] rounded-full" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-studio uppercase tracking-[0.4em]">
                Session {episode.session || '1'} • {episode.session_name || 'Main Arc'} • Milestone Sequence Node
              </span>
              <span className="text-zinc-500 font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Clock className="w-3 h-3 text-zinc-600" /> {episode.runtime || '24:00'} Target Runtime
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-[-0.04em] leading-none break-words">
            {episode.title}
          </h1>
        </div>

        {/* Narrative Hook & Summary */}
        <div className="relative space-y-12">
          <div className="relative p-10 md:p-14 rounded-[3.5rem] bg-[#050505] border border-white/5 backdrop-blur-2xl overflow-hidden group shadow-2xl transition-all duration-700 hover:border-studio/20">
            {/* Ambient Technical Background */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000 transform group-hover:scale-110">
              <BookOpen className="w-64 h-64 text-studio" />
            </div>
            
            <div className="space-y-12 relative z-10">
              <div className="flex gap-8">
                <div className="flex flex-col justify-between pt-1.5 opacity-20 shrink-0 text-studio">
                  <span className="text-[60px] font-serif leading-none select-none">"</span>
                  <span className="text-[60px] font-serif leading-none rotate-180 select-none">"</span>
                </div>
                <p className="text-3xl md:text-4xl text-zinc-100 font-medium italic leading-[1.2] tracking-tight group-hover:text-white transition-colors">
                  {episode.hook}
                </p>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-studio/40 group-hover:w-12 transition-all duration-700" />
                  <h4 className="text-[10px] font-black text-studio uppercase tracking-[0.6em]">Master Narrative Summary</h4>
                </div>
                <p className="text-zinc-400 text-xl leading-relaxed font-medium max-w-4xl group-hover:text-zinc-300 transition-colors">
                  {episode.summary || "No detailed summary found for this narrative node. Update the episode specifications to populate the master summary."}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Production Meta (Briefing Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
             <div className="flex flex-col gap-5 p-8 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-studio/30 transition-all duration-500 group/badge shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-studio/5 flex items-center justify-center border border-studio/20 group-hover/badge:border-studio/50 transition-all">
                  <MapPin className="w-6 h-6 text-studio/60 group-hover/badge:text-studio transition-all" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] mb-2">Primary Setting</p>
                  <p className="text-xl font-black text-white uppercase tracking-tight leading-tight">{episode.setting || 'Locked'}</p>
                </div>
             </div>
             <div className="flex flex-col gap-5 p-8 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-purple-500/30 transition-all duration-500 group/badge shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/5 flex items-center justify-center border border-purple-500/20 group-hover/badge:border-purple-400/50 transition-all">
                  <Activity className="w-6 h-6 text-purple-400/60 group-hover/badge:text-purple-400 transition-all" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] mb-2">Emotional Arc</p>
                  <p className="text-xl font-black text-white uppercase tracking-tight leading-tight">{episode.emotional_arc || 'Dynamic'}</p>
                </div>
             </div>
             <div className="flex flex-col gap-5 p-8 bg-black/40 border border-white/5 rounded-[2.5rem] hover:border-amber-500/30 transition-all duration-500 group/badge shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/5 flex items-center justify-center border border-amber-500/20 group-hover/badge:border-amber-400/50 transition-all">
                  <LayoutGrid className="w-6 h-6 text-amber-500/60 group-hover/badge:text-amber-500 transition-all" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] mb-2">Unit Count</p>
                  <p className="text-xl font-black text-white uppercase tracking-tight leading-tight">{scenes.length} Production Scenes</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Technical Scene Matrix */}
      <div id="technical-matrix" className="space-y-12">
        <div className="flex items-center justify-between px-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.6em] flex items-center gap-4">
              <Zap className="w-5 h-5 text-studio animate-pulse" />
              Technical Production Matrix
            </h4>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
              Granular unit breakdown for narrative execution.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 p-1 rounded-xl">
            <Button 
              variant="ghost" 
              onClick={() => setViewMode('artistic')}
              className={cn(
                "h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                viewMode === 'artistic' ? "bg-studio text-black" : "text-zinc-500 hover:text-white"
              )}
            >
              Artistic View
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setViewMode('technical')}
              className={cn(
                "h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                viewMode === 'technical' ? "bg-studio text-black" : "text-zinc-500 hover:text-white"
              )}
            >
              Technical View
            </Button>
          </div>
        </div>

        {scenes.length > 0 ? (
          viewMode === 'technical' ? (
            <TechnicalMatrixTable scenes={scenes} />
          ) : (
            <div className="flex gap-10 items-start">
              {/* Dynamic Grid Column */}
              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scenes.map((scene: any, idx: number) => (
                  <SceneCard 
                    key={scene.scene_id || idx}
                    index={idx + 1}
                    scene={scene}
                    isActive={selectedSceneIndex === idx}
                    onSelect={(idx1) => setSelectedSceneIndex(idx1 - 1)}
                    onRegenerate={(idx1) => handleRegenerateScene((idx1 ?? idx + 1) - 1)}
                  />
                ))}
              </div>

              {/* Desktop Sidebar Scene Details Inspector */}
              {selectedSceneIndex !== null && (
                <div className="w-96 shrink-0 sticky top-24 hidden lg:block">
                  <SceneView 
                    scene={currentScene}
                    index={selectedSceneIndex + 1}
                    totalScenes={totalScenes}
                    onClose={() => setSelectedSceneIndex(null)}
                    onPrev={() => {
                      if (selectedSceneIndex > 0) setSelectedSceneIndex(selectedSceneIndex - 1);
                    }}
                    onNext={() => {
                      if (selectedSceneIndex < scenes.length - 1) setSelectedSceneIndex(selectedSceneIndex + 1);
                    }}
                    onRegenerate={(idx1) => handleRegenerateScene((idx1 ?? selectedSceneIndex + 1) - 1)}
                  />
                </div>
              )}

              {/* Mobile overlay modal for Scene Details */}
              {selectedSceneIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm lg:hidden">
                  <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[3rem]">
                    <SceneView 
                      scene={currentScene}
                      index={selectedSceneIndex + 1}
                      totalScenes={totalScenes}
                      onClose={() => setSelectedSceneIndex(null)}
                      onPrev={() => {
                        if (selectedSceneIndex > 0) setSelectedSceneIndex(selectedSceneIndex - 1);
                      }}
                      onNext={() => {
                        if (selectedSceneIndex < scenes.length - 1) setSelectedSceneIndex(selectedSceneIndex + 1);
                      }}
                      onRegenerate={(idx1) => handleRegenerateScene((idx1 ?? selectedSceneIndex + 1) - 1)}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="p-20 bg-black/40 border border-dashed border-white/5 rounded-[3rem] text-center flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-studio/5 border border-studio/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-studio animate-pulse" />
            </div>
            <div className="space-y-2 max-w-sm">
              <p className="text-sm font-black text-white uppercase tracking-widest">Generate Scene Blueprint</p>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Generate a granular technical and artistic sequence breakdown for this episode using the AI Engine.
              </p>
            </div>
            <Button 
              disabled={isGenerating}
              onClick={handleGenerateScenes}
              className="h-12 bg-studio text-black font-black uppercase tracking-widest text-xs rounded-2xl px-8 hover:bg-studio/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin mr-2" />
                  Generating Scenes...
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Scenes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

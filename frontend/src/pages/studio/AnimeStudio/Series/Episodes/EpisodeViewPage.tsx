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
import { motion } from 'framer-motion';

/**
 * EpisodeViewPage - Narrative & Technical Detail Node
 * A comprehensive view that combines high-fidelity narrative metadata
 * with the technical scene matrix for a unified production audit.
 */
export default function EpisodeViewPage() {
  const { id: episodeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { generatedSeriesPlan, currentScriptId } = useGeneratorState();
  const { setEpisode } = useGeneratorDispatch();

  const studioBase = currentScriptId ? `/projects/${currentScriptId}` : '/studio';

  const episode = generatedSeriesPlan?.find(ep =>
    String(ep.episode) === String(episodeId)
  );

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

  const handleFocus = () => {
    setEpisode(episode.episode);
    navigate(`${studioBase}/script`);
  };

  const scenes = episode.detailed_episode_spec?.acts?.flatMap((act: any) => act.scenes) || [];

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
                disabled={parseInt(episodeId || '1') <= 1}
                onClick={() => navigate(`${studioBase}/series/episodes/${parseInt(episodeId || '1') - 1}`)}
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
                disabled={parseInt(episodeId || '1') >= (generatedSeriesPlan?.length || 0)}
                onClick={() => navigate(`${studioBase}/series/episodes/${parseInt(episodeId || '1') + 1}`)}
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
      <div className="space-y-20">
        {/* Title Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-studio shadow-[0_0_15px_rgba(6,182,212,0.5)] rounded-full" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-studio uppercase tracking-[0.4em]">Milestone Sequence</span>
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> {episode.runtime || '24:00'} Estimated Runtime
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none break-words">
            {episode.title}
          </h1>
        </div>

        {/* Narrative Hook & Summary */}
        <div className="relative space-y-16">
          <div className="relative p-12 md:p-16 rounded-[4rem] bg-black/40 border border-white/5 backdrop-blur-xl overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
              <BookOpen className="w-64 h-64" />
            </div>
            
            <div className="space-y-12 relative z-10">
              <div className="flex gap-8">
                <div className="flex flex-col justify-between pt-2 opacity-20 shrink-0">
                  <span className="text-[60px] font-serif leading-none">"</span>
                  <span className="text-[60px] font-serif leading-none rotate-180">"</span>
                </div>
                <p className="text-3xl md:text-4xl text-zinc-100 font-medium italic leading-tight tracking-tight">
                  {episode.hook}
                </p>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-studio/40" />
                  <h4 className="text-xs font-black text-studio uppercase tracking-[0.6em]">Master Narrative Summary</h4>
                </div>
                <p className="text-zinc-400 text-xl leading-relaxed font-medium max-w-4xl">
                  {episode.summary || "No detailed summary found for this narrative node. Update the episode specifications to populate the master summary."}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Production Meta (Briefing Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
             <div className="flex items-center gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-studio/20 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-studio/5 flex items-center justify-center border border-studio/20">
                  <MapPin className="w-6 h-6 text-studio" />
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Primary Setting</p>
                  <p className="text-xl font-black text-white uppercase">{episode.setting || 'Locked'}</p>
                </div>
             </div>
             <div className="flex items-center gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-purple-500/20 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/5 flex items-center justify-center border border-purple-500/20">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Emotional Arc</p>
                  <p className="text-xl font-black text-white uppercase">{episode.emotional_arc || 'Dynamic'}</p>
                </div>
             </div>
             <div className="flex items-center gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-amber-500/20 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/5 flex items-center justify-center border border-amber-500/20">
                  <LayoutGrid className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Unit Count</p>
                  <p className="text-xl font-black text-white uppercase">{scenes.length} Production Scenes</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Technical Scene Matrix - Integrated from Scenes Tab */}
      <div id="technical-matrix" className="space-y-12">
          <div className="flex items-center justify-between px-4">
             <div className="flex flex-col">
                <h4 className="text-[12px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-3">
                  <Zap className="w-4 h-4 text-studio animate-pulse" />
                  Technical Production Matrix
                </h4>
                <p className="text-xs text-zinc-500 font-medium mt-2">Granular unit breakdown for narrative execution.</p>
             </div>
             <div className="h-px flex-1 mx-10 bg-gradient-to-r from-studio/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scenes.length > 0 ? (
              scenes.map((scene: any, idx: number) => (
                <SceneCard 
                  key={idx}
                  scene={scene}
                  index={idx + 1}
                  onSelect={() => {}} 
                />
              ))
            ) : (
              <div className="col-span-full p-20 bg-black/40 border border-dashed border-white/5 rounded-[3rem] text-center">
                 <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">No production units materialized for this sequence.</p>
              </div>
            )}
          </div>
      </div>

      {/* Production Control Dock */}
      <div className="p-10 border border-white/5 bg-black/40 rounded-[3rem] text-center space-y-6 max-w-3xl mx-auto backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center gap-2">
           <h5 className="text-xs font-black text-studio uppercase tracking-widest">Sequence Controller</h5>
           <p className="text-xs text-zinc-500 font-medium">
             Resource matrices and global blueprints are available in the project modules.
           </p>
        </div>
        <div className="flex items-center justify-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`${studioBase}/series?tab=assets`)}
            className="h-12 px-8 text-xs font-black text-studio uppercase tracking-widest hover:bg-studio/10 border border-studio/10 rounded-2xl"
          >
            Review Asset Matrix
          </Button>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          <Button 
            variant="ghost" 
            onClick={() => navigate(`${studioBase}/series?tab=blueprint`)}
            className="h-12 px-8 text-xs font-black text-studio uppercase tracking-widest hover:bg-studio/10 border border-studio/10 rounded-2xl"
          >
            Synthesize Blueprint
          </Button>
        </div>
      </div>
    </div>
  );
}

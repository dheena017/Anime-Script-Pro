import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout as LayoutGrid, List, Film } from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useState } from 'react';
import { cn } from '@/lib/utils';
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
          <div className="relative border-b border-white/5 pb-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5 opacity-30" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="space-y-6">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="inline-block px-5 py-2 bg-studio/10 border border-studio/30 rounded-full text-[10px] uppercase tracking-[0.5em] text-studio font-black shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-md"
                >
                  Production Manifest // Archive v{generatedSeriesPlan?.length || 0}.0
                </motion.div>
                <div className="space-y-2">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none"
                  >
                    Episodes <span className="text-studio italic">Library</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] max-w-xl leading-loose"
                  >
                    Manage your series hierarchy, narrative milestones, and production assets for each episode.
                  </motion.p>
                </div>
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <SeriesView
            plan={generatedSeriesPlan}
            isEditing={isEditing}
            viewMode={viewMode}
            onUpdateEpisode={handleUpdateEpisode}
            onUpdateAssetMatrix={handleUpdateAssetMatrix}
            onViewEpisode={(epNum: string) => {
              navigate(`${studioBase}/series/episodes/${epNum}`);
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


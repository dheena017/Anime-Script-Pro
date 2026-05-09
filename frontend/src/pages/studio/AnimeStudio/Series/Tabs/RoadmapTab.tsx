import React from 'react';
import { motion } from 'framer-motion';
import { SeriesView } from '../components/SeriesView';
import { SeriesEmptyTab } from '../components/SeriesEmptyTab';
import { SceneCard } from '../components/SceneCard';
import SceneView from '../components/SceneView';
import { ChevronDown, ChevronUp, ListChecks, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoadmapTabProps {
  plan: any[];
  isEditing: boolean;
  onUpdateEpisode: (index: number, updates: any) => void;
  onUpdateAssetMatrix: (index: number, updates: any) => void;
  onFocusEpisode: (epNum: string) => void;
  onViewEpisode?: (epNum: string) => void;
}

export const RoadmapTab: React.FC<RoadmapTabProps> = ({
  plan,
  isEditing,
  onUpdateEpisode,
  onUpdateAssetMatrix,
  onFocusEpisode,
  onViewEpisode
}) => {
  const [expandedEpisode, setExpandedEpisode] = React.useState<string | null>(null);
  const [selectedSceneIndex, setSelectedSceneIndex] = React.useState<number | null>(null);

  // Flatten scenes from expanded episode
  const scenes = React.useMemo(() => {
    const ep = plan.find((e: any) => String(e.episode) === String(expandedEpisode));
    if (!ep || !ep.detailed_episode_spec || !Array.isArray(ep.detailed_episode_spec.acts)) return [];

    const out: any[] = [];
    ep.detailed_episode_spec.acts.forEach((act: any, ai: number) => {
      (act.scenes || []).forEach((s: any, si: number) => {
        out.push({
          ...s,
          act: act.act || ai + 1,
          index: out.length + 1
        });
      });
    });
    return out;
  }, [expandedEpisode, plan]);

  React.useEffect(() => {
    if (scenes.length > 0 && selectedSceneIndex === null) {
      setSelectedSceneIndex(scenes[0].index);
    }
  }, [scenes, selectedSceneIndex]);

  const handleSelectScene = (index: number) => {
    setSelectedSceneIndex(index);
  };

  const handleRegenerateScene = async (index: number) => {
    // Note: This regenerates in memory. For persistence, sync to backend.
    console.warn('Scene regeneration in RoadmapTab would require backend sync.');
  };

  if (!plan || plan.length === 0) {
    return (
      <SeriesEmptyTab 
        icon={ListChecks}
        title="Scene Roadmap Empty"
        description="No episodes in your roadmap yet. Generate a series plan to populate scene breakdowns and production details."
        accentColor="studio"
      />
    );
  }

  return (
    <div className="space-y-20 pb-20">
      {/* Cinematic Header Section */}
      <div className="relative border-b border-white/5 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-studio/5 via-transparent to-studio/5 opacity-30" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-5 py-2 bg-studio/10 border border-studio/30 rounded-full text-[10px] uppercase tracking-[0.5em] text-studio font-black shadow-[0_0_30px_rgba(6,182,212,0.1)] backdrop-blur-md"
          >
            Production Roadmap // Master Manifest v{plan.length}.0
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none"
          >
            Scene <span className="text-studio italic">Breakdown</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] max-w-2xl leading-loose"
          >
            Granular structural analysis and production beat mapping for your entire series arc.
          </motion.p>
        </div>
      </div>

      <SeriesView
        plan={plan}
        isEditing={isEditing}
        onUpdateEpisode={onUpdateEpisode}
        onUpdateAssetMatrix={onUpdateAssetMatrix}
        onFocusEpisode={onFocusEpisode}
        onViewEpisode={(epNum: string) => {
          setExpandedEpisode(epNum);
          setSelectedSceneIndex(null);
          onViewEpisode?.(epNum);
        }}
      />

      {/* Expanded Scene Viewer */}
      {expandedEpisode && scenes.length > 0 && (
        <div className="mt-12 pt-12 border-t border-zinc-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black text-white">
                Scene Breakdown <span className="text-studio">EP{expandedEpisode}</span>
              </h2>
              
              <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 p-1 rounded-2xl">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={parseInt(expandedEpisode || '1') <= 1}
                  onClick={() => setExpandedEpisode(String(parseInt(expandedEpisode || '1') - 1))}
                  className="w-8 h-8 rounded-xl text-zinc-500 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                  {expandedEpisode} / {plan.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={parseInt(expandedEpisode || '1') >= plan.length}
                  onClick={() => setExpandedEpisode(String(parseInt(expandedEpisode || '1') + 1))}
                  className="w-8 h-8 rounded-xl text-zinc-500 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setExpandedEpisode(null);
                setSelectedSceneIndex(null);
              }}
              className="text-zinc-500 hover:text-white"
            >
              <ChevronUp className="w-4 h-4 mr-2" /> Collapse
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scenes.map((s, i) => (
                <SceneCard
                  key={s.scene_id || i}
                  scene={s}
                  index={s.index}
                  isActive={s.index === selectedSceneIndex}
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
      )}
    </div>
  );
};




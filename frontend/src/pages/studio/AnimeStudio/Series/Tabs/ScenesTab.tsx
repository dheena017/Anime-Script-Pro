import React from 'react';
import { motion } from 'framer-motion';
import { SeriesEmptyTab } from '../components/SeriesEmptyTab';
import { SceneCard } from '../components/SceneCard';
import SceneView from '../components/SceneView';
import { 
  Database,
  Layers, 
  Terminal,
  Zap,
  LayoutGrid,
  Search,
  Filter,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScenesTabProps {
  plan: any[];
  isEditing: boolean;
  onUpdateEpisode: (index: number, updates: any) => void;
  onUpdateAssetMatrix: (index: number, updates: any) => void;
  onFocusEpisode: (epNum: string) => void;
}

export const ScenesTab: React.FC<ScenesTabProps> = ({
  plan,
  isEditing,
  onUpdateEpisode,
  onUpdateAssetMatrix,
  onFocusEpisode
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = React.useState<{ep: string, idx: number} | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const scrollToEpisode = (epId: string) => {
    const el = document.getElementById(`episode-section-${epId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!plan || plan.length === 0) {
    return (
      <SeriesEmptyTab 
        icon={LayoutGrid}
        title="Scene Repository Empty"
        description="No production units have been sequenced. Generate a series blueprint to populate the master scene list."
        accentColor="studio"
      />
    );
  }

  return (
    <div className="flex gap-10 pb-20 items-start">
      {/* Sticky Sequence Navigator (Left) */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-24 space-y-6">
        <div className="p-6 bg-black/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-studio uppercase tracking-[0.4em]">Navigator</h3>
            <p className="text-xs text-zinc-600 font-black uppercase tracking-widest">Jump to Sequence</p>
          </div>
          
          <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {plan.map((ep, i) => (
              <button
                key={i}
                onClick={() => scrollToEpisode(ep.episode)}
                className="w-full p-3 rounded-xl hover:bg-white/5 text-left transition-all border border-transparent hover:border-white/10 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-zinc-600 group-hover:text-studio">{String(ep.episode).padStart(2, '0')}</span>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white truncate uppercase tracking-tight">{ep.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-studio/5 border border-studio/20 rounded-[2.5rem] space-y-4">
           <div className="flex items-center gap-2">
             <Zap className="w-3.5 h-3.5 text-studio" />
             <span className="text-xs font-black text-studio uppercase tracking-widest">Neural Sync</span>
           </div>
           <p className="text-xs text-studio/60 leading-relaxed italic font-medium">
             "Scanning all {plan.length} sequences for technical subtext. Production matrix verified."
           </p>
        </div>
      </div>

      {/* Master Scene Timeline (Center) */}
      <div className="flex-1 min-w-0 space-y-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              Master <span className="text-studio">Scene</span> Repository
            </h2>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                 <Database className="w-3.5 h-3.5" /> Series Archive
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
               <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">{plan.length} Episodes Processed</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-studio transition-colors" />
                <input 
                  type="text"
                  placeholder="Search scenes or subtext..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs text-white focus:outline-none focus:border-studio/50 w-64 transition-all"
                />
             </div>
             <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-studio/10 text-zinc-500">
                <Filter className="w-4 h-4" />
             </Button>
          </div>
        </div>

        <div className="space-y-32">
          {plan.map((ep, epIdx) => {
            const epScenes: any[] = [];
            if (ep.detailed_episode_spec?.acts) {
              ep.detailed_episode_spec.acts.forEach((act: any, ai: number) => {
                (act.scenes || []).forEach((s: any) => {
                  epScenes.push({ ...s, act: act.act || ai + 1, index: epScenes.length + 1 });
                });
              });
            }

            if (epScenes.length === 0) return null;

            return (
              <section key={epIdx} id={`episode-section-${ep.episode}`} className="space-y-12 relative">
                {/* Episode Header Strip */}
                <div className="sticky top-24 z-20 -mx-4 px-4 py-6 bg-[#050505]/90 backdrop-blur-xl border-y border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-studio/10 border border-studio/30 flex items-center justify-center text-studio font-black text-lg">
                        {ep.episode}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">{ep.title}</h4>
                        <p className="text-xs text-zinc-500 font-black uppercase tracking-[0.3em]">{epScenes.length} Production Units Identified</p>
                      </div>
                   </div>
                   <Button 
                    onClick={() => onFocusEpisode(ep.episode)}
                    className="h-10 bg-white/5 border border-white/10 text-studio hover:bg-studio/10 rounded-xl px-6 text-xs font-black uppercase tracking-widest transition-all"
                   >
                     Load Script
                   </Button>
                </div>

                {/* Dense Scene Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
                  {epScenes.map((s, sIdx) => (
                    <SceneCard
                      key={s.scene_id || sIdx}
                      scene={s}
                      index={s.index}
                      isActive={selectedSceneIndex?.ep === ep.episode && selectedSceneIndex?.idx === s.index}
                      onSelect={() => setSelectedSceneIndex({ ep: ep.episode, idx: s.index })}
                      onRegenerate={() => {}}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Global Scene Detail Inspector (Right - Fixed) */}
      <div className="hidden xl:block w-96 shrink-0 sticky top-24">
         <SceneView
            scene={(() => {
              if (!selectedSceneIndex) return null;
              const ep = plan.find(e => String(e.episode) === String(selectedSceneIndex.ep));
              const allEpScenes: any[] = [];
              ep?.detailed_episode_spec?.acts?.forEach((act: any, ai: number) => {
                (act.scenes || []).forEach((s: any) => {
                  allEpScenes.push({ ...s, act: act.act || ai + 1, index: allEpScenes.length + 1 });
                });
              });
              return allEpScenes.find(s => s.index === selectedSceneIndex.idx) || null;
            })()}
            index={selectedSceneIndex?.idx || undefined}
            onClose={() => setSelectedSceneIndex(null)}
            onRegenerate={() => {}}
            totalScenes={10} // Approximation for the view
         />
      </div>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { Plus, ListFilter, Search, Layout as LayoutGrid, List } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SeriesView } from '../components/SeriesView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EpisodesPage() {
  const navigate = useNavigate();
  const {
    generatedSeriesPlan,
    setGeneratedSeriesPlan,
    isEditing,
    contentType
  } = useGenerator();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    navigate(`/${contentType.toLowerCase()}/series/episodes/${nextNum}/edit`);
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-studio/10 border border-studio/20 rounded-full text-[10px] uppercase tracking-widest text-studio font-bold">
            Production Manifest
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
            Episodes <span className="text-studio">Library</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium max-w-md">
            Manage your series hierarchy, narrative milestones, and production assets for each episode.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-zinc-800 bg-black/40 text-zinc-400 hover:text-white hover:border-zinc-700"
          >
            <ListFilter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button
            className="bg-studio text-black font-black uppercase tracking-wider hover:bg-studio/80 shadow-studio"
            onClick={handleAddEpisode}
          >
            <Plus className="w-4 h-4 mr-2" /> New Episode
          </Button>
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className="flex items-center justify-between gap-4 p-4 bg-zinc-900/40 border border-white/5 rounded-2xl backdrop-blur-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search episodes by title or hook..."
            className="pl-12 bg-black/40 border-zinc-800 focus:border-studio/50"
          />
        </div>
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewMode('grid')}
            className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'grid' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewMode('list')}
            className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'list' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Episodes List */}
      {generatedSeriesPlan ? (
        <SeriesView
          plan={generatedSeriesPlan}
          isEditing={isEditing}
          viewMode={viewMode}
          onUpdateEpisode={handleUpdateEpisode}
          onUpdateAssetMatrix={handleUpdateAssetMatrix}
          onFocusEpisode={(epNum: string) => {
            navigate(`/${contentType.toLowerCase()}/series/episodes/${epNum}`);
          }}
        />
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[3rem] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
            <Plus className="w-8 h-8 text-zinc-700" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold uppercase tracking-widest text-sm">No Episodes Manifested</p>
            <p className="text-zinc-600 text-xs">Initialize your production roadmap to begin sequencing.</p>
          </div>
        </div>
      )}
    </div>
  );
}


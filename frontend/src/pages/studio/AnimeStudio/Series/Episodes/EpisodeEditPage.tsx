import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Save,
  Trash2,
  AlertCircle,
  Edit3,
  Database,
  Activity,
  Sparkles
} from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function EpisodeEditPage() {
  const { id: episodeId } = useParams();
  const navigate = useNavigate();
  const { generatedSeriesPlan, contentType, currentScriptId } = useGeneratorState();
  const { setGeneratedSeriesPlan, showNotification } = useGeneratorDispatch();

  const studioBase = currentScriptId ? `/projects/${currentScriptId}` : '/studio';

  const episodeIndex = generatedSeriesPlan?.findIndex(ep => 
    String(ep.episode) === String(episodeId)
  );
  const episode = episodeIndex !== undefined && episodeIndex !== -1 ? generatedSeriesPlan![episodeIndex] : null;

  const [formData, setFormData] = React.useState(episode);

  React.useEffect(() => {
    if (episode) setFormData(episode);
  }, [episode]);

  if (!episode || !formData) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4 text-center">
        <div className="w-20 h-20 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-zinc-500 font-black uppercase tracking-[0.4em]">Sequence Not Found</p>
        <Button onClick={() => navigate(-1)} variant="ghost" className="text-studio hover:bg-studio/10">Re-establish Connection</Button>
      </div>
    );
  }

  const handleSave = () => {
    if (!generatedSeriesPlan || episodeIndex === undefined) return;
    const newPlan = [...generatedSeriesPlan];
    newPlan[episodeIndex] = formData;
    setGeneratedSeriesPlan(newPlan);
    showNotification?.('Episode updated successfully!', 'success');
    navigate(`${studioBase}/series/episodes/${formData.episode}`);
  };

  const handleRemove = () => {
    if (!generatedSeriesPlan || episodeIndex === undefined) return;
    const newPlan = generatedSeriesPlan.filter((_, i) => i !== episodeIndex);
    setGeneratedSeriesPlan(newPlan);
    showNotification?.('Episode removed from the series.', 'info');
    navigate(`${studioBase}/series/episodes`);
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Cinematic Navigation Header */}
      <div className="flex items-center justify-between pb-10 border-b border-white/5">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-studio/20 hover:border-studio/40 hover:text-studio transition-all duration-500 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
        </Button>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={handleRemove}
            className="h-14 bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-black uppercase tracking-widest text-xs px-8 rounded-2xl"
          >
            <Trash2 className="w-4 h-4 mr-3" /> Dissolve Sequence
          </Button>
          <Button
            onClick={handleSave}
            className="h-14 bg-studio text-black hover:bg-studio/80 transition-all font-black uppercase tracking-widest text-xs px-10 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] group"
          >
            <Save className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" /> Apply Realignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          <div className="space-y-8">
            <div className="flex items-center gap-6 px-2">
              <div className="w-16 h-16 rounded-[1.5rem] bg-studio/10 border border-studio/20 flex items-center justify-center">
                <Edit3 className="w-8 h-8 text-studio" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Configuration Module</p>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                  Edit Episode <span className="text-studio font-mono">{episodeId}</span>
                </h1>
              </div>
            </div>

            <Card className="p-10 bg-black/40 border border-white/5 rounded-[3rem] backdrop-blur-xl space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                  <Database className="w-32 h-32 text-white" />
               </div>

              <div className="grid grid-cols-4 gap-8">
                <div className="space-y-3 col-span-1">
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Sequence ID</Label>
                  <Input
                    value={formData.episode}
                    onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-mono focus:border-studio/50 transition-all"
                  />
                </div>
                <div className="space-y-3 col-span-3">
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Master Production Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold focus:border-studio/50 transition-all px-6"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Narrative Hook (Opening Beat)</Label>
                <Textarea
                  value={formData.hook}
                  onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-[2rem] text-zinc-300 font-medium italic min-h-[120px] resize-none focus:border-studio/50 transition-all p-6 leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Master Narrative Summary</Label>
                <Textarea
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="bg-white/5 border-white/10 rounded-[2rem] text-zinc-400 font-medium min-h-[160px] resize-none focus:border-studio/50 transition-all p-6 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Primary Setting</Label>
                  <Input
                    value={formData.setting || ''}
                    onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-studio/50 transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Runtime Configuration</Label>
                  <Input
                    value={formData.runtime || ''}
                    onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-studio/50 transition-all px-6 font-mono"
                    placeholder="24:00"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Focus Cast (DNA Signatures)</Label>
                <Input
                  value={formData.focus_characters?.join(', ') || ''}
                  onChange={(e) => setFormData({ ...formData, focus_characters: e.target.value.split(',').map(s => s.trim()) })}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-studio/50 transition-all px-6"
                  placeholder="Anya, Taro, Sachi..."
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em] px-2">Emotional Narrative Arc</Label>
                <Input
                  value={formData.emotional_arc || ''}
                  onChange={(e) => setFormData({ ...formData, emotional_arc: e.target.value })}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-white focus:border-studio/50 transition-all px-6"
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <Card className="p-8 bg-[#050505]/60 border border-white/5 rounded-[2.5rem] space-y-8 backdrop-blur-xl">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <Activity className="w-4 h-4 text-studio" /> Asset Manifest
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-zinc-600 uppercase tracking-widest px-1">Audio Forge</Label>
                  <Input
                    value={formData.asset_matrix?.sound || ''}
                    onChange={(e) => setFormData({ ...formData, asset_matrix: { ...formData.asset_matrix!, sound: e.target.value } })}
                    className="h-12 bg-white/5 border-white/10 rounded-xl text-xs focus:border-studio/50 transition-all px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-zinc-600 uppercase tracking-widest px-1">Visual DNA</Label>
                  <Input
                    value={formData.asset_matrix?.image || ''}
                    onChange={(e) => setFormData({ ...formData, asset_matrix: { ...formData.asset_matrix!, image: e.target.value } })}
                    className="h-12 bg-white/5 border-white/10 rounded-xl text-xs focus:border-studio/50 transition-all px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-zinc-600 uppercase tracking-widest px-1">Motion Engine</Label>
                  <Input
                    value={formData.asset_matrix?.video || ''}
                    onChange={(e) => setFormData({ ...formData, asset_matrix: { ...formData.asset_matrix!, video: e.target.value } })}
                    className="h-12 bg-white/5 border-white/10 rounded-xl text-xs focus:border-studio/50 transition-all px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-zinc-600 uppercase tracking-widest px-1">Unit Count (Scenes)</Label>
                  <Input
                    type="number"
                    value={formData.asset_matrix?.scene_count || 0}
                    onChange={(e) => setFormData({ ...formData, asset_matrix: { ...formData.asset_matrix!, scene_count: parseInt(e.target.value) } })}
                    className="h-12 bg-white/5 border-white/10 rounded-xl text-xs focus:border-studio/50 transition-all px-4 font-mono"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 p-4 bg-studio/5 rounded-2xl border border-studio/10">
                  <Sparkles className="w-4 h-4 text-studio shrink-0" />
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">Synthesis of these parameters will propagate to all downstream production modules.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


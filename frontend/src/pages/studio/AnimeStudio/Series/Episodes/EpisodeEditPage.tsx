import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function EpisodeEditPage() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const { generatedSeriesPlan, setGeneratedSeriesPlan, contentType, showNotification } = useGenerator();

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
      <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em]">Episode Not Found</p>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  const handleSave = () => {
    if (!generatedSeriesPlan || episodeIndex === undefined) return;
    const newPlan = [...generatedSeriesPlan];
    newPlan[episodeIndex] = formData;
    setGeneratedSeriesPlan(newPlan);
    showNotification?.('Episode updated successfully!', 'success');
    navigate(`/${contentType.toLowerCase()}/series/episodes/${formData.episode}`);
  };

  const handleRemove = () => {
    if (!generatedSeriesPlan || episodeIndex === undefined) return;
    const newPlan = generatedSeriesPlan.filter((_, i) => i !== episodeIndex);
    setGeneratedSeriesPlan(newPlan);
    showNotification?.('Episode removed from the series.', 'info');
    navigate(`/${contentType.toLowerCase()}/series/episodes`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-white group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Discard Modalities
        </Button>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={handleRemove}
            className="text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all font-black uppercase tracking-widest text-[10px] px-6 h-12 rounded-2xl"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Dissolve Sequence
          </Button>
          <Button
            onClick={handleSave}
            className="bg-studio text-black hover:bg-studio/80 transition-all font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          >
            <Save className="w-4 h-4 mr-2" /> Apply Realignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
              Edit Episode <span className="text-studio">{episodeId}</span>
            </h1>

            <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="space-y-2 col-span-1">
                  <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Episode No.</Label>
                  <Input
                    value={formData.episode}
                    onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
                    className="bg-black/40 border-zinc-800"
                  />
                </div>
                <div className="space-y-2 col-span-3">
                  <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Master Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-black/40 border-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Narrative Hook</Label>
                <Textarea
                  value={formData.hook}
                  onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                  className="bg-black/40 border-zinc-800 min-h-[120px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Primary Setting</Label>
                  <Input
                    value={formData.setting || ''}
                    onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
                    className="bg-black/40 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Runtime Estimate</Label>
                  <Input
                    value={formData.runtime || ''}
                    onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                    className="bg-black/40 border-zinc-800"
                    placeholder="24:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Focus Characters (Comma separated)</Label>
                <Input
                  value={formData.focus_characters?.join(', ') || ''}
                  onChange={(e) => setFormData({ ...formData, focus_characters: e.target.value.split(',').map(s => s.trim()) })}
                  className="bg-black/40 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Emotional Arc</Label>
                <Input
                  value={formData.emotional_arc || ''}
                  onChange={(e) => setFormData({ ...formData, emotional_arc: e.target.value })}
                  className="bg-black/40 border-zinc-800"
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-8 bg-[#050505]/60 border-studio/10 rounded-[2.5rem] space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Asset Configuration</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Audio Forge</Label>
                <Input
                  value={formData.asset_matrix?.sound || ''}
                  onChange={(e) => setFormData({ ...formData, asset_matrix: { ...formData.asset_matrix!, sound: e.target.value } })}
                  className="bg-black/40 border-zinc-800 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Visual DNA</Label>
                <Input
                  value={formData.asset_matrix?.image || ''}
                  onChange={(e) => setFormData({ ...formData, asset_matrix: { ...formData.asset_matrix!, image: e.target.value } })}
                  className="bg-black/40 border-zinc-800 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Motion Engine</Label>
                <Input
                  value={formData.asset_matrix?.video || ''}
                  onChange={(e) => setFormData({ ...formData, asset_matrix: { ...formData.asset_matrix!, video: e.target.value } })}
                  className="bg-black/40 border-zinc-800 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Units (Scenes)</Label>
                <Input
                  type="number"
                  value={formData.asset_matrix?.scene_count || 0}
                  onChange={(e) => setFormData({ ...formData, asset_matrix: { ...formData.asset_matrix!, scene_count: parseInt(e.target.value) } })}
                  className="bg-black/40 border-zinc-800 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 p-3 bg-studio/5 rounded-xl border border-studio/10">
                <AlertCircle className="w-4 h-4 text-studio shrink-0" />
                <p className="text-[10px] text-zinc-400 font-medium">Changing these values will update the production roadmap globally.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


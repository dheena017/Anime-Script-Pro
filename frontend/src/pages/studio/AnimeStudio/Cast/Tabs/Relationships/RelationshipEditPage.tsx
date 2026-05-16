import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Workflow, 
  Shield, 
  Zap, 
  Swords, 
  Heart, 
  Lock,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function RelationshipEditPage() {
  const { relationshipId } = useParams();
  const navigate = useNavigate();
  const { castData, castList, characterRelationships, contentType } = useGeneratorState();
  const { setCharacterRelationships } = useGeneratorDispatch();

  const displayCast = castData?.characters || castList || [];
  
  const connections = React.useMemo(() => {
    if (typeof characterRelationships === 'string') {
      try {
        return JSON.parse(characterRelationships);
      } catch (e) {
        return [];
      }
    }
    return characterRelationships || [];
  }, [characterRelationships]);

  const connectionIndex = connections.findIndex((c: any) => c.id === relationshipId);
  const connection = connectionIndex !== -1 ? connections[connectionIndex] : null;

  const [formData, setFormData] = React.useState(connection);

  if (!connection || !formData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-zinc-700">
          <Workflow className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Identity Not Found</h2>
          <p className="text-zinc-500 text-sm max-w-xs">The requested emotional thread could not be retrieved from the manifest.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)} className="border-zinc-800 text-zinc-400">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    const newList = [...connections];
    newList[connectionIndex] = formData;
    setCharacterRelationships(JSON.stringify(newList));
    navigate(`/${contentType.toLowerCase()}/cast/relationships`);
  };

  const handleRemove = () => {
    const newList = connections.filter((c: any) => c.id !== relationshipId);
    setCharacterRelationships(JSON.stringify(newList));
    navigate(`/${contentType.toLowerCase()}/cast/relationships`);
  };

  const types = [
    { id: 'Ally', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { id: 'Rival', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    { id: 'Enemy', icon: Swords, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    { id: 'Love', icon: Heart, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30' },
    { id: 'Secret', icon: Lock, color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/30' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Discard Modalities
        </Button>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={handleRemove}
            className="text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all font-black uppercase tracking-widest text-xs px-6 h-12 rounded-2xl"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Dissolve Connection
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition-all font-black uppercase tracking-widest text-xs px-8 h-12 rounded-2xl shadow-[0_0_30px_rgba(217,70,239,0.3)]"
          >
            <Save className="w-4 h-4 mr-2" /> Apply Realignment
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-xs uppercase tracking-widest text-fuchsia-400 font-bold">
          Refactoring AI Threads
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
          Modify <span className="text-fuchsia-500">Connection</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-10">
            {/* Subject Selection */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
              <div className="md:col-span-3 space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Subject A (Source)</Label>
                <Select value={formData.source} onValueChange={(v: string | null) => setFormData({...formData, source: v || ''})}>
                  <SelectTrigger className="bg-black/60 border-zinc-800 h-14 rounded-2xl text-lg font-bold">
                    <SelectValue placeholder="Select Identity A" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {displayCast.map((c: any) => (
                      <SelectItem key={c.name} value={c.name} className="text-white hover:bg-studio/20">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1 flex justify-center pt-6">
                <ArrowRight className="w-8 h-8 text-zinc-800" />
              </div>

              <div className="md:col-span-3 space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Subject B (Target)</Label>
                <Select value={formData.target} onValueChange={(v: string | null) => setFormData({...formData, target: v || ''})}>
                  <SelectTrigger className="bg-black/60 border-zinc-800 h-14 rounded-2xl text-lg font-bold">
                    <SelectValue placeholder="Select Identity B" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {displayCast.map((c: any) => (
                      <SelectItem key={c.name} value={c.name} className="text-white hover:bg-studio/20">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Connection Type */}
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Select Dynamic Archetype</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {types.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({...formData, type: t.id})}
                    className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-3 group ${
                      formData.type === t.id 
                        ? `${t.bg} ${t.border} ${t.color} shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-105` 
                        : 'bg-black/20 border-white/5 text-zinc-600 hover:border-white/10 hover:bg-black/40'
                    }`}
                  >
                    <t.icon className={`w-6 h-6 transition-transform group-hover:scale-110`} />
                    <span className="text-xs font-black uppercase tracking-widest">{t.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tension Slider */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                 <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Dynamic Complexity (Tension)</Label>
                 <span className={`text-2xl font-black ${formData.tension >= 8 ? 'text-red-500' : 'text-fuchsia-500'}`}>{formData.tension}</span>
              </div>
              <Slider 
                value={[formData.tension]} 
                onValueChange={(v) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  setFormData({...formData, tension: val});
                }}
                max={10} 
                step={1} 
                className="py-4"
              />
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4">
              <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Relationship Summary</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-black/60 border-zinc-800 min-h-[120px] rounded-[2rem] p-6 text-sm italic text-zinc-400 focus:border-fuchsia-500/30"
                placeholder="Describe the nature of this emotional thread..."
              />
            </div>
          </Card>
        </div>

        <div className="space-y-8">
           <div className="p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] space-y-4">
              <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Synthesis Parameter</p>
              <div className="space-y-1">
                 <p className="text-xs text-white font-bold">RE-SYNTH_04</p>
                 <p className="text-xs text-zinc-500 font-medium">Any changes will immediately affect the narrative engine's dialogue and action generation for scenes featuring these entities.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


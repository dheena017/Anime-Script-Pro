import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Workflow, 
  Shield, 
  Zap, 
  Swords, 
  Heart, 
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function AddRelationshipPage() {
  const navigate = useNavigate();
  const { castData, castList, characterRelationships, contentType } = useGeneratorState();
  const { setCharacterRelationships } = useGeneratorDispatch();

  const displayCast = castData?.characters || castList || [];
  
  const [formData, setFormData] = React.useState({
    source: '',
    target: '',
    type: 'Ally',
    tension: 5,
    description: ''
  });

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

  const handleRegister = () => {
    if (!formData.source || !formData.target) return;
    
    const newConnection = {
      ...formData,
      id: Math.random().toString(36).substring(7)
    };
    
    const newList = [...connections, newConnection];
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
          Cancel Lab Session
        </Button>
        <Button 
          onClick={handleRegister}
          disabled={!formData.source || !formData.target}
          className="bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition-all font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-2xl shadow-[0_0_30px_rgba(217,70,239,0.3)] disabled:opacity-50"
        >
          <Plus className="w-4 h-4 mr-2" /> Register Connection
        </Button>
      </div>

      <div className="space-y-2">
        <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-[10px] uppercase tracking-widest text-fuchsia-400 font-bold">
          Connection Protocol v2.0
        </div>
        <h1 className="text-6xl font-black text-white uppercase tracking-tighter">
          Register New <span className="text-fuchsia-500">Thread</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-10">
            {/* Subject Selection */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
              <div className="md:col-span-3 space-y-3">
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Subject A (Source)</Label>
                <Select onValueChange={(v: string | null) => setFormData({...formData, source: v || ''})}>
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
                <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Subject B (Target)</Label>
                <Select onValueChange={(v: string | null) => setFormData({...formData, target: v || ''})}>
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
              <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Select Dynamic Archetype</Label>
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
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tension Slider */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                 <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Dynamic Complexity (Tension)</Label>
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
              <div className="flex justify-between text-[8px] font-black text-zinc-700 uppercase tracking-widest px-1">
                <span>Neutral Stability</span>
                <span>Volatile Friction</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4">
              <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Relationship Summary</Label>
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
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Pro Tip</span>
              </div>
              <Card className="p-8 bg-fuchsia-500/5 border-fuchsia-500/10 rounded-[2.5rem] space-y-4">
                 <p className="text-xs text-fuchsia-200/60 leading-relaxed font-medium">
                    Establish high-tension (8-10) relationships to create critical narrative friction points.
                 </p>
                 <div className="h-[1px] bg-fuchsia-500/10" />
                 <p className="text-xs text-fuchsia-200/60 leading-relaxed font-medium">
                    "Love" and "Secret" threads add emotional depth and unpredictability to your cast synthesis.
                 </p>
              </Card>
           </div>
           
           <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center">
                 <Workflow className="w-6 h-6 text-zinc-700" />
              </div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-relaxed">
                 Establishing this connection will update the global relationship matrix and influence script generation.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}


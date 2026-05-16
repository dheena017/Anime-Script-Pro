import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Target, 
  Skull, 
  Sparkles, 
  MessageSquare, 
  User,
  Lock,
  Trash2
} from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CharacterEditPage() {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const { castData, castList, contentType } = useGeneratorState();
  const { setCastList } = useGeneratorDispatch();

  const displayCast = castData?.characters || castList || [];
  const characterIndex = displayCast.findIndex((c: any) => c.name === characterName);
  const character = characterIndex !== -1 ? displayCast[characterIndex] : null;

  const toText = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') return value;
    if (value == null) return fallback;
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
        .join(', ');
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([key, val]) => `${key}: ${typeof val === 'string' ? val : JSON.stringify(val)}`)
        .join('\n');
    }
    return String(value);
  };

  const normalizeCharData = (char: any) => {
    if (!char) return null;
    return {
      ...char,
      appearance: toText(char.appearance),
      speakingStyle_text: toText(char.speakingStyle), // Keep original logic for legacy
      secret: toText(char.secret || (Array.isArray(char.secrets) ? char.secrets[0] : '')),
      goal: toText(char.goal),
      conflict: toText(char.conflict),
      flaw: toText(char.flaw),
      // Production Deep Fields
      cameraChoreography: toText(char.powerSystem?.cameraChoreography),
      moralDilemma: toText(char.narrative?.arcRoadmap?.moralDilemma),
      vfxSignature: toText(char.technicalModel?.vfxSignature),
      groupEtiquette: toText(char.worldAlignment?.socialDynamics?.groupEtiquette),
    };
  };

  const [formData, setFormData] = React.useState(() => normalizeCharData(character));

  if (!character || !formData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
          <User className="w-10 h-10 text-zinc-700" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Identity Not Found</h2>
          <p className="text-zinc-500 text-sm max-w-xs">The requested character soul could not be retrieved from the manifest.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="border-zinc-800 text-zinc-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    const newList = [...displayCast];
    // Deep update logic
    const updatedChar = { 
      ...character, 
      ...formData,
      powerSystem: { ...character.powerSystem, cameraChoreography: formData.cameraChoreography },
      narrative: { 
        ...character.narrative, 
        arcRoadmap: { ...character.narrative?.arcRoadmap, moralDilemma: formData.moralDilemma } 
      },
      technicalModel: { ...character.technicalModel, vfxSignature: formData.vfxSignature },
      worldAlignment: {
        ...character.worldAlignment,
        socialDynamics: { ...character.worldAlignment?.socialDynamics, groupEtiquette: formData.groupEtiquette }
      }
    };
    newList[characterIndex] = updatedChar;
    setCastList(newList);
    navigate(`/${contentType.toLowerCase()}/cast/characters/${formData.name}`);
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Cancel Edits
        </Button>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all font-black uppercase tracking-widest text-xs px-6 h-10 rounded-xl"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Character
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-studio text-black hover:bg-studio/80 transition-all font-black uppercase tracking-widest text-xs px-8 h-10 rounded-xl shadow-studio"
          >
            <Save className="w-3.5 h-3.5 mr-2" /> Save Character DNA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Identity */}
        <div className="lg:col-span-1 space-y-8">
           <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Core Identity</h2>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Base Soul Parameters</p>
              </div>

              <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Display Name</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-black/60 border-zinc-800 h-12 text-lg font-bold text-white focus:border-studio/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Archetype</Label>
                    <Input 
                      value={formData.archetype} 
                      onChange={(e) => setFormData({...formData, archetype: e.target.value})}
                      className="bg-black/60 border-zinc-800 h-10 text-studio font-black uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Personality Traits</Label>
                    <Input 
                      value={formData.personality} 
                      onChange={(e) => setFormData({...formData, personality: e.target.value})}
                      className="bg-black/60 border-zinc-800 h-10 text-fuchsia-400 font-bold"
                    />
                  </div>
                </div>
              </Card>
           </div>

           <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Visual DNA</h2>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Aesthetic Specification</p>
              </div>
              <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-4">
                 <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Appearance Details</Label>
                    <Textarea 
                      value={formData.appearance} 
                      onChange={(e) => setFormData({...formData, appearance: e.target.value})}
                      className="bg-black/60 border-zinc-800 min-h-[150px] text-xs leading-relaxed text-zinc-400"
                      placeholder="Describe the character's visual features..."
                    />
                 </div>
              </Card>
           </div>
        </div>

        {/* Narrative & Motivation */}
        <div className="lg:col-span-2 space-y-8">
           <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Narrative Logic</h2>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Psychological and Strategic Drivers</p>
           </div>

           <Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Target className="w-4 h-4 text-studio" />
                       <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Core Objective (Goal)</Label>
                    </div>
                    <Textarea 
                      value={formData.goal} 
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                      className="bg-black/60 border-zinc-800 min-h-[120px] text-sm italic font-medium text-zinc-300"
                    />
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Skull className="w-4 h-4 text-fuchsia-500" />
                       <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Genetic Flaw</Label>
                    </div>
                    <Textarea 
                      value={formData.flaw} 
                      onChange={(e) => setFormData({...formData, flaw: e.target.value})}
                      className="bg-black/60 border-zinc-800 min-h-[120px] text-sm italic font-medium text-zinc-300"
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-studio" />
                    <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Narrative Conflict</Label>
                 </div>
                 <Textarea 
                   value={formData.conflict} 
                   onChange={(e) => setFormData({...formData, conflict: e.target.value})}
                   className="bg-black/60 border-zinc-800 min-h-[100px] text-sm leading-relaxed text-zinc-400"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <MessageSquare className="w-4 h-4 text-studio" />
                       <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Speaking Protocol & Rhythm</Label>
                    </div>
                    <Input 
                      value={formData.speakingStyle} 
                      onChange={(e) => setFormData({...formData, speakingStyle: e.target.value})}
                      className="bg-black/60 border-zinc-800 h-12 text-sm italic"
                    />
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Lock className="w-4 h-4 text-orange-500" />
                       <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Hidden Secret</Label>
                    </div>
                    <Input 
                      value={formData.secret} 
                      onChange={(e) => setFormData({...formData, secret: e.target.value})}
                      className="bg-orange-500/5 border-orange-500/20 h-12 text-sm text-orange-400 font-bold uppercase tracking-widest"
                    />
                 </div>
              </div>

              {/* Advanced Production Data */}
              <div className="space-y-8 pt-8 border-t border-white/5">
                 <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Advanced Production DNA</h3>
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest italic">Directorial and Technical Specifications</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase text-red-500/60 tracking-widest">Camera Choreography</Label>
                       <Textarea 
                          value={formData.cameraChoreography} 
                          onChange={(e) => setFormData({...formData, cameraChoreography: e.target.value})}
                          className="bg-black/40 border-zinc-800 min-h-[80px] text-xs italic"
                          placeholder="Tracking, static, or kinetic camera notes..."
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase text-fuchsia-500/60 tracking-widest">Moral Dilemma</Label>
                       <Textarea 
                          value={formData.moralDilemma} 
                          onChange={(e) => setFormData({...formData, moralDilemma: e.target.value})}
                          className="bg-black/40 border-zinc-800 min-h-[80px] text-xs italic"
                          placeholder="The character's core narrative conflict..."
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black uppercase text-indigo-500/60 tracking-widest">VFX Signature</Label>
                       <Textarea 
                          value={formData.vfxSignature} 
                          onChange={(e) => setFormData({...formData, vfxSignature: e.target.value})}
                          className="bg-black/40 border-zinc-800 min-h-[80px] text-xs italic"
                          placeholder="Particles, lighting, or distortion effects..."
                       />
                    </div>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}


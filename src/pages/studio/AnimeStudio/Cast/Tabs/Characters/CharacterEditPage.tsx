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
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CharacterEditPage() {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const { castData, castList, setCastList, contentType } = useGenerator();

  const displayCast = castData?.characters || castList || [];
  const characterIndex = displayCast.findIndex((c: any) => c.name === characterName);
  const character = characterIndex !== -1 ? displayCast[characterIndex] : null;

  const normalizeCharData = (char: any) => {
    if (!char) return null;
    return {
      ...char,
      appearance: typeof char.appearance === 'object' && char.appearance !== null
        ? `Silhouette: ${char.appearance.silhouette || ''}\nClothing: ${char.appearance.clothing || ''}\nFeatures: ${(char.appearance.notableFeatures || []).join(', ')}`
        : char.appearance || '',
      speakingStyle: typeof char.speakingStyle === 'object' && char.speakingStyle !== null
        ? `${char.speakingStyle.vocabulary || ''} ${char.speakingStyle.sentence_structure || ''}`.trim()
        : char.speakingStyle || '',
      secret: char.secret || (Array.isArray(char.secrets) ? char.secrets[0] : ''),
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
    // Retain original deep properties but override edited ones
    newList[characterIndex] = { ...character, ...formData };
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
            className="text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Character
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-studio text-black hover:bg-studio/80 transition-all font-black uppercase tracking-widest text-[10px] px-8 h-10 rounded-xl shadow-studio"
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
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Base Soul Parameters</p>
              </div>

              <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Display Name</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-black/60 border-zinc-800 h-12 text-lg font-bold text-white focus:border-studio/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Archetype</Label>
                    <Input 
                      value={formData.archetype} 
                      onChange={(e) => setFormData({...formData, archetype: e.target.value})}
                      className="bg-black/60 border-zinc-800 h-10 text-studio font-black uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Personality Traits</Label>
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
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Aesthetic Specification</p>
              </div>
              <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Appearance Details</Label>
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
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Psychological and Strategic Drivers</p>
           </div>

           <Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Target className="w-4 h-4 text-studio" />
                       <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Core Objective (Goal)</Label>
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
                       <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Genetic Flaw</Label>
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
                    <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Narrative Conflict</Label>
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
                       <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Speaking Protocol</Label>
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
                       <Label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Hidden Secret</Label>
                    </div>
                    <Input 
                      value={formData.secret} 
                      onChange={(e) => setFormData({...formData, secret: e.target.value})}
                      className="bg-orange-500/5 border-orange-500/20 h-12 text-sm text-orange-400 font-bold uppercase tracking-widest"
                    />
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}


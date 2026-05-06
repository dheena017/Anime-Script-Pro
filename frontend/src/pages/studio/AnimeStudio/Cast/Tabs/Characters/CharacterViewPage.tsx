import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Edit3, 
  Target, 
  Skull, 
  MessageSquare, 
  User,
  Shield,
  Zap,
  Lock
} from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CharacterViewPage() {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const { castData, castList, contentType } = useGenerator();

  const displayCast = castData?.characters || castList || [];
  const character = displayCast.find((c: any) => c.name === characterName);

  if (!character) {
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
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Registry
        </Button>
      </div>
    );
  }

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
          Back to Character Registry
        </Button>
        <Button 
          onClick={() => navigate(`/${contentType.toLowerCase()}/cast/characters/${characterName}/edit`)}
          className="bg-studio/10 border border-studio/30 text-studio hover:bg-studio hover:text-black transition-all font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-xl"
        >
          <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit Bio
        </Button>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 space-y-8">
          <div className="aspect-[4/5] rounded-[3rem] bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <User className="w-32 h-32 text-zinc-800 group-hover:text-studio/20 transition-all duration-1000 group-hover:scale-110" />
            
            <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/60 backdrop-blur-md border border-white/5 rounded-3xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
               <p className="text-[10px] font-black text-studio uppercase tracking-[0.2em] mb-1">Visual DNA</p>
               <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 italic">"{character.appearance || 'Generic aesthetic parameters.'}"</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl text-center space-y-2">
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Archetype</p>
              <p className="text-xs font-bold text-studio uppercase">{character.archetype || 'Main'}</p>
            </div>
            <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl text-center space-y-2">
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Alignment</p>
              <p className="text-xs font-bold text-fuchsia-400 uppercase">{character.personality || 'Neutral'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="px-3 py-1 bg-studio/10 border border-studio/20 rounded-full text-[10px] font-black text-studio uppercase tracking-widest flex items-center gap-2 shadow-studio">
                 <Shield className="w-3 h-3" /> System Certified Character
               </div>
               <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                 UID: {Math.random().toString(36).substring(7).toUpperCase()}
               </div>
            </div>
            <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {character.name}
            </h1>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl italic">
              "{character.goal || 'No primary objective defined.'}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-6 group/card hover:border-studio/30 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-studio/10 flex items-center justify-center text-studio">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Core Narrative</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">Ideological Conflict</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                {character.conflict || 'The internal struggle between duty and desire remains unspecified in the current manifest.'}
              </p>
            </Card>

            <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-6 group/card hover:border-fuchsia-500/30 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500">
                    <Skull className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Psychological DNA</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">Fatal Flaw</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                {character.flaw || 'The fundamental vulnerability that threatens to derail their mission.'}
              </p>
            </Card>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-studio" />
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Communication Protocol</h3>
             </div>
             <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Zap className="w-12 h-12 text-studio" />
                </div>
                <p className="text-2xl text-white font-medium italic leading-relaxed">
                  "{character.speakingStyle || 'Precise and calculated dialogue patterns.'}"
                </p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Classified Information</h3>
             </div>
             <div className="p-8 bg-orange-500/5 border border-orange-500/10 rounded-[2.5rem] blur-[4px] hover:blur-none transition-all duration-700 cursor-help">
                <p className="text-sm text-orange-400/80 font-bold uppercase tracking-widest italic leading-relaxed">
                  {character.secret || 'NO CLASSIFIED DATA FOUND ON CURRENT LEVEL.'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}


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
  Lock,
  Camera,
  Sparkles,
  Sun,
  Scale
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGenerator } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CharacterViewPage() {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const { castData, castList, contentType } = useGenerator();

  const displayCast = castData?.characters || castList || [];
  const character = displayCast.find((c: any) => c.name === characterName);

  const toText = (value: unknown, fallback = ''): string => {
    if (typeof value === 'string') return value;
    if (value == null) return fallback;
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
        .join(', ');
    }
    if (typeof value === 'object') {
      return Object.values(value as Record<string, unknown>)
        .map((item) => (typeof item === 'string' ? item : Array.isArray(item) ? item.join(', ') : JSON.stringify(item)))
        .join(' | ');
    }
    return String(value);
  };

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
          <Edit3 className="w-3.5 h-3.5 mr-2" /> Refine DNA
        </Button>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 space-y-8">
          <div className="aspect-[4/5] rounded-[3.5rem] bg-zinc-950 border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-studio/10 via-transparent to-fuchsia-500/5" />
            
            {/* Animated Neural Circuit */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
              <motion.path 
                d="M0 20 L40 20 L50 10 L80 10" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-studio"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.path 
                d="M100 80 L60 80 L50 90 L20 90" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-fuchsia-500"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              />
            </svg>

            {character.imageUrl ? (
              <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
            ) : (
              <User className="w-32 h-32 text-zinc-900 group-hover:text-studio/20 transition-all duration-1000 group-hover:scale-110" />
            )}
            
            <div className="absolute bottom-8 left-8 right-8 p-8 bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
               <p className="text-[10px] font-black text-studio uppercase tracking-[0.3em] mb-2">Visual Parameters</p>
               <p className="text-xs text-zinc-400 leading-relaxed italic">"{toText(character.technicalModel?.visualDNA || character.appearance || 'Aesthetic parameters pending.')}"</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] text-center space-y-2 hover:border-studio/30 transition-colors">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Archetype</p>
              <p className="text-sm font-black text-studio uppercase tracking-tighter">{toText(character.archetype) || 'Main'}</p>
            </div>
            <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] text-center space-y-2 hover:border-fuchsia-500/30 transition-colors">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Alignment</p>
              <p className="text-sm font-black text-fuchsia-400 uppercase tracking-tighter">{toText(character.personality) || 'Neutral'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-4 py-1.5 bg-studio/5 border border-studio/20 rounded-2xl text-[9px] font-black text-studio uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-studio shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
                  Neural Identity Verified
               </div>
               <div className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  SID: CAST-{Math.random().toString(36).substring(7).toUpperCase()}
               </div>
            </div>
            <h1 className="text-8xl font-black text-white uppercase tracking-tighter leading-none">
              {character.name}
            </h1>
            <p className="text-2xl text-zinc-400 font-medium leading-relaxed max-w-3xl italic border-l-2 border-studio/40 pl-8">
              "{toText(character.goal) || 'No primary objective defined.'}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-10 bg-zinc-950/60 border-white/5 backdrop-blur-2xl space-y-6 group/card hover:border-studio/30 transition-all duration-700 rounded-[3rem]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-studio/10 flex items-center justify-center text-studio shadow-inner">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ideological Protocol</p>
                  <p className="text-lg font-black text-white uppercase tracking-tighter">Primary Conflict</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">
                {toText(character.conflict) || 'The internal struggle between duty and desire remains unspecified.'}
              </p>
            </Card>

            <Card className="p-10 bg-zinc-950/60 border-white/5 backdrop-blur-2xl space-y-6 group/card hover:border-fuchsia-500/30 transition-all duration-700 rounded-[3rem]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 shadow-inner">
                  <Skull className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Psychological DNA</p>
                  <p className="text-lg font-black text-white uppercase tracking-tighter">Fatal Flaw</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">
                {toText(character.flaw) || 'The fundamental vulnerability that threatens to derail their mission.'}
              </p>
            </Card>
          </div>

          {/* Deep Production DNA Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-red-500">
                  <Camera className="w-4 h-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Directorial Camera Notes</h3>
               </div>
               <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem]">
                  <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                    {toText(character.powerSystem?.cameraChoreography || 'Maintain high-octane tracking shots with emphasis on kinetic weight.')}
                  </p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-fuchsia-400">
                  <Scale className="w-4 h-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">The Moral Dilemma</h3>
               </div>
               <div className="p-8 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-[2.5rem]">
                  <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                    {toText(character.narrative?.arcRoadmap?.moralDilemma || 'A choice between personal salvation and the collective good.')}
                  </p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Cinematic VFX Signature</h3>
               </div>
               <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem]">
                  <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                    {toText(character.technicalModel?.vfxSignature || 'Subtle chromatic aberration / particulate dust effects.')}
                  </p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-amber-500">
                  <Sun className="w-4 h-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Rendering Lighting Logic</h3>
               </div>
               <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem]">
                  <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                    {toText(character.technicalModel?.lightingLogic || 'Rim lighting / High contrast shadow profiles.')}
                  </p>
               </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-3 text-studio">
                <MessageSquare className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Acoustic & Communication Protocol</h3>
             </div>
             <div className="p-12 bg-black/60 border border-white/5 rounded-[3.5rem] relative overflow-hidden group/speech">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                   <Zap className="w-24 h-24 text-studio" />
                </div>
                <div className="flex flex-col gap-6 relative z-10">
                   <p className="text-3xl text-white font-black italic tracking-tighter leading-tight">
                     "{toText(character.speakingStyle) || 'Clinical and precise communication protocols.'}"
                   </p>
                   <div className="flex gap-4">
                      <div className="px-4 py-1.5 bg-studio/10 border border-studio/30 rounded-xl text-[10px] font-black text-studio uppercase tracking-widest">
                         Rhythm: {toText(character.speakingStyle?.dialogueRhythm || 'Melodic')}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-3 text-orange-500">
                <Lock className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Classified Identity Data</h3>
             </div>
             <div className="p-10 bg-orange-500/5 border border-orange-500/10 rounded-[3rem] blur-[8px] hover:blur-none transition-all duration-1000 cursor-help">
                <p className="text-lg text-orange-400 font-black uppercase tracking-[0.2em] italic leading-relaxed">
                  {toText(character.secret) || 'NO CLASSIFIED DATA FOUND ON CURRENT LEVEL.'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}


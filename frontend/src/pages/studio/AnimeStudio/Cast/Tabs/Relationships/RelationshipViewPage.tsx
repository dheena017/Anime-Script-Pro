import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
   ChevronLeft,
   Edit3,
   Workflow,
   Activity,
   History,
   AlertTriangle
} from 'lucide-react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTypeIcon } from '../../components/RelationshipCard';

export default function RelationshipViewPage() {
   const { relationshipId } = useParams();
   const navigate = useNavigate();
   const { characterRelationships, contentType } = useGeneratorState();

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

   const connection = connections.find((c: any) => c.id === relationshipId);

   if (!connection) {
      return (
         <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
            <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-zinc-700">
               <Workflow className="w-10 h-10" />
            </div>
            <div className="space-y-2">
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Connection Severed</h2>
               <p className="text-zinc-500 text-sm max-w-xs">The requested emotional thread could not be located in the current manifest.</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)} className="border-zinc-800 text-zinc-400">
               <ChevronLeft className="w-4 h-4 mr-2" /> Back to Matrix
            </Button>
         </div>
      );
   }

   const isHighTension = connection.tension >= 8;

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
               Back to Relationship Matrix
            </Button>
            <Button
               onClick={() => navigate(`/${contentType.toLowerCase()}/cast/relationships/${relationshipId}/edit`)}
               className="bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs px-6 h-10 rounded-xl"
            >
               <Edit3 className="w-3.5 h-3.5 mr-2" /> Modify Connection
            </Button>
         </div>

         {/* Hero Visualizer */}
         <Card className="p-12 bg-zinc-950/40 border-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.05)_0%,transparent_70%)]" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
               <div className="flex flex-col md:flex-row items-center gap-16 w-full justify-center">
                  <div className="text-center space-y-4 flex-1">
                     <div className="w-24 h-24 mx-auto rounded-[2.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6 group-hover:scale-110 transition-transform duration-700">
                        <Workflow className="w-10 h-10" />
                     </div>
                     <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{connection.source}</h2>
                     <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Source Entity</p>
                  </div>

                  <div className="flex flex-col items-center gap-4 py-8">
                     <div className="px-6 py-2 bg-black/60 border border-white/10 rounded-full flex items-center gap-3 shadow-2xl">
                        <div className="p-2 rounded-full bg-zinc-900 shadow-inner">
                           {getTypeIcon(connection.type)}
                        </div>
                        <span className="text-sm font-black text-white uppercase tracking-[0.2em]">{connection.type}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent relative">
                           {isHighTension && <motion.div animate={{ x: [0, 96, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-1 w-2 h-2 rounded-full bg-red-500 blur-[2px]" />}
                        </div>
                     </div>
                     <div className="flex items-center gap-2 px-4 py-1.5 bg-black/40 border border-white/5 rounded-full">
                        <Activity className={`w-3 h-3 ${isHighTension ? 'text-red-500' : 'text-fuchsia-500'}`} />
                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Tension Index: {connection.tension}/10</span>
                     </div>
                  </div>

                  <div className="text-center space-y-4 flex-1">
                     <div className="w-24 h-24 mx-auto rounded-[2.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-6 group-hover:scale-110 transition-transform duration-700">
                        <Workflow className="w-10 h-10" />
                     </div>
                     <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{connection.target}</h2>
                     <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Target Entity</p>
                  </div>
               </div>
            </div>
         </Card>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <History className="w-4 h-4 text-fuchsia-500" />
                     <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Core Narrative</h3>
                  </div>
                  <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] relative overflow-hidden">
                     <p className="text-2xl text-white font-medium italic leading-relaxed relative z-10">
                        "{connection.description || 'The nature of this emotional thread remains a strategic mystery within the current lore synthesis.'}"
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8 bg-zinc-900/40 border-white/5 space-y-4">
                     <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Narrative Weight</p>
                     <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">
                        {connection.tension > 7 ? "[HIGH_TENSION_PATHWAY]: Significant conflict probability detected in current scene manifests." : "[STABLE_CONNECTION]: Standard social resonance maintained."}
                     </p>
                  </Card>
                  <Card className="p-8 bg-zinc-900/40 border-white/5 space-y-4">
                     <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Conflict Probability</p>
                     <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-white">{connection.tension * 10}%</span>
                        <div className={`w-12 h-1.5 rounded-full ${isHighTension ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-fuchsia-500'}`} />
                     </div>
                     <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Real-time Synthesis Calculation</p>
                  </Card>
               </div>
            </div>

            <div className="space-y-8">
               <div className="p-8 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center gap-3 text-fuchsia-400">
                     <AlertTriangle className="w-4 h-4" />
                     <span className="text-xs font-black uppercase tracking-widest">Architect Advisory</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                     "Connections with high tension indices are prime candidates for Mid-Season Climax manifestation."
                  </p>
                  <div className="h-[1px] bg-fuchsia-500/10" />
                  <div className="space-y-2">
                     <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Manifestation UUID</p>
                     <p className="text-xs font-mono text-fuchsia-500/50">{connection.id.toUpperCase()}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}


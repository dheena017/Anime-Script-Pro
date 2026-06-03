import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Timer, Activity, Zap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeriesEmptyTab } from '../components/SeriesEmptyTab';

interface TimelineTabProps {
  plan: any[];
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ plan }) => {
  if (!plan || plan.length === 0) {
    return (
      <SeriesEmptyTab 
        icon={Calendar}
        title="Production Schedule Pending"
        description="The production timeline cannot be estimated without an active series plan. Generate a roadmap to see the synthesis milestones."
        accentColor="blue"
      />
    );
  }

  // Calculate real metrics
  const episodeCount = plan.length;
  const totalScenes = plan.reduce((acc, ep) => acc + parseInt(ep.asset_matrix?.scene_count || "0"), 0);
  
  // Calculate readiness score
  const hasCharacters = plan.some(ep => ep.focus_characters && ep.focus_characters.length > 0);
  const hasSettings = plan.some(ep => ep.setting);
  const hasArcs = plan.some(ep => ep.emotional_arc);
  
  const readinessScore = [hasCharacters, hasSettings, hasArcs, totalScenes > 0].filter(Boolean).length * 25;

  const phases = [
    { 
        phase: 'Structural Mapping', 
        duration: readinessScore >= 25 ? '24h' : 'TBD', 
        status: readinessScore >= 25 ? 'Complete' : 'Active', 
        description: 'Multi-episode narrative arcs and continuity established.',
        icon: Zap,
        color: 'text-amber-400',
        progress: readinessScore >= 25 ? 100 : 0
    },
    { 
        phase: 'Asset Manifesting', 
        duration: totalScenes > 0 ? `${Math.ceil(totalScenes * 0.15)}h` : 'TBD', 
        status: readinessScore >= 50 ? 'Active' : 'Pending', 
        description: totalScenes > 0 ? `Generating visual and audio stems for ${totalScenes} sequenced scenes.` : 'Awaiting scene count for asset projection.',
        icon: Activity,
        color: 'text-emerald-400',
        progress: readinessScore >= 50 ? 65 : 0
    },
    { 
        phase: 'AI Scripting', 
        duration: totalScenes > 0 ? `${Math.ceil(totalScenes * 0.5)}h` : 'TBD', 
        status: readinessScore >= 75 ? 'Pending' : 'Queued', 
        description: 'Deep-learning dialogue synthesis and script refinement.',
        icon: Clock,
        color: 'text-blue-400',
        progress: readinessScore >= 75 ? 10 : 0
    },
    { 
        phase: 'Final Synthesis', 
        duration: totalScenes > 0 ? `${Math.ceil(totalScenes * 1.2)}h` : 'TBD', 
        status: readinessScore === 100 ? 'Queued' : 'Locked', 
        description: 'Full-sequence rendering and post-production manifesting.',
        icon: Timer,
        color: 'text-fuchsia-400',
        progress: 0
    }
  ];

  return (
    <div className="py-8 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
         <div className="w-20 h-20 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(59,130,246,0.15)]">
            <Clock className="w-10 h-10 text-blue-400" />
         </div>
         <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Production <span className="text-blue-500">Timeline</span></h2>
         <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">Automated synthesis schedule and rendering milestones</p>
      </div>

      {/* Production Readiness Gauge */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-8 bg-[#080808] border border-white/5 rounded-[3rem] flex items-center justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">AI Readiness Index</h3>
                    <p className="text-4xl font-black text-white uppercase tracking-tighter">{readinessScore}% SYNC</p>
                </div>
                <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${readinessScore}%` }} />
                </div>
            </div>
            <div className="flex gap-2 relative z-10">
                {[hasCharacters, hasSettings, hasArcs, totalScenes > 0].map((check, i) => (
                    <div key={i} className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500",
                        check ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/5 text-zinc-700"
                    )}>
                        <Activity className="w-5 h-5" />
                    </div>
                ))}
            </div>
        </div>

        <div className="p-8 bg-[#080808] border border-white/5 rounded-[3rem] flex flex-col justify-center items-center text-center space-y-2 group">
            <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Est. Time to Lock</span>
            <p className="text-4xl font-black text-blue-400 group-hover:scale-110 transition-transform font-mono">~{Math.ceil(totalScenes * 0.2 + episodeCount * 18)}h</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4">
         {phases.map((phase, i) => (
           <motion.div 
             key={i} 
             className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-[#080808] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group relative overflow-hidden"
           >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-8 relative z-10">
                 <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all", phase.color)}>
                    <phase.icon className="w-8 h-8" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">{phase.phase}</h3>
                        <span className="text-xs font-black px-2 py-0.5 bg-white/5 rounded text-zinc-500 uppercase tracking-widest border border-white/5">{phase.duration}</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-500 max-w-md leading-relaxed">{phase.description}</p>
                    
                    {phase.progress > 0 && phase.progress < 100 && (
                        <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${phase.progress}%` }}
                                className="h-full bg-blue-500/40"
                            />
                        </div>
                    )}
                 </div>
              </div>

              <div className="mt-6 md:mt-0 flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl border border-white/5 shrink-0">
                 <div className={cn(
                    "w-2 h-2 rounded-full", 
                    phase.status === 'Complete' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : 
                    phase.status === 'Active' ? "bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" : 
                    "bg-zinc-700"
                 )} />
                 <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{phase.status}</span>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="max-w-4xl mx-auto p-10 bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
              <Calendar className="w-10 h-10 text-blue-400" />
              <div className="space-y-1">
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Ready for Scripting</h4>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">Proceed to script lab to begin dialogue manifestation</p>
              </div>
          </div>
          <button className="px-8 py-4 bg-blue-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-400 transition-all shadow-blue">
              Launch Production
          </button>
      </div>
    </div>
  );
};





import React from 'react';
import { GitMerge, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SeriesEmptyTab } from '../components/SeriesEmptyTab';

interface ArcsTabProps {
  plan: any[];
}

export const ArcsTab: React.FC<ArcsTabProps> = ({ plan }) => {
  if (!plan || plan.length === 0) {
    return (
      <SeriesEmptyTab 
        icon={GitMerge}
        title="No Arcs Detected"
        description="The narrative architecture is empty. Generate a series plan to visualize the story progression."
        accentColor="fuchsia"
      />
    );
  }
  // If no plan, we could show a message, but parent handles it.
  // Group episodes into "Phases" for visualization if many episodes
  const totalEpisodes = plan.length;
  const episodesPerPhase = Math.max(1, Math.ceil(totalEpisodes / 4));
  
  const phases = [
    { title: 'Exposition & Setup', status: 'Act I', color: 'text-blue-400', glow: 'shadow-blue-500/20', bg: 'bg-blue-500/5' },
    { title: 'Rising Tension', status: 'Act II-A', color: 'text-amber-400', glow: 'shadow-amber-500/20', bg: 'bg-amber-500/5' },
    { title: 'Core Conflict', status: 'Act II-B', color: 'text-rose-400', glow: 'shadow-rose-500/20', bg: 'bg-rose-500/5' },
    { title: 'Climax & Resolution', status: 'Act III', color: 'text-emerald-400', glow: 'shadow-emerald-500/20', bg: 'bg-emerald-500/5' }
  ];

  return (
    <div className="py-8 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-[2.5rem] bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(217,70,239,0.15)] relative group"
        >
          <div className="absolute inset-0 bg-fuchsia-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <GitMerge className="w-10 h-10 text-fuchsia-400 relative z-10" />
        </motion.div>
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Narrative <span className="text-fuchsia-500">Architecture</span></h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed">Mapping episodic emotional turns and seasonal progression dynamics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {phases.map((phase, i) => {
          const startIdx = i * episodesPerPhase;
          const endIdx = Math.min(startIdx + episodesPerPhase, totalEpisodes);
          const phaseEpisodes = plan.slice(startIdx, endIdx);
          
          if (phaseEpisodes.length === 0) return null;

          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-8 rounded-[3rem] border border-white/5 space-y-8 relative group overflow-hidden transition-all duration-500 hover:border-fuchsia-500/30",
                phase.bg
              )}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen className="w-24 h-24 text-white" />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-black/40 border border-white/5", phase.color)}>
                    {phase.status}
                  </span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-wider mt-4">{phase.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Episodes</p>
                  <p className="text-2xl font-black text-white font-mono">{phaseEpisodes[0].episode}-{phaseEpisodes[phaseEpisodes.length - 1].episode}</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {phaseEpisodes.map((ep, j) => (
                  <div key={j} className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-3 hover:bg-black/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-fuchsia-500/60 uppercase tracking-widest">Ep {ep.episode} // {ep.title}</span>
                      <Sparkles className="w-3 h-3 text-fuchsia-500/40" />
                    </div>
                    <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">
                      {ep.emotional_arc ? `"${ep.emotional_arc}"` : "Narrative arc pending synthesis..."}
                    </p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: (i * 0.5) + (j * 0.2) }}
                        className="h-full bg-fuchsia-500/30 w-full" 
                       />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};





import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, AlertTriangle, Flag, Scale } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';

import { CastEmptyState } from '../components/CastEmptyState';
import { CastContext } from '../CastLayout';

export const ArcsTab: React.FC = () => {
  const { handleLoadDemo } = React.useContext(CastContext);
  const { castList, isGeneratingCharacters } = useGenerator();

  if (!castList || castList.length === 0) {
    return (
      <CastEmptyState
        onLaunch={() => {
          window.dispatchEvent(new CustomEvent('studio-generate-cast'));
        }}
        onLoadDemo={handleLoadDemo}
        isGenerating={isGeneratingCharacters}
      />
    );
  }

  const toText = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (value == null) return 'Not Specified';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Narrative Chronicle</h2>
          <p className="text-fuchsia-500/60 text-[10px] font-black uppercase tracking-[0.3em]">Temporal Arc Simulation v8.0</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-xl flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-fuchsia-500" />
            <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">Arc Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16">
        {castList?.map((char: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 1 }}
            className="group relative"
          >
            {/* Background Dossier Sheet */}
            <div className="absolute inset-0 bg-[#080808] border border-white/5 rounded-[4rem] shadow-2xl transition-all duration-700 group-hover:border-fuchsia-500/20" />
            
            <div className="relative z-10 p-12 flex flex-col lg:flex-row gap-12">
              {/* Identity Header */}
              <div className="shrink-0 flex flex-col items-center lg:items-start gap-6 border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-12">
                <div className="relative">
                  <div className="w-32 h-32 rounded-[3rem] bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-all duration-700 shadow-2xl overflow-hidden">
                     <TrendingUp className="w-12 h-12 relative z-10" />
                     <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-4 py-1 rounded-full bg-black border border-white/10 text-[9px] font-black text-white uppercase tracking-widest shadow-xl">
                    ARC-{idx + 1}
                  </div>
                </div>
                
                <div className="text-center lg:text-left space-y-1">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{char.name}</h3>
                  <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.2em]">Primary Transformation</p>
                </div>

                <div className="flex gap-2">
                  <div className="w-10 h-1 bg-fuchsia-500 rounded-full" />
                  <div className="w-4 h-1 bg-zinc-800 rounded-full" />
                  <div className="w-4 h-1 bg-zinc-800 rounded-full" />
                </div>
              </div>

              {/* Arc Roadmap (The Timeline) */}
              <div className="flex-1 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                   {/* Step 1 */}
                   <div className="space-y-6 relative">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-fuchsia-500/40 flex items-center justify-center text-[10px] font-black text-fuchsia-400 shadow-lg">1</div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Initial State</span>
                      </div>
                      <div className="p-8 bg-zinc-950/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/40 transition-all duration-500 min-h-[160px]">
                        <p className="text-sm font-medium text-zinc-400 leading-relaxed italic">
                          "{toText(char.narrative?.arcRoadmap?.initialState || char.goal || 'Foundational character parameters.')}"
                        </p>
                      </div>
                   </div>

                   {/* Step 2 */}
                   <div className="space-y-6 relative">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/40 flex items-center justify-center text-[10px] font-black text-fuchsia-400 shadow-lg">2</div>
                        <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">The Catalyst</span>
                      </div>
                      <div className="p-8 bg-fuchsia-500/5 rounded-[2.5rem] border border-fuchsia-500/10 backdrop-blur-xl group-hover:bg-fuchsia-500/10 transition-all duration-500 min-h-[160px] relative overflow-hidden">
                        <AlertTriangle className="absolute -top-4 -right-4 w-24 h-24 text-fuchsia-500/5 rotate-12" />
                        <p className="text-sm font-medium text-zinc-300 leading-relaxed font-bold">
                          {toText(char.narrative?.arcRoadmap?.catalyst || char.conflict || 'Primary ideological stressors.')}
                        </p>
                      </div>
                   </div>

                   {/* Step 3 */}
                   <div className="space-y-6 relative">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-fuchsia-500/40 flex items-center justify-center text-[10px] font-black text-fuchsia-400 shadow-lg">3</div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Transformation</span>
                      </div>
                      <div className="p-8 bg-zinc-950/40 rounded-[2.5rem] border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/40 transition-all duration-500 min-h-[160px]">
                        <p className="text-sm font-medium text-zinc-400 leading-relaxed">
                          {toText(char.narrative?.arcRoadmap?.finalTransformation || char.secret || 'Transformation Pending')}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black border border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                          <Flag className="w-2.5 h-2.5" /> Endgame Confirmed
                        </div>
                      </div>
                   </div>
                </div>

                {/* Moral Dilemma Section */}
                <div className="mt-12 p-8 bg-gradient-to-br from-fuchsia-500/10 to-transparent rounded-[3rem] border border-fuchsia-500/20 relative overflow-hidden group/dilemma">
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                      <div className="shrink-0 p-4 bg-black rounded-2xl border border-white/10">
                        <Scale className="w-8 h-8 text-fuchsia-500" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.3em]">The Moral Dilemma</h4>
                        <p className="text-sm font-medium text-white leading-relaxed italic">
                          "{toText(char.narrative?.arcRoadmap?.moralDilemma || 'A choice between personal salvation and the collective good.')}"
                        </p>
                      </div>
                      <div className="shrink-0 px-6 py-2 bg-black/40 rounded-xl border border-white/5 text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                        Conflict Tier: Omega
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-full bg-fuchsia-500/5 blur-3xl pointer-events-none group-hover/dilemma:bg-fuchsia-500/10 transition-colors" />
                </div>

                {/* Connecting Line (Horizontal on Desktop) */}
                <div className="hidden md:block absolute top-[1.25rem] left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent z-0" />
              </div>
            </div>

            {/* Subtle Arc Identity Flare */}
            <div className="absolute top-1/2 left-0 w-1 h-32 bg-fuchsia-500/40 rounded-full blur-[2px] -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

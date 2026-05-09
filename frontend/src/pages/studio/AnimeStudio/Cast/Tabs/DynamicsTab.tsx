import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, GitBranch, Heart, Skull, Users } from 'lucide-react';
import { useGeneratorState } from '@/hooks/useGenerator';

import { CastEmptyState } from '../components/CastEmptyState';
import { CastContext } from '../CastLayout';

export const DynamicsTab: React.FC = () => {
  const { handleLoadDemo } = React.useContext(CastContext);
  const { castList, isGeneratingCharacters } = useGeneratorState();

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
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Social Intelligence</h2>
          <p className="text-orange-500/60 text-[10px] font-black uppercase tracking-[0.3em]">Interpersonal Friction Analysis v1.5</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Pulse Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {castList?.map((char: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
            className="group relative bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden hover:border-orange-500/30 transition-all duration-700 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none group-hover:bg-orange-500/10 transition-colors duration-700" />
            
            <div className="relative z-10 p-10 flex flex-col lg:flex-row gap-12">
              {/* Profile Sector */}
              <div className="shrink-0 flex flex-col items-center lg:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-orange-400 group-hover:scale-105 group-hover:border-orange-500/40 transition-all duration-500 shadow-xl overflow-hidden">
                     <GitBranch className="w-12 h-12 relative z-10" />
                     <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-lg">
                    <Users className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                
                <div className="text-center lg:text-left space-y-1">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{char.name}</h3>
                  <div className="px-3 py-1 bg-zinc-900/50 rounded-full border border-white/5 text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                    MATRIX-NODE: {idx.toString().padStart(3, '0')}
                  </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-2">
                   <div className="h-1 bg-orange-500 rounded-full" />
                   <div className="h-1 bg-orange-500/20 rounded-full" />
                </div>
              </div>

              {/* Dynamics Data Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">
                      <Users className="w-3.5 h-3.5" /> Social Standing
                    </div>
                    <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                      <p className="text-sm font-medium text-zinc-300 leading-relaxed italic">
                        "{toText(char.worldAlignment?.socialDynamics?.socialStanding || char.personality || 'Social parameters not yet analyzed.')}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">
                      <Heart className="w-3.5 h-3.5" /> Primary Bond
                    </div>
                    <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                      <p className="text-[11px] font-medium text-zinc-400 leading-relaxed uppercase tracking-wide">
                        {toText(char.worldAlignment?.socialDynamics?.coreBonds || char.bonds || 'Loyalty protocols initialized.')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">
                      <Coffee className="w-3.5 h-3.5" /> Group Etiquette
                    </div>
                    <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl">
                      <p className="text-xs font-medium text-zinc-300 leading-relaxed italic">
                        {toText(char.worldAlignment?.socialDynamics?.groupEtiquette || 'Maintains professional distance while observing group hierarchy.')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">
                      <Skull className="w-3.5 h-3.5" /> Friction Core
                    </div>
                    <div className="p-8 bg-orange-500/5 rounded-[2.5rem] border border-orange-500/10 backdrop-blur-xl group-hover:bg-orange-500/10 transition-all duration-500 min-h-[120px] relative overflow-hidden">
                      <p className="text-sm font-black text-orange-400 leading-relaxed uppercase tracking-widest italic">
                        {toText(char.worldAlignment?.socialDynamics?.coreFriction || char.flaw || 'No frictions detected.')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-4 bg-black rounded-2xl border border-white/5">
                     <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                     <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Stability: Optimal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Matrix ID */}
            <div className="absolute bottom-4 right-8 opacity-20 pointer-events-none">
              <p className="text-[40px] font-black text-white leading-none">0{idx + 1}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

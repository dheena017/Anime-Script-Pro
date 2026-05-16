import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Zap, Shield, Target, Video } from 'lucide-react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';

import { CastEmptyState } from '../components/CastEmptyState';
import { CastContext } from '../CastLayout';

export const CombatTab: React.FC = () => {
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
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Tactical Manifest</h2>
          <p className="text-red-500/60 text-xs font-black uppercase tracking-[0.3em]">Combat Proficiency Analysis v4.2</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-2">
            <Swords className="w-3 h-3 text-red-500" />
            <span className="text-xs font-black text-red-400 uppercase tracking-widest">Battle Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {castList?.map((char: any, idx: number) => {
          const powerLevelNum = parseInt(toText(char.powerSystem?.powerLevel).replace(/[^0-9]/g, '')) || 75;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden hover:border-red-500/30 transition-all duration-700 shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 p-10 flex flex-col lg:flex-row gap-12">
                {/* Profile Sector */}
                <div className="shrink-0 flex flex-col items-center lg:items-start gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-red-400 group-hover:scale-105 group-hover:border-red-500/40 transition-all duration-500 shadow-xl overflow-hidden">
                       <Zap className="w-12 h-12 relative z-10" />
                       <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute -top-2 -left-2 px-3 py-1 rounded-full bg-red-500 text-xs font-black text-black uppercase tracking-widest shadow-lg">
                      {toText(char.archetype || 'FIGHTER')}
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-left space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{char.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={cn("w-3 h-1 rounded-full", i < 4 ? "bg-red-500" : "bg-zinc-800")} />
                        ))}
                      </div>
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Threat Level: High</p>
                    </div>
                  </div>

                  <div className="w-full space-y-3 p-6 bg-red-500/5 rounded-3xl border border-red-500/10">
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-black text-red-400 uppercase tracking-widest">Power Output</p>
                      <p className="text-xl font-black text-white leading-none">{powerLevelNum}%</p>
                    </div>
                    <div className="h-2 bg-black rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${powerLevelNum}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-red-800 to-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Tactical Data Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs font-black uppercase text-red-500 tracking-[0.2em]">
                        <Swords className="w-3.5 h-3.5" /> Signature Ability
                      </div>
                      <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                        <h4 className="text-studio font-black uppercase text-xs mb-2 tracking-widest">Deployment Ready</h4>
                        <p className="text-sm font-medium text-zinc-300 leading-relaxed italic">
                          "{toText(char.powerSystem?.signatureAbility || char.signatureMove || 'Basic Tactical Engagement')}"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs font-black uppercase text-red-500 tracking-[0.2em]">
                        <Shield className="w-3.5 h-3.5" /> Defensive Profile
                      </div>
                      <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                        <p className="text-xs font-medium text-zinc-400 leading-relaxed uppercase tracking-wide">
                          {toText(char.powerSystem?.defensiveStyle || char.defensiveStyle || 'Evasive / Parry-Focused')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs font-black uppercase text-red-500 tracking-[0.2em]">
                        <Video className="w-3.5 h-3.5" /> Director's Camera Notes
                      </div>
                      <div className="p-6 bg-red-500/5 rounded-[2rem] border border-red-500/10 backdrop-blur-xl group-hover:bg-red-500/10 transition-all duration-500">
                        <div className="flex items-center gap-2 mb-3">
                           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                           <span className="text-xs font-black text-white uppercase tracking-widest">Auto-Choreography Active</span>
                        </div>
                        <p className="text-xs font-medium text-zinc-300 leading-relaxed italic">
                          {toText(char.powerSystem?.cameraChoreography || 'Maintain high-octane tracking shots with emphasis on kinetic weight.')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs font-black uppercase text-red-500 tracking-[0.2em]">
                        <Target className="w-3.5 h-3.5" /> Tactical Limitations
                      </div>
                      <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                        <p className="text-sm font-medium text-zinc-300 leading-relaxed">
                          {toText(char.powerSystem?.limitations || 'No critical mechanical failures detected.')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black border border-white/5 rounded-2xl">
                        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">STRENGTH</p>
                        <p className="text-sm font-black text-white">S-RANK</p>
                      </div>
                      <div className="p-4 bg-black border border-white/5 rounded-2xl">
                        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">SPEED</p>
                        <p className="text-sm font-black text-white">A-RANK</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ambient Red Glow on hover */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/5 blur-[80px] pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

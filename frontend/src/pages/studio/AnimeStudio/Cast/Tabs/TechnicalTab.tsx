import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Palette, Ruler, User, Sparkles, Sun } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';

import { CastEmptyState } from '../components/CastEmptyState';
import { CastContext } from '../CastLayout';

export const TechnicalTab: React.FC = () => {
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
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Production Rig Manifest</h2>
          <p className="text-indigo-500/60 text-[10px] font-black uppercase tracking-[0.3em]">Neural Character Rigging v5.0</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-center gap-2">
            <Layout className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Rig Validated</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {castList?.map((char: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
            className="group relative bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-700 shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors" />
            
            <div className="relative z-10 p-10 flex flex-col lg:flex-row gap-12">
              {/* Profile Sector */}
              <div className="shrink-0 flex flex-col items-center lg:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:border-indigo-500/40 transition-all duration-500 shadow-xl overflow-hidden">
                     <Layout className="w-12 h-12 relative z-10" />
                     <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-lg">
                    <Palette className="w-4 h-4 text-indigo-500" />
                  </div>
                </div>
                
                <div className="text-center lg:text-left space-y-1">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{char.name}</h3>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Rig-ID: {idx.toString().padStart(4, '0')}</p>
                </div>

                <div className="w-full flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-indigo-500/20 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Technical Data Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">
                      <Palette className="w-3.5 h-3.5" /> Color DNA / Visual Prompt
                    </div>
                    <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                      <p className="text-sm font-medium text-zinc-400 leading-relaxed italic">
                        "{toText(char.technicalModel?.visualDNA || char.visualPrompt || 'Aesthetic parameters pending.')}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">
                      <Ruler className="w-3.5 h-3.5" /> Scale & Proportions
                    </div>
                    <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                      <p className="text-[11px] font-medium text-zinc-400 leading-relaxed uppercase tracking-wide">
                        {toText(char.technicalModel?.heightComparison || char.appearance || 'Standard humanoid scale.')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">
                      <Sun className="w-3.5 h-3.5" /> Lighting Logic
                    </div>
                    <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                      <p className="text-[11px] font-medium text-zinc-400 leading-relaxed uppercase tracking-wide">
                        {toText(char.technicalModel?.lightingLogic || 'Rim lighting / High contrast shadow profiles.')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">
                      <User className="w-3.5 h-3.5" /> Animation Profile
                    </div>
                    <div className="p-8 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 backdrop-blur-xl group-hover:bg-indigo-500/10 transition-all duration-500 min-h-[120px]">
                      <h4 className="text-white font-black uppercase text-[10px] mb-2 tracking-widest">Movement Dynamics</h4>
                      <p className="text-sm font-medium text-indigo-300 leading-relaxed italic">
                        {toText(char.technicalModel?.movementStyle || char.movementStyle || 'Fluid / Standard')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">
                      <Sparkles className="w-3.5 h-3.5" /> VFX Signature
                    </div>
                    <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl relative overflow-hidden group/vfx">
                      <p className="text-xs font-black text-white italic relative z-10">
                        {toText(char.technicalModel?.vfxSignature || 'Subtle chromatic aberration / particulate dust.')}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-black rounded-3xl border border-white/5 flex items-center justify-between">
                     <div className="space-y-1">
                       <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Physics Weight</p>
                       <p className="text-sm font-black text-white">OPTIMIZED</p>
                     </div>
                     <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/10 animate-pulse" />
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Blueprint Overlay */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
              <Layout className="w-64 h-64 text-indigo-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

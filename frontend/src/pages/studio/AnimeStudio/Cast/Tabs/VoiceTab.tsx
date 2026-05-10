import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, MessageSquare, Music, Volume2 } from 'lucide-react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';

import { CastEmptyState } from '../components/CastEmptyState';
import { CastContext } from '../CastLayout';

export const VoiceTab: React.FC = () => {
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
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Acoustic Manifest</h2>
          <p className="text-cyan-500/60 text-[10px] font-black uppercase tracking-[0.3em]">Neural Vocal Blueprinting v2.0</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Live Syncing</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {castList?.map((char: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
            className="group relative bg-[#080808] border border-white/5 rounded-[3rem] overflow-hidden hover:border-cyan-500/30 transition-all duration-700 shadow-2xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[100px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-700" />
            
            <div className="relative z-10 p-10 flex flex-col lg:flex-row gap-12">
              {/* Profile Sector */}
              <div className="shrink-0 flex flex-col items-center lg:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all duration-500 shadow-xl overflow-hidden">
                     <Mic2 className="w-12 h-12 relative z-10" />
                     <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-lg">
                    <Volume2 className="w-4 h-4 text-cyan-500" />
                  </div>
                </div>
                
                <div className="text-center lg:text-left space-y-1">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{char.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status: Authenticated</p>
                  </div>
                </div>

                {/* Simulated Waveform */}
                <div className="w-full h-12 flex items-center justify-center gap-1 px-4 bg-black/40 rounded-2xl border border-white/5">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 24, 12, 32, 8] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1 + Math.random(),
                        delay: i * 0.1
                      }}
                      className="w-1 bg-cyan-500/40 rounded-full"
                    />
                  ))}
                </div>
              </div>

              {/* Intelligence Data Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-cyan-500 tracking-[0.2em]">
                      <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                      Vocal Archetype
                    </div>
                    <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                      <p className="text-sm font-medium text-zinc-300 leading-relaxed italic">
                        "{toText(char.speakingStyle?.voiceArchetype || char.voiceArchetype || 'Neutral Tone / Balanced Pitch')}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-cyan-500 tracking-[0.2em]">
                      <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                      Linguistic Framework
                    </div>
                    <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                      <p className="text-[11px] font-medium text-zinc-400 leading-relaxed uppercase tracking-wide">
                        {toText(char.speakingStyle?.sentence_structure || char.speakingStyle || 'Standard communication protocols.')}
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4">
                         <div className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-black text-cyan-400 uppercase tracking-widest">
                           Rhythm: {toText(char.speakingStyle?.dialogueRhythm || 'Melodic')}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-cyan-500 tracking-[0.2em]">
                      <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                      Signature Catchphrases
                    </div>
                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl space-y-3">
                       {Array.isArray(char.speakingStyle?.catchphrases) ? char.speakingStyle?.catchphrases.map((phrase: string, pIdx: number) => (
                         <div key={pIdx} className="flex items-start gap-3">
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-500 mt-0.5 shrink-0" />
                            <p className="text-sm font-black text-white italic">"{phrase}"</p>
                         </div>
                       )) : (
                         <p className="text-xs text-zinc-500 italic">No signature catchphrases defined.</p>
                       )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-cyan-500 tracking-[0.2em]">
                      <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                      Emotional Spectrum
                    </div>
                    <div className="p-6 bg-zinc-950/50 rounded-3xl border border-white/5 backdrop-blur-xl group-hover:bg-zinc-900/50 transition-all duration-500">
                      <p className="text-sm font-medium text-zinc-300 leading-relaxed">
                        {toText(char.speakingStyle?.emotionalSpectrum || char.emotionalSpectrum || 'Balanced / Situation Dependent')}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Diction Resonance</span>
                      <span className="text-[10px] font-black text-white">94%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '94%' }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle ID Strip */}
            <div className="h-2 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

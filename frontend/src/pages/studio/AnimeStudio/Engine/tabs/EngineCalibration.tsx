import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Cpu, Sparkles, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { useEngineState } from '@/contexts/generator';
import { cn } from '@/lib/utils';

export const EngineCalibration: React.FC = () => {
  const { 
    temperature = 0.85,
    maxTokens = 2048,
    topP = 0.95,
    topK = 40,
    isGeneratingDescription
  } = useGeneratorState();
  const {
    setTemperature,
    setMaxTokens,
    setTopP,
    setTopK
  } = useGeneratorDispatch();

  const { selectedModel, contentType } = useEngineState();

  const parameters = [
    { 
      id: 'temp', 
      label: 'Creativity Temperature', 
      value: temperature, 
      min: 0, 
      max: 2, 
      step: 0.01,
      desc: 'Controls randomness: Higher = Experimental, Lower = Precise.',
      icon: Zap,
      color: 'text-amber-400',
      accent: 'bg-amber-500'
    },
    { 
      id: 'tokens', 
      label: 'Max Output Length (Tokens)', 
      value: maxTokens, 
      min: 512, 
      max: 16384, 
      step: 128,
      desc: 'Output length ceiling. Higher values allow deep narrative arcs.',
      icon: Cpu,
      color: 'text-blue-400',
      accent: 'bg-blue-500'
    },
    { 
      id: 'topP', 
      label: 'Nucleus Sampling (Top-P)', 
      value: topP, 
      min: 0, 
      max: 1, 
      step: 0.01,
      desc: 'Filters token probability. High values increase vocabulary range.',
      icon: Target,
      color: 'text-fuchsia-400',
      accent: 'bg-fuchsia-500'
    },
    { 
      id: 'topK', 
      label: 'Token Diversity (Top-K)', 
      value: topK, 
      min: 1, 
      max: 100, 
      step: 1,
      desc: 'Limits word selection to the top K candidates. Boosts coherence.',
      icon: Sparkles,
      color: 'text-cyan-400',
      accent: 'bg-cyan-500'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Layers className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-black text-amber-500 uppercase tracking-[0.2em]">Parameter Calibration</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">
            NEURAL <span className="text-amber-500">PARAMETERS</span>
          </h1>
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest italic">Fine-tuning the generative logic of {selectedModel}</p>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => {
                setTemperature?.(0.85);
                setMaxTokens?.(4096);
                setTopP?.(0.95);
                setTopK?.(40);
             }}
             className="px-6 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
           >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Defaults
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          {parameters.map((param) => (
            <div key={param.id} className="space-y-6 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={cn("w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all group-hover:border-white/20 shadow-2xl", param.color)}>
                    <param.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">{param.label}</h4>
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mt-0.5 leading-none">{param.desc}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-2xl font-black text-white font-mono bg-[#050505] px-5 py-3 rounded-2xl border border-white/5 shadow-inner">
                     {param.value}
                   </div>
                </div>
              </div>
              
              <div className="relative pt-2">
                <input 
                  type="range" 
                  min={param.min} 
                  max={param.max} 
                  step={param.step}
                  value={param.value}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (param.id === 'temp') setTemperature?.(val);
                    if (param.id === 'tokens') setMaxTokens?.(val);
                    if (param.id === 'topP') setTopP?.(val);
                    if (param.id === 'topK') setTopK?.(val);
                  }}
                  className={cn("w-full h-2 bg-zinc-900 rounded-full appearance-none cursor-pointer transition-all", param.accent.replace('bg-', 'accent-'))}
                />
                <div className="flex justify-between mt-3 text-xs font-black text-zinc-700 uppercase tracking-widest px-1">
                  <span>{param.min}</span>
                  <span>{param.max}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="p-10 bg-[#050505] border border-white/5 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[80px] pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                 <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">System Integrity</h3>
                 <span className="text-xs font-black text-zinc-600 uppercase tracking-widest mt-1.5 block italic">Real-time Diagnostic</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                 <span className="text-xs font-black text-zinc-500 uppercase tracking-widest block">Active AI Model</span>
                 <div className="px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-black text-white uppercase tracking-widest">{selectedModel}</span>
                    <div className="w-2 h-2 rounded-full bg-studio animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                 </div>
              </div>

              <div className="space-y-2">
                 <span className="text-xs font-black text-zinc-500 uppercase tracking-widest block">Content Specialization</span>
                 <div className="px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{contentType} Optimized</span>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span className="text-zinc-600">Synthesis Stability</span>
                  <span className="text-amber-500">OPTIMAL</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    transition={{ duration: 2, ease: "circOut" }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
                 <RefreshCw className={cn("w-3.5 h-3.5 text-zinc-700", isGeneratingDescription && "animate-spin text-studio")} />
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                    Changes apply on the next generation run.
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

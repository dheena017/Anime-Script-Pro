import React from 'react';
import { Activity, Zap, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalysisTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-4">
         <div className="w-16 h-16 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <Activity className="w-8 h-8 text-rose-400" />
         </div>
         <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Narrative Pulse</h2>
         <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">AI-driven pacing and emotional resonance diagnostics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
         {[
           { label: 'Avg Tension', value: '78%', icon: Zap, color: 'text-rose-400' },
           { label: 'Narrative Arc', value: 'High-Paced Hero', icon: TrendingUp, color: 'text-rose-400' },
           { label: 'Emotional Bias', value: 'Melancholy', icon: Heart, color: 'text-rose-400' }
         ].map((item, i) => (
           <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4 hover:border-rose-500/20 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                 <item.icon className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                 <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
                 <p className="text-lg font-black text-white mt-1 uppercase tracking-tight">{item.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="p-10 bg-[#080808]/60 border border-white/5 rounded-[3rem] backdrop-blur-xl relative overflow-hidden h-[300px] flex items-end gap-2">
        <div className="absolute top-8 left-10">
            <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">Energy Waveform</h4>
            <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-1">Live tracking of script intensity per scene</p>
        </div>
        
        {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
                key={i}
                initial={{ height: 20 }}
                animate={{ 
                    height: [
                        Math.random() * 150 + 20, 
                        Math.random() * 150 + 20, 
                        Math.random() * 150 + 20
                    ] 
                }}
                transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: i * 0.05
                }}
                className="flex-1 bg-gradient-to-t from-rose-500/40 to-rose-400/10 rounded-full"
            />
        ))}

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#080808]/80" />
      </div>
    </div>
  );
};

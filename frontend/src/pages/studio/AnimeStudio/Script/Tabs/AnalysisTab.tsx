import React from 'react';
import { Activity, Zap, TrendingUp, Heart, AlertTriangle, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseScriptTable, getScriptAnalysis } from '../scriptUtils';

interface AnalysisTabProps {
  generatedScript: string | null;
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({ generatedScript }) => {
  const { avgTension, narrativeArc, emotionalBias, intensities } = React.useMemo(() => {
    const parsed = parseScriptTable(generatedScript);
    return getScriptAnalysis(parsed);
  }, [generatedScript]);

  const fallbackIntensities = intensities.length > 0 ? intensities : [40, 60, 75, 85, 95, 50];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-12 space-y-12"
    >
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          className="w-16 h-16 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(244,63,94,0.15)]"
        >
          <Activity className="w-8 h-8 text-rose-400" />
        </motion.div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Narrative Pulse</h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">AI-driven pacing and emotional resonance diagnostics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { label: 'Avg Tension', value: avgTension, icon: Zap, desc: 'Overall thematic urgency and pacing index.' },
          { label: 'Narrative Arc', value: narrativeArc, icon: TrendingUp, desc: 'Structural design paradigm for this script.' },
          { label: 'Emotional Bias', value: emotionalBias, icon: Heart, desc: 'Dominant emotional resonance vector.' }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="p-8 bg-gradient-to-b from-[#0e0e0e] to-[#040404] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-rose-500/30 hover:shadow-[0_0_40px_rgba(244,63,94,0.05)] transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/10 transition-all duration-500 group-hover:scale-110 group-hover:border-rose-500/20">
              <item.icon className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
              <p className="text-xl font-black text-white mt-2 uppercase tracking-tight">{item.value}</p>
              <p className="text-[11px] font-medium text-zinc-600 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Waveform Visualization — 2 Cols */}
        <div className="lg:col-span-2 p-10 bg-gradient-to-b from-[#0c0c0c] to-[#030303] border border-white/5 rounded-[3rem] backdrop-blur-xl relative overflow-hidden h-[360px] flex flex-col justify-between">
          <div className="relative z-10">
            <h4 className="text-xs font-black text-rose-400 uppercase tracking-[0.4em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Energy Waveform
            </h4>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Live tracking of script intensity per scene</p>
          </div>
          
          <div className="flex items-end gap-2.5 h-[180px] pb-4">
            {Array.from({ length: 30 }).map((_, i) => {
              const sceneIdx = Math.min(fallbackIntensities.length - 1, Math.floor((i / 30) * fallbackIntensities.length));
              const baseVal = fallbackIntensities[sceneIdx] || 50;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 20 }}
                  animate={{ 
                    height: [
                      Math.round(baseVal * 0.75 + (i % 3) * 4) + 12, 
                      Math.round(baseVal * 1.2 - (i % 2) * 6) + 12, 
                      Math.round(baseVal * 0.9 + (i % 4) * 2) + 12
                    ] 
                  }}
                  transition={{ 
                    duration: 2.2, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: i * 0.04
                  }}
                  className="flex-1 bg-gradient-to-t from-rose-500/50 via-rose-400/20 to-rose-400/5 rounded-full hover:from-rose-400 hover:scale-110 transition-all duration-300"
                  title={`Scene Pacing Energy: ${baseVal}%`}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-widest border-t border-white/5 pt-4">
            <span>Act I: Genesis</span>
            <span>Act II: Zenith Peak</span>
            <span>Act III: Resolve</span>
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#030303]/80" />
        </div>

        {/* Narrative Engine diagnostics */}
        <div className="p-10 bg-gradient-to-b from-[#0c0c0c] to-[#030303] border border-white/5 rounded-[3rem] backdrop-blur-xl flex flex-col justify-between h-[360px]">
          <div>
            <h4 className="text-xs font-black text-rose-400 uppercase tracking-[0.4em] flex items-center gap-2 mb-2">
              <Compass className="w-3.5 h-3.5" />
              Pulse Insights
            </h4>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Structural intelligence diagnostic feed</p>
          </div>

          <div className="space-y-4 my-auto">
            <div className="flex items-start gap-3.5 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <Zap className="w-4 h-4 text-rose-400 mt-0.5" />
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-wider">Dynamic Pacing Active</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mt-0.5 leading-relaxed">Pacing algorithm indicates a healthy action-to-exposition ratio with strong emotional hooks.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-wider">Tension Advisory</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mt-0.5 leading-relaxed">Tension peaks fast in the midsection. Ensure audio foley bus can support rapid-climax sequencing.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-black text-rose-400/80 uppercase tracking-[0.2em] border-t border-white/5 pt-4">
            <span>Diagnostics Feed</span>
            <span>Stable v2.1</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

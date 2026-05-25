import React from 'react';
import { ListMusic, Zap, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseScriptTable, getSceneIntensity } from '../scriptUtils';

interface BeatSheetTabProps {
  generatedScript: string | null;
}

export const BeatSheetTab: React.FC<BeatSheetTabProps> = ({ generatedScript }) => {
  const beats = React.useMemo(() => {
    const parsed = parseScriptTable(generatedScript);
    return parsed.map((scene) => {
      const intensity = getSceneIntensity(scene);
      return {
        label: `${scene.section} (${scene.soulFocus})`,
        time: scene.time || `${(scene.sceneNum - 1) * 2}:00–${scene.sceneNum * 2}:00`,
        type: scene.emotionalKey || 'Beat',
        intensity,
        videoPrompt: scene.videoPrompt,
        imagePrompt: scene.imagePrompt
      };
    });
  }, [generatedScript]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 space-y-12"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/5 pb-10 justify-between">
        <div className="flex items-center gap-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-[2rem] bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.15)]"
          >
            <ListMusic className="w-8 h-8 text-fuchsia-400" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Beat Sheet</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Emotional arc mapping and pacing diagnostics</p>
          </div>
        </div>

        {beats.length > 0 && (
          <div className="flex items-center gap-3 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-full px-5 py-2">
            <Activity className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">
              Pacing peaks detected: {beats.filter(b => b.intensity > 80).length} scenes
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {beats.length === 0 ? (
          <div className="p-10 bg-white/5 border border-white/5 rounded-3xl text-center">
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No beats parsed in script yet.</p>
          </div>
        ) : (
          beats.map((beat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex items-center gap-6 p-6 bg-gradient-to-r from-[#0d0d0d] to-[#040404] border border-white/5 rounded-[2rem] hover:border-fuchsia-500/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-full bg-fuchsia-500/[0.01] pointer-events-none group-hover:bg-fuchsia-500/[0.02] transition-colors" />
              <span className="text-xs font-black text-zinc-700 uppercase tracking-widest w-8 font-mono group-hover:text-fuchsia-400/80 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              
              <div className="flex-1 min-w-0 space-y-3 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest truncate">{beat.label}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider font-mono">{beat.time}</span>
                    <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest px-3 py-0.5 bg-fuchsia-500/10 rounded-full border border-fuchsia-500/10">
                      {beat.type}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${beat.intensity}%` }}
                    transition={{ duration: 1, delay: i * 0.05 + 0.1 }}
                    className="h-full bg-gradient-to-r from-fuchsia-500/60 to-fuchsia-400 rounded-full transition-all duration-700 opacity-80 group-hover:opacity-100"
                  />
                </div>

                {/* Visual Telemetry Mini Badging */}
                {(beat.videoPrompt || beat.imagePrompt) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {beat.videoPrompt && (
                      <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-400/5 border border-amber-400/10 rounded px-2 py-0.5 truncate max-w-[240px] select-all cursor-help" title={beat.videoPrompt}>
                        🎬 VIDEO: {beat.videoPrompt.slice(0, 40)}...
                      </span>
                    )}
                    {beat.imagePrompt && (
                      <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 rounded px-2 py-0.5 truncate max-w-[240px] select-all cursor-help" title={beat.imagePrompt}>
                        🖼️ IMAGE: {beat.imagePrompt.slice(0, 40)}...
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pl-4">
                <Zap className="w-4 h-4 text-fuchsia-500/60 group-hover:scale-125 transition-transform" />
                <span className="text-xs font-black text-fuchsia-400 font-mono">{beat.intensity}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

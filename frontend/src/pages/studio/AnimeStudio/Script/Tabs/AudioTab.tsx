import React from 'react';
import { Volume2, Music, Mic2, Radio, Sliders, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseScriptTable, getDialogueMatrix } from '../scriptUtils';

interface AudioTabProps {
  generatedScript: string | null;
}

export const AudioTab: React.FC<AudioTabProps> = ({ generatedScript }) => {
  const { bgmTrack, vocals, audioCues } = React.useMemo(() => {
    const parsed = parseScriptTable(generatedScript);
    const matrix = getDialogueMatrix(parsed);
    
    // Extract dynamic BGM track name from the first scene's Audio Forge column
    let track = 'Synth-Wave #04';
    if (parsed.length > 0 && parsed[0].audioForge) {
      const cleaned = parsed[0].audioForge
        .replace(/^[-\s|*]+/, '')
        .split(',')[0]
        .replace(/BGM:?/i, '')
        .trim();
      if (cleaned.length > 3) {
        track = cleaned;
      }
    }
    
    // Create dynamic vocals matching the cast dialogue matrix
    const mappedVocals = matrix.map((c) => {
      let pitch = 'Clear, Resonant';
      const tone = c.tone.toLowerCase();
      if (tone.includes('menacing') || tone.includes('threat') || tone.includes('cold') || tone.includes('cynical')) {
        pitch = 'Low-Pitch, Dramatic';
      } else if (tone.includes('terrified') || tone.includes('urgency') || tone.includes('alert')) {
        pitch = 'High-Pitch, Vibrant';
      } else if (tone.includes('wise') || tone.includes('calm') || tone.includes('supportive')) {
        pitch = 'Warm, Resonant';
      }
      
      // Dynamic levels based on their share of speaking lines in the script
      const linesShare = Math.min(95, 45 + Math.round((c.lines / Math.max(1, parsed.length)) * 100));
      
      return {
        name: c.name,
        profile: pitch,
        levels: linesShare
      };
    });
    
    if (mappedVocals.length === 0) {
      mappedVocals.push({ name: 'Narrator', profile: 'Dramatic Omniscient', levels: 75 });
    }

    const mappedCues = parsed.map(scene => ({
      sceneNum: scene.sceneNum,
      section: scene.section,
      sound: scene.audioForge,
      videoPrompt: scene.videoPrompt || scene.visualDirection
    }));
    
    return {
      bgmTrack: track,
      vocals: mappedVocals,
      audioCues: mappedCues
    };
  }, [generatedScript]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 space-y-12"
    >
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-16 h-16 rounded-[2rem] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.15)]"
        >
          <Volume2 className="w-8 h-8 text-cyan-400" />
        </motion.div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Sonic Landscape</h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Audio architecture and foley synchronization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { label: 'BGM Track', value: bgmTrack, icon: Music, desc: 'Primary atmospheric backing score.' },
          { label: 'Sample Rate', value: '96kHz / 24-bit', icon: Radio, desc: 'High-Fidelity Master output quality.' },
          { label: 'Master Bus', value: 'Cinematic Wide', icon: Volume2, desc: 'Dolby Atmos Spatial Master output.' }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="p-8 bg-gradient-to-b from-[#0e0e0e] to-[#040404] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(6,182,212,0.05)] transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/10 transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-500/20">
              <item.icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
              <p className="text-xl font-black text-white mt-2 uppercase tracking-tight leading-tight">{item.value}</p>
              <p className="text-[11px] font-medium text-zinc-600 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Vocal Profiles List */}
        <div className="p-10 bg-gradient-to-b from-[#0c0c0c] to-[#030303] border border-white/5 rounded-[3rem] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Mic2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-zinc-300 uppercase tracking-[0.3em]">Vocal Profiles</h4>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Synthesized frequency levels and pitches</p>
            </div>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {vocals.map((vocal, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-white uppercase tracking-wider">{vocal.name}</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{vocal.profile}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${vocal.levels}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.15 }}
                    className="h-full bg-gradient-to-r from-cyan-500/50 to-cyan-400 rounded-full" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Acoustic Cue Mix Dashboard */}
        <div className="p-10 bg-gradient-to-b from-[#0c0c0c] to-[#030303] border border-white/5 rounded-[3rem] backdrop-blur-xl flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-6 self-start">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-black text-zinc-300 uppercase tracking-[0.3em]">Acoustic Cue Mix</h4>
          </div>

          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar flex-1 w-full text-left">
            {audioCues.length === 0 ? (
              <p className="text-xs text-zinc-600 uppercase font-black tracking-widest text-center py-12">No audio tracks mapped.</p>
            ) : (
              audioCues.map((cue, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 hover:border-cyan-500/20 transition-all duration-300 group/cue">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-zinc-600 group-hover/cue:text-cyan-400 transition-colors">SCN_{String(cue.sceneNum).padStart(2, '0')} ({cue.section})</span>
                    <span className="text-[8px] font-black text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/10 uppercase tracking-widest">Active Stem</span>
                  </div>
                  <p className="text-xs text-white font-medium pl-2.5 border-l border-cyan-500/25 leading-relaxed">{cue.sound}</p>
                  {cue.videoPrompt && (
                    <p className="text-[9px] text-zinc-500 font-bold truncate cursor-help" title={cue.videoPrompt}>
                      🎬 Visual Context: {cue.videoPrompt.slice(0, 55)}...
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest border-t border-white/5 pt-6 w-full mt-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Foley stems perfectly aligned with Video prompts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

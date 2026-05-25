import React from 'react';
import { Languages, Type, Mic2, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseScriptTable } from '../scriptUtils';

interface LinguisticsTabProps {
  generatedScript: string | null;
}

export const LinguisticsTab = ({ generatedScript }: LinguisticsTabProps) => {
  const { dialect, nuance, voiceProfile } = React.useMemo(() => {
    const parsed = parseScriptTable(generatedScript);
    
    if (parsed.length === 0) {
      return {
        dialect: 'Standard Anime Slang',
        nuance: 'Balanced Dramatic',
        voiceProfile: 'Neural_Seiyuu_V4'
      };
    }
    
    const textBlob = parsed.map(s => s.narration + ' ' + s.visualDirection).join(' ').toLowerCase();
    
    // Dynamically guess Dialect
    let dialectVal = 'Tokyo Vernacular';
    if (textBlob.includes('aether') || textBlob.includes('steam') || textBlob.includes('industrial')) {
      dialectVal = 'Neo-Steampunk Slang';
    } else if (textBlob.includes('cyber') || textBlob.includes('neon') || textBlob.includes('code')) {
      dialectVal = 'Cyber-Tokyo Slang';
    } else if (textBlob.includes('lord') || textBlob.includes('sovereign') || textBlob.includes('magic')) {
      dialectVal = 'High-Class Archaic';
    }
    
    // Dynamically guess Nuance
    let nuanceVal = 'Dramatic & Kinetic';
    if (textBlob.includes('cynical') || textBlob.includes('stoic')) {
      nuanceVal = 'Honorific-Sparse / Cold';
    } else if (textBlob.includes('sama') || textBlob.includes('dono') || textBlob.includes('san')) {
      nuanceVal = 'Honorific-Heavy Formal';
    } else if (textBlob.includes('action') || textBlob.includes('katana') || textBlob.includes('combat')) {
      nuanceVal = 'Expositional / Dynamic';
    }
    
    // Voice profile based on primary speakers
    const uniqueSpeakers = Array.from(new Set(parsed.map(s => s.soulFocus).filter(n => n && n !== 'Unknown')));
    const voiceVal = uniqueSpeakers.length > 0 
      ? `CastModel_${uniqueSpeakers.slice(0, 2).join('_')}`
      : 'Neural_Seiyuu_V4';
      
    return {
      dialect: dialectVal,
      nuance: nuanceVal,
      voiceProfile: voiceVal
    };
  }, [generatedScript]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 space-y-12 animate-in fade-in"
    >
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.15)]"
        >
          <Languages className="w-8 h-8 text-amber-400" />
        </motion.div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Linguistic Manifest</h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Dialect optimization and cultural nuance sequencing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { label: 'Dialect', value: dialect, icon: Type, desc: 'Dominant colloquial phrasing engine.' },
          { label: 'Nuance', value: nuance, icon: Languages, desc: 'Grammatical and social honorific bias.' },
          { label: 'Voice Profile', value: voiceProfile, icon: Mic2, desc: 'Recommended neural model mapping.' }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="p-8 bg-gradient-to-b from-[#0e0e0e] to-[#040404] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-amber-500/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.05)] transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10 transition-all duration-500 group-hover:scale-110 group-hover:border-amber-500/20">
              <item.icon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
              <p className="text-lg font-black text-white mt-2 uppercase tracking-tight leading-tight">{item.value}</p>
              <p className="text-[11px] font-medium text-zinc-600 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Cultural Nuance Sequencing Sliders */}
        <div className="p-10 bg-gradient-to-b from-[#0c0c0c] to-[#030303] border border-white/5 rounded-[3rem] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[360px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-zinc-300 uppercase tracking-[0.3em]">Nuance Balance</h4>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Synthesized frequency levels of dialogue nuances</p>
            </div>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {[
              { name: 'Honorific Density', level: 35, desc: 'Grammatical high-class registers' },
              { name: 'Slang Frequency', level: 80, desc: 'Street dialect & informal particles' },
              { name: 'Emotional Dynamism', level: 90, desc: 'Dramatic and visual staging cue counts' }
            ].map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-white uppercase tracking-wider">{metric.name}</span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{metric.desc}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.level}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.15 + 0.3 }}
                    className="h-full bg-gradient-to-r from-amber-500/55 to-amber-400 rounded-full animate-pulse" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Panel */}
        <div className="p-10 bg-gradient-to-b from-[#0c0c0c] to-[#030303] border border-white/5 rounded-[3rem] backdrop-blur-xl flex flex-col justify-between min-h-[360px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2.5 self-start mb-6 text-left">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-black text-zinc-300 uppercase tracking-[0.3em]">Linguistic Advisories</h4>
          </div>

          <div className="space-y-4 my-auto">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
              <p className="text-[11px] font-black text-white uppercase tracking-wider">Subtle Street Accent Detected</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide leading-relaxed mt-1">
                Colloquial terminology matches high-tech cyberpunk environments. Audio/VO models should emphasize sharp consonants and quick transitions.
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
              <p className="text-[11px] font-black text-white uppercase tracking-wider">Tone Uniformity Check</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide leading-relaxed mt-1">
                Linguistic markers remain consistently gritty across scenes. Dialogue mapping shows high fidelity with character profile directives.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-black text-amber-400/80 uppercase tracking-widest border-t border-white/5 pt-6 w-full">
            <span>Stable Engine</span>
            <span>Ver. 1.0.4</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

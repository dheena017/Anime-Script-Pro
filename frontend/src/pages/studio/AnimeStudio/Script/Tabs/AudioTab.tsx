import React from 'react';
import { Volume2, Music, Mic2, Radio } from 'lucide-react';
import { useScriptCommandCenter } from '../context/ScriptCommandCenter';

export const AudioTab: React.FC = () => {
  const { technicalData } = useScriptCommandCenter();
  const { vocalProfiles, bgmTrack } = technicalData.audio;

  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-4">
         <div className="w-16 h-16 rounded-[2rem] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <Volume2 className="w-8 h-8 text-cyan-400" />
         </div>
         <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Sonic Landscape</h2>
         <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Audio architecture and foley synchronization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
         {[
           { label: 'BGM Track', value: bgmTrack, icon: Music },
           { label: 'Sample Rate', value: '96kHz / 24-bit', icon: Radio },
           { label: 'Master Bus', value: 'Cinematic Wide', icon: Volume2 }
         ].map((item, i) => (
           <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4 hover:border-cyan-500/20 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                 <item.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                 <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
                 <p className="text-lg font-black text-white mt-1 uppercase tracking-tight">{item.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-10 bg-[#080808]/60 border border-white/5 rounded-[3rem] backdrop-blur-xl">
           <div className="flex items-center gap-3 mb-8">
              <Mic2 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Vocal Profiles</h4>
           </div>
           <div className="space-y-6">
              {vocalProfiles.map((vocal, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-white uppercase tracking-wider">{vocal.name}</span>
                      <span className="text-[9px] text-zinc-600 font-mono">Dynamic Analysis Active</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500/40 rounded-full" style={{ width: `${vocal.levels}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="p-10 bg-[#080808]/60 border border-white/5 rounded-[3rem] backdrop-blur-xl flex flex-col justify-center items-center text-center space-y-4">
           <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                 <Volume2 className="w-6 h-6 text-cyan-400" />
              </div>
           </div>
           <div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Monitor Active</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Spatial Audio Virtualizer v1.0</p>
           </div>
        </div>
      </div>
    </div>
  );
};

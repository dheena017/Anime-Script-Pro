import React from 'react';
import { Camera, Video, Monitor, Layers } from 'lucide-react';

export const CinematicsTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-4">
         <div className="w-16 h-16 rounded-[2rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <Camera className="w-8 h-8 text-purple-400" />
         </div>
         <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Cinematic Core</h2>
         <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Camera sequencing and visual direction protocols</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
         {[
           { label: 'Primary Lens', value: '35mm Anamorphic', icon: Video },
           { label: 'Aspect Ratio', value: '2.39:1 Cinemascope', icon: Monitor },
           { label: 'Visual Depth', value: 'High-Contrast Noir', icon: Layers }
         ].map((item, i) => (
           <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4 hover:border-purple-500/20 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                 <item.icon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                 <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
                 <p className="text-lg font-black text-white mt-1 uppercase tracking-tight">{item.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="p-10 bg-[#080808]/60 border border-white/5 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
        <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.4em] mb-6">Active Shot List</h4>
        <div className="space-y-4">
          {[
            { id: 'SCN_01', type: 'EXT. CITY - WIDE', action: 'Drone sweep across the neon skyline.' },
            { id: 'SCN_02', type: 'INT. LAB - CLOSE', action: 'Focus on characters eyes reflecting the data stream.' },
          ].map((shot, i) => (
            <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors group/shot">
              <span className="text-xs font-mono text-zinc-600 group-hover/shot:text-purple-400 transition-colors">{shot.id}</span>
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs font-black text-zinc-400 uppercase">{shot.type}</span>
              <p className="text-xs text-zinc-500 italic max-w-sm text-right">{shot.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

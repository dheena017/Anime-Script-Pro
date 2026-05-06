import React from 'react';
import { Languages, Type, Mic2 } from 'lucide-react';

export const LinguisticsTab: React.FC = () => {
  return (
    <div className="py-12 space-y-12">
      <div className="text-center space-y-4">
         <div className="w-16 h-16 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <Languages className="w-8 h-8 text-amber-400" />
         </div>
         <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Linguistic Manifest</h2>
         <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Dialect optimization and cultural nuance sequencing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
         {[
           { label: 'Dialect', value: 'Neo-Tokyo Slang', icon: Type },
           { label: 'Nuance', value: 'Honorific-Heavy', icon: Languages },
           { label: 'Voice Profile', value: 'Neural_Seiyuu_V4', icon: Mic2 }
         ].map((item, i) => (
           <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4 hover:border-amber-500/20 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                 <item.icon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                 <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</h3>
                 <p className="text-lg font-black text-white mt-1 uppercase tracking-tight">{item.value}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};




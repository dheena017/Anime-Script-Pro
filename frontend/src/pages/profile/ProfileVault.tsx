import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Heart, Search } from 'lucide-react';

interface ProfileVaultProps {
   generations: any[];
   favorites: any[];
}

export const ProfileVault: React.FC<ProfileVaultProps> = ({ generations, favorites }) => {
   const [vaultFilter, setVaultFilter] = useState<'all' | 'favs'>('all');
   const displayedGenerations = vaultFilter === 'all' ? generations : favorites;

   return (
      <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 md:space-y-12 pt-4 md:pt-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-8 gap-6">
            <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar">
               <button onClick={() => setVaultFilter('all')} className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 whitespace-nowrap ${vaultFilter === 'all' ? 'text-[#bd4a4a]' : 'text-zinc-600 hover:text-zinc-400'}`}>
                  <LayoutGrid className="w-3.5 h-3.5" /> All Records <span className="opacity-40">{generations.length}</span>
               </button>
               <button onClick={() => setVaultFilter('favs')} className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 whitespace-nowrap ${vaultFilter === 'favs' ? 'text-[#bd4a4a]' : 'text-zinc-600 hover:text-zinc-400'}`}>
                  <Heart className="w-3.5 h-3.5" /> Bookmarks <span className="opacity-40">{favorites.length}</span>
               </button>
            </div>
            <div className="flex items-center gap-4 bg-zinc-900/40 border border-white/5 px-6 py-3 rounded-2xl w-full md:w-96">
               <Search className="w-4 h-4 text-zinc-600" />
               <input className="bg-transparent border-none text-[9px] md:text-[10px] font-bold text-zinc-400 focus:outline-none w-full uppercase tracking-widest" placeholder="Search the vault..." />
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {displayedGenerations.map((g, i) => (
               <motion.div 
                  key={g.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative aspect-[3/4] bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#bd4a4a]/40 transition-all shadow-2xl"
               >
                  <img src={g.url} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={g.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end gap-3">
                     <p className="text-[9px] font-medium text-white/60 leading-relaxed line-clamp-3">"{g.prompt}"</p>
                     <div className="flex gap-2">
                        <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md py-2 rounded-xl text-[8px] font-black uppercase tracking-widest text-white transition-all">Download</button>
                        <button className="w-10 h-10 flex items-center justify-center bg-[#bd4a4a] rounded-xl text-white shadow-xl"><Heart className="w-3.5 h-3.5 fill-white" /></button>
                     </div>
                  </div>
               </motion.div>
            ))}
            {displayedGenerations.length === 0 && <div className="col-span-full py-40 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">Vault Silence</div>}
         </div>
      </motion.div>
   );
};




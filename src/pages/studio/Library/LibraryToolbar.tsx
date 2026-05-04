import React from 'react';
import { Search, Filter, Grid, List, Plus, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export const LibraryToolbar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-4 bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] mb-12">
      <div className="flex items-center gap-4 flex-1 min-w-[300px]">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#bd4a4a] transition-colors" />
          <input 
            type="text" 
            placeholder="Search within vault..." 
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#bd4a4a]/50 focus:ring-4 focus:ring-[#bd4a4a]/5 transition-all"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="px-2 py-1 bg-zinc-800 rounded text-[9px] font-black text-zinc-500 uppercase">⌘ K</span>
          </div>
        </div>
        
        <Button variant="outline" className="h-[52px] bg-zinc-900/50 border-white/5 rounded-2xl px-6 hover:bg-zinc-800 hover:border-white/10 transition-all group">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400 mr-3 group-hover:text-[#bd4a4a] transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Advanced Filters</span>
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Sort:</span>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/5 hover:border-white/10 transition-all">
            Recently Modified <ChevronDown className="w-3 h-3 text-[#bd4a4a]" />
          </button>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center bg-zinc-900/80 border border-white/5 rounded-2xl p-1.5">
          <button className="p-2.5 rounded-xl bg-[#bd4a4a] text-white shadow-[0_0_15px_rgba(189,74,74,0.3)]">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl text-zinc-500 hover:text-white transition-all">
            <List className="w-4 h-4" />
          </button>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="h-[52px] bg-[#bd4a4a] hover:bg-[#d45555] rounded-2xl px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(189,74,74,0.5)] border border-[#bd4a4a]/20 group">
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
            Initialize New Asset
          </Button>
        </motion.div>
      </div>
    </div>
  );
};





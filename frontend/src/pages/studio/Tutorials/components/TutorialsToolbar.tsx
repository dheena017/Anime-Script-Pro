import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, BookMarked } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TutorialsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TutorialsToolbar: React.FC<TutorialsToolbarProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-4 bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-[2rem]">
      <div className="flex items-center gap-4 flex-1 min-w-[300px]">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#bd4a4a] transition-colors" />
          <input 
            type="text" 
            placeholder="Search academy archives..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[11px] font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#bd4a4a]/50 focus:ring-4 focus:ring-[#bd4a4a]/5 transition-all"
          />
        </div>
        
        <Button variant="outline" className="h-[52px] bg-zinc-900/50 border-white/5 rounded-2xl px-6 hover:bg-zinc-800 transition-all group">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400 mr-3 group-hover:text-[#bd4a4a]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Curriculum Filter</span>
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Difficulty:</span>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/5 hover:border-white/10 transition-all">
            All Levels <ChevronDown className="w-3 h-3 text-[#bd4a4a]" />
          </button>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <Button variant="ghost" className="h-[52px] rounded-2xl px-6 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all group">
          <BookMarked className="w-4 h-4 mr-3 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Saved Guides</span>
        </Button>
      </div>
    </div>
  );
};

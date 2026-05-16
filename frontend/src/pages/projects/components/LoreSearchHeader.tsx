import { Search, Database, Globe, Activity, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoreSearchHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onInitialize?: () => void;
}

export function LoreSearchHeader({ searchTerm, onSearchChange, onInitialize }: LoreSearchHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="px-4 py-1.5 bg-studio/5 rounded-full border border-studio/20 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-studio" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-studio">Lore Database</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
          Universal <span className="text-studio">Archive.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
          Global repository of synchronized world lore, character DNA, and architectural magic systems. Connect your production nodes.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-12 pt-6 border-t border-white/5 w-full max-w-4xl">
         <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-zinc-700" />
            <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Total Fragments: 1.2M+</span>
         </div>
         <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-studio animate-pulse" />
            <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Active Architects: 8,420</span>
         </div>
         <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Sync Health: 99.9%</span>
         </div>
      </div>

      <div className="w-full max-w-3xl mx-auto relative group pt-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-studio/30 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700" />
        <div className="relative flex items-center bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] p-3 pl-8 focus-within:border-studio/50 transition-all duration-500 shadow-3xl">
           <Search className="w-6 h-6 text-zinc-600" />
           <Input 
             value={searchTerm}
             onChange={(e) => onSearchChange(e.target.value)}
             className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-800 text-xl py-8 font-black uppercase tracking-widest" 
             placeholder="SEARCH LORE FRAGMENTS..." 
           />
           <Button 
             onClick={onInitialize}
             className="bg-studio text-black font-black uppercase tracking-widest rounded-[1.5rem] px-10 h-16 hover:bg-white transition-all shadow-2xl"
           >
              INITIALIZE
           </Button>
        </div>
      </div>
    </div>
  );
}

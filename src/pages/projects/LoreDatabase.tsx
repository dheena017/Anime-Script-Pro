import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Search, 
  Globe, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@base-ui/react';

const CATEGORIES = ['All Fragments', 'World Setting', 'Faction', 'Magic System', 'Lore Arc', 'Location', 'Bestiary'];

const LORE_DATA = [
  { id: 'NODE-L1', title: 'Cyber-Neo Tokyo', type: 'World Setting', desc: 'A sprawling metropolis powered by soul-engines and neon magic. The epicenter of the 2099 awakening.', items: 1204, efficiency: '98.4%' },
  { id: 'NODE-L2', title: 'The Void Walkers', type: 'Faction', desc: 'An ancient order capable of stepping between dimensions. Master architects of the spatial rifts.', items: 85, efficiency: '99.1%' },
  { id: 'NODE-L3', title: 'Aetherial Resonance', type: 'Magic System', desc: 'Using musical frequencies to manipulate elemental forces through rhythmic incantations.', items: 312, efficiency: '97.8%' },
  { id: 'NODE-L4', title: 'Project: OVERMIND', type: 'Lore Arc', desc: 'The timeline of events leading to the great AI awakening. A chronological breakdown of human obsolescence.', items: 56, efficiency: '99.9%' },
  { id: 'NODE-L5', title: 'Starfall Academy', type: 'Location', desc: 'A floating school for gifted youths touched by meteor shards. Primary training hub for creators.', items: 420, efficiency: '96.5%' },
  { id: 'NODE-L6', title: 'Mecha-Beasts', type: 'Bestiary', desc: 'Catalog of biomechanical creatures roaming the wasteland. Detailed biological and mechanical schematics.', items: 890, efficiency: '95.2%' },
];

export function LoreDatabasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Fragments');

  const filteredData = LORE_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Fragments' || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-32 px-6 relative overflow-hidden selection:bg-studio/30">
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* 1. REPOSITORY HEADER */}
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="px-4 py-1.5 bg-studio/5 rounded-full border border-studio/20 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-studio" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-studio">Lore Database</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
              Universal <span className="text-studio">Archive.</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
              Global repository of synchronized world lore, character DNA, and architectural magic systems. Connect your production nodes.
            </p>
          </div>

          {/* TELEMETRY MONITOR */}
          <div className="flex flex-wrap items-center justify-center gap-12 pt-6 border-t border-white/5 w-full max-w-4xl">
             <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-zinc-700" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Fragments: 1.2M+</span>
             </div>
             <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-studio animate-pulse" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Architects: 8,420</span>
             </div>
             <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sync Health: 99.9%</span>
             </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER MATRIX */}
        <div className="space-y-10">
           <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-studio/30 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700" />
              <div className="relative flex items-center bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] p-3 pl-8 focus-within:border-studio/50 transition-all duration-500 shadow-3xl">
                 <Search className="w-6 h-6 text-zinc-600" />
                 <Input 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-800 text-xl py-8 font-black uppercase tracking-widest" 
                   placeholder="SEARCH LORE FRAGMENTS..." 
                 />
                 <Button className="bg-studio text-black font-black uppercase tracking-widest rounded-[1.5rem] px-10 h-16 hover:bg-white transition-all shadow-2xl">
                    INITIALIZE
                 </Button>
              </div>
           </div>

           <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-3 mr-4 text-zinc-700">
                 <Filter className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Filter Matrix</span>
              </div>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500",
                    selectedCategory === cat ? "bg-studio text-black border-studio shadow-[0_10px_30px_rgba(6,182,212,0.3)]" : "bg-white/[0.02] border-white/5 text-zinc-600 hover:text-white hover:border-white/20"
                  )}
                >
                   {cat}
                </button>
              ))}
           </div>
        </div>

        {/* 3. LORE NODE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredData.length > 0 ? (
              filteredData.map((node, i) => (
                <motion.div
                  layout
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-10 rounded-[3rem] bg-[#0a0a0b] border border-white/5 hover:border-studio/30 transition-all group cursor-pointer relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                     <Layers className="w-32 h-32 text-studio" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-studio uppercase tracking-[0.3em]">{node.type}</span>
                       <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{node.id}</span>
                       </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:bg-studio/10 group-hover:text-studio transition-colors">
                       {node.items} Entries
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-studio transition-colors">{node.title}</h3>
                     <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-3">
                        {node.desc}
                     </p>
                  </div>

                  {/* Node Telemetry */}
                  <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Density Index</span>
                        <div className="text-[10px] font-black text-white italic tracking-widest">{node.efficiency}</div>
                     </div>
                     <div className="flex items-center gap-2 text-[9px] font-black text-studio uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-700">
                        LINK FRAGMENT <ArrowRight className="w-4 h-4" />
                     </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-40 text-center space-y-6 bg-[#0a0a0b] rounded-[4rem] border border-dashed border-white/5">
                 <Sparkles className="w-16 h-16 text-zinc-900 mx-auto animate-pulse" />
                 <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">No lore fragments manifest for this directive.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. REPOSITORY FOOTER */}
        <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 <span>Verified Repository Node: #LR-8842-X</span>
              </div>
              <div className="w-px h-4 bg-white/5 hidden md:block" />
              <span>Sovereign Storage Protocol Active</span>
           </div>
           <div className="flex items-center gap-8 text-zinc-500">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-studio rounded-full" />
                 <span>Studio Tokyo Hub</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full" />
                 <span>Studio LA Hub</span>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
}

export default LoreDatabasePage;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoreSearchHeader } from './components/LoreSearchHeader';
import { LoreCard } from './components/LoreCard';

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

        <LoreSearchHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* 2. SEARCH & FILTER MATRIX */}
        <div className="space-y-10">
           <div className="flex flex-wrap items-center justify-center gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                    selectedCategory === cat
                      ? "bg-studio border-studio text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      : "bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:border-white/20"
                  )}
                >
                  {cat}
                </button>
              ))}
              <div className="w-[1px] h-4 bg-white/10 mx-2" />
              <button className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-studio transition-colors group">
                 <Filter className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                 Advanced Filters
              </button>
           </div>
        </div>

        {/* 3. ARTIFACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode="popLayout">
              {filteredData.map((item) => (
                <LoreCard key={item.id} {...item} />
              ))}
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
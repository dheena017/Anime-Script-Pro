import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Search, 
  Filter, 
  Flame,
  LayoutGrid,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader, PageShell, SectionHeading } from '@/components/page/PageShell';
import { categories, featuredScripts } from '@/data/pages/discoverData';

// New Components
import { DiscoverHero } from '@/components/discover/DiscoverHero';
import { DiscoverCard } from '@/components/discover/DiscoverCard';

export function DiscoverPage() {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <PageShell className="space-y-16 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <PageHeader
          title="DISCOVER"
          subtitle="Explore the next generation of AI-driven anime productions."
          icon={<Compass className="w-10 h-10 text-red-600" />}
          titleClassName="text-5xl font-black tracking-tighter italic"
          className="p-0 border-none bg-transparent"
        />
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
          <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white">Trending</Button>
          <Button variant="secondary" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-zinc-800 text-white">Latest</Button>
          <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white">Awards</Button>
        </div>
      </div>

      <DiscoverHero />

      {/* Discovery Filters Bar */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl backdrop-blur-md sticky top-4 z-40 shadow-2xl">
        <div className="relative w-full xl:w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
          <Input 
            placeholder="Search scripts, genres, or creators..." 
            className="pl-12 h-12 bg-zinc-950/50 border-zinc-800 focus:border-red-500/50 text-sm font-medium rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                activeCategory === cat 
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' 
                  : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-[1px] bg-zinc-800 mx-2 hidden xl:block" />
          <Button variant="outline" className="border-zinc-800 bg-zinc-950/50 h-12 px-6 rounded-2xl uppercase font-black text-[10px] tracking-widest hover:bg-zinc-900 transition-all">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center justify-between">
           <SectionHeading
            title="TOP PERFORMERS"
            icon={<TrendingUp className="w-6 h-6 text-red-500" />}
            titleClassName="text-2xl font-black tracking-tighter italic"
            className="p-0 border-none m-0"
          />
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <span className="text-white">Grid</span>
            <LayoutGrid className="w-4 h-4" />
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredScripts.concat(featuredScripts).map((script, idx) => (
              <motion.div
                key={`${script.id}-${idx}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <DiscoverCard script={script} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Community Spotlight Section */}
      <div className="pt-20 border-t border-zinc-900 flex flex-col items-center text-center">
        <Award className="w-12 h-12 text-zinc-800 mb-6" />
        <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">JOIN THE PRODUCTION BLOCK</h3>
        <p className="text-zinc-500 max-w-lg mb-10 font-medium italic">
          Become a verified creator and showcase your scripts to thousands of anime production houses around the world.
        </p>
        <Button className="bg-white text-black hover:bg-zinc-200 h-14 px-10 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-white/5">
          Submit Your Masterpiece
        </Button>
      </div>
    </PageShell>
  );
}


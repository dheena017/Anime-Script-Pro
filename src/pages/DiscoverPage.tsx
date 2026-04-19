import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Search, 
  Filter, 
  Play, 
  Star, 
  Clock,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categories = ["All", "Shonen", "Isekai", "Cyberpunk", "Horror", "Romance", "Mecha"];

const featuredScripts = [
  { 
    id: 1, 
    title: "Neon Soul: Protocol Zero", 
    author: "CyberGhost", 
    rating: 4.9, 
    views: "12k", 
    duration: "4:30",
    tags: ["Cyberpunk", "Action"],
    image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 2, 
    title: "The Librarian of Lost Spells", 
    author: "MageWriter", 
    rating: 4.7, 
    views: "8.5k", 
    duration: "5:15",
    tags: ["Fantasy", "Mystery"],
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 3, 
    title: "High School Exorcist Club", 
    author: "SpiritHunter", 
    rating: 4.8, 
    views: "15k", 
    duration: "3:45",
    tags: ["Horror", "Comedy"],
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop"
  }
];

export function DiscoverPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4 text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Compass className="w-12 h-12 text-cyan-500" />
            Discover
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs pl-1">
            Explore the latest high-engagement recaps from the community.
          </p>
        </div>
        <div className="p-1 bg-[#0a0a0a] rounded-full border border-zinc-800 flex gap-2 shadow-2xl">
          {categories.map((cat) => (
             <button 
               key={cat} 
               className={cn(
                 "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                 cat === "All" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-zinc-500 hover:text-white"
               )}
             >
               {cat}
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-700 group-hover:text-cyan-400 transition-colors" />
          <Input 
            placeholder="Search the neural network for scripts, authors, or genres..." 
            className="pl-14 h-14 bg-[#050505] border-zinc-800 focus:border-cyan-500/50 text-[13px] rounded-2xl shadow-inner font-bold uppercase tracking-wider"
          />
        </div>
        <Button className="md:col-span-3 h-14 bg-[#0a0a0a] border border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-500/30 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all">
          <Filter className="w-4 h-4 mr-3" /> Filter Matrix
        </Button>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
            Featured Protocols
          </h2>
          <Button variant="ghost" className="text-cyan-500 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400">
            Expand Library <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredScripts.map((script) => (
            <motion.div
              key={script.id}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="bg-[#050505]/50 border-zinc-900 overflow-hidden cursor-pointer hover:border-cyan-500/40 transition-all shadow-2xl relative">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                <div className="aspect-video bg-zinc-950 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                  <img 
                    src={script.image} 
                    alt={script.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                      <Play className="w-8 h-8 fill-black text-black ml-1.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-cyan-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {script.duration}
                  </div>
                </div>
                <div className="p-6 space-y-4 relative z-10">
                  <div className="flex gap-2">
                    {script.tags.map(tag => (
                      <span key={tag} className="text-[8px] font-black uppercase tracking-[0.2em] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-lg font-black uppercase tracking-tighter text-white group-hover:text-cyan-400 transition-colors">{script.title}</CardTitle>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Node: {script.author}</span>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400">
                      <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {script.rating}
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-600">
                        <Clock className="w-3.5 h-3.5" />
                        {script.views}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Play, Star, Plus, Info, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

export function DiscoverHero() {
  return (
    <div className="relative h-[500px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 group">
      {/* Background with Glows */}
      <img 
        src="https://picsum.photos/seed/anime-hero/1200/600" 
        className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-1000"
        alt="Hero Background"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />

      {/* Hero Content */}
      <div className="absolute inset-0 p-12 flex flex-col justify-end gap-6 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Badge className="bg-red-600 text-white border-none text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5">
            FEATURED PRODUCTION
          </Badge>
          <div className="flex items-center gap-1.5 text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">9.8 Rating</span>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
          <h1 className="text-6xl font-black tracking-tighter text-white mb-4 uppercase leading-none">
            Cyberpunk <br />
            <span className="text-red-600">REVELATIONS</span>
          </h1>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed italic max-w-md">
            "In a world where memories are currency, one scriptwriter discovers a truth that could crash the entire network. A cinematic masterpiece generated with Gemini 3.5."
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mt-4"
        >
          <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl shadow-2xl shadow-white/10">
            <Play className="w-4 h-4 mr-2 fill-current" />
            Preview Script
          </Button>
          <Button variant="outline" size="lg" className="border-zinc-800 bg-zinc-950/50 backdrop-blur-md text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-xs h-12 px-6 rounded-xl group/btn">
            <Plus className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform" />
            Add to Library
          </Button>
          <div className="flex -space-x-3 ml-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden shadow-xl">
                <img src={`https://avatar.vercel.sh/user-${i}`} alt="User" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 shadow-xl">
              +54
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Meta */}
      <div className="absolute top-8 right-8 p-6 bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
            <Zap className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Generation Engine</p>
            <p className="text-xs font-bold text-white uppercase">Vision AI Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  Compass, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Heart,
  Share2,
  Play,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const trendingScripts = [
  { id: 1, title: 'The Last Samurai of Neo-Tokyo', author: 'AnimeMaster', likes: 1200, comments: 45, genre: 'Cyberpunk', image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=800' },
  { id: 2, title: 'Reincarnated as a Vending Machine', author: 'IsekaiKing', likes: 850, comments: 120, genre: 'Comedy', image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=800' },
  { id: 3, title: 'Shadow Realm Chronicles', author: 'DarkWriter', likes: 2100, comments: 89, genre: 'Dark Fantasy', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800' },
];

export function CommunityPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-zinc-900 pb-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4 text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Users className="w-12 h-12 text-cyan-500" />
            Social Hub
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs pl-1">Sync with the global collective of script architects.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase tracking-widest text-xs h-12 px-8 rounded-2xl shadow-[0_8px_20px_rgba(6,182,212,0.3)] transition-all active:scale-95">
            <Share2 className="w-4 h-4 mr-3" />
            Broadcast Script
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
              <TrendingUp className="w-6 h-6 text-orange-500 animate-pulse" />
              Neural Trending
            </h2>
            <Button variant="ghost" className="text-cyan-500 text-[10px] font-black uppercase tracking-widest hover:text-cyan-400">
              Expore More <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendingScripts.map((script, idx) => (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-[#050505]/50 border border-zinc-900 overflow-hidden group cursor-pointer hover:border-cyan-500/40 transition-all shadow-2xl relative">
                   <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  <div className="aspect-video bg-zinc-950 relative overflow-hidden">
                    <img 
                      src={script.image} 
                      alt={script.title}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all">
                        <Play className="w-6 h-6 fill-black text-black ml-1.5" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 px-2.5 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                        {script.genre}
                      </span>
                    </div>
                    <CardTitle className="text-base font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors leading-tight">{script.title}</CardTitle>
                    <CardDescription className="text-[10px] flex items-center gap-2 mt-2 font-bold uppercase tracking-widest text-zinc-500">
                      IDENT: <span className="text-zinc-300">@{script.author}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex items-center gap-6 text-zinc-500 border-t border-zinc-900 mt-2 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest group-hover:text-cyan-500 transition-colors">
                      <Heart className="w-4 h-4 fill-cyan-500/10" />
                      {script.likes}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                      <MessageSquare className="w-4 h-4 fill-orange-500/10" />
                      {script.comments}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3 text-white">
            <Users className="w-6 h-6 text-fuchsia-500" />
            Top Architects
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-[#050505]/40 border border-zinc-900 rounded-2xl hover:bg-[#070707] hover:border-fuchsia-500/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden group-hover:border-fuchsia-500/50 transition-all">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="Avatar" className="grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-200 group-hover:text-white transition-colors">Architect_{i}</p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">42 Scripts <span className="text-zinc-800 mx-1">•</span> 1.2k Core</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-fuchsia-500 hover:text-white hover:bg-fuchsia-600 font-black uppercase tracking-widest text-[9px] h-8 px-4 border border-fuchsia-500/20 rounded-xl transition-all">Link</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

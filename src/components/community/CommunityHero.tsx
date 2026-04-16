import React from 'react';
import { Users, Shield, MessageCircle, Share2, Award, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

export function CommunityHero() {
  return (
    <div className="relative py-20 rounded-[40px] overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl">
      {/* Dynamic Aura Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(220,38,38,0.1)_0%,_transparent_70%)]" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-600/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-8 flex flex-col items-center text-center gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-xl"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            <span className="text-white">1,402</span> CREATORS ONLINE
          </span>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black tracking-tighter uppercase leading-[0.85] text-white italic">
            CREATOR <br />
            <span className="text-red-600 non-italic">CORPS</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium italic max-w-xl mx-auto py-2">
            "The front line of anime production. Share scripts, collaborate on world-building, and earn your place in the hall of legends."
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
           <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.1em] text-xs h-14 px-10 rounded-2xl shadow-xl shadow-red-600/20 group">
             <Share2 className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
             Deploy Script
           </Button>
           <Button variant="outline" size="lg" className="border-zinc-800 bg-zinc-950/50 backdrop-blur-md text-white hover:bg-zinc-900 font-black uppercase tracking-[0.1em] text-xs h-14 px-8 rounded-2xl">
             <MessageCircle className="w-4 h-4 mr-3" />
             Join Discord
           </Button>
        </div>

        <div className="flex items-center gap-12 mt-4">
           <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white">12.4K</span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Scripts Shared</span>
           </div>
           <div className="w-[1px] h-10 bg-zinc-800" />
           <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white">450+</span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Active Units</span>
           </div>
           <div className="w-[1px] h-10 bg-zinc-800" />
           <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-white">$25K+</span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Creator Fund</span>
           </div>
        </div>
      </div>

      {/* Floating Badges */}
      <div className="absolute top-10 left-10 hidden xl:flex items-center gap-4 p-4 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl">
         <Award className="w-5 h-5 text-amber-500" />
         <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Elite Creator Tier</div>
      </div>
      <div className="absolute bottom-10 right-10 hidden xl:flex items-center gap-4 p-4 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl">
         <Shield className="w-5 h-5 text-blue-500" />
         <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Verified Origin</div>
      </div>
    </div>
  );
}

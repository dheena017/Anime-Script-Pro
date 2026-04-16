import React from 'react';
import { Play, BookOpen, Search, Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion } from 'motion/react';

export function TutorialHero() {
  return (
    <div className="relative py-24 rounded-[40px] overflow-hidden bg-zinc-950 border border-zinc-800 flex flex-col items-center text-center gap-8">
      {/* Abstract Grid Background */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-12 w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-2xl shadow-red-600/10"
      >
        <Sparkles className="w-6 h-6 text-red-500" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-600/10"
      >
        <BookOpen className="w-8 h-8 text-blue-500" />
      </motion.div>

      <div className="relative z-10 space-y-4 max-w-3xl px-6">
        <Badge className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[10px] uppercase font-black tracking-[0.2em] h-7">
          Studio Knowledge Base
        </Badge>
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9] text-white">
          Elevate Your <br />
          <span className="text-red-500 italic">Production Craft</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium italic max-w-xl mx-auto py-2">
          "From prompt engineering to cinematic storyboarding. Access our elite library of industry-standard anime production techniques."
        </p>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 mt-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
          <Input 
            placeholder="Search tutorials, techniques, or models..." 
            className="pl-12 h-14 bg-zinc-900/50 border-zinc-800 focus:border-red-500/50 rounded-2xl shadow-2xl"
          />
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-8 mt-4 overflow-x-auto no-scrollbar px-6 w-full justify-center">
        {['Getting Started', 'Advanced Prompts', 'Visual Continuity', 'AI Voice Acting', 'Post-Production'].map((cat) => (
          <button key={cat} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors whitespace-nowrap">
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}

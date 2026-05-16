import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Globe, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { GalleryItem, STYLE_OPTIONS } from '../constants';
import { cn } from '@/lib/utils';

interface GalleryProps {
  images: GalleryItem[];
  activePrompt: string;
  setActivePrompt: (prompt: string) => void;
  onTryPrompt: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  images,
  activePrompt,
  setActivePrompt,
  onTryPrompt,
}) => {
  const [filter, setFilter] = useState('ALL');
  const [copied, setCopied] = useState<string | null>(null);

  const filteredImages = filter === 'ALL' 
    ? images 
    : images.filter(img => img.prompt.toLowerCase().includes(filter.toLowerCase()));

  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(prompt);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto py-32 px-6">
      {/* 1. HEADER PROTOCOL */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
        <div className="space-y-4 text-left">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-studio" />
              <span className="text-xs font-black text-studio uppercase tracking-[0.4em]">Intelligence Layer</span>
           </div>
           <h2 className="text-4xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Gallery Archive</h2>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] max-w-md leading-relaxed">
             A high-bandwidth feed of historical transmissions synthesized by global architects.
           </p>
        </div>

        {/* STYLE FILTER NODES */}
        <div className="flex flex-wrap gap-2 justify-end">
           <button 
            onClick={() => setFilter('ALL')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
              filter === 'ALL' ? "bg-white text-black border-white" : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400"
            )}
           >
              All Transmissions
           </button>
           {STYLE_OPTIONS.slice(0, 4).map(style => (
             <button 
              key={style.label}
              onClick={() => setFilter(style.label)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                filter === style.label ? "bg-studio text-black border-studio shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400"
              )}
             >
                {style.label}
             </button>
           ))}
        </div>
      </div>

      {/* 2. ARCHIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((item) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative group cursor-pointer rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 hover:border-studio/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500"
              onClick={() => setActivePrompt(item.prompt)}
            >
              <OptimizedImage
                src={item.src}
                alt={item.prompt}
                className="w-full h-72 transition-transform duration-1000 group-hover:scale-110 object-cover"
                width={400}
                height={288}
              />
              
              {/* METADATA OVERLAY (IDLE) */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full border border-white/10 opacity-100 group-hover:opacity-0 transition-opacity">
                 <Globe className="w-3 h-3 text-studio" />
                 <span className="text-xs font-black text-white uppercase tracking-widest">{item.node || 'NODE-01'}</span>
              </div>

              {/* INTERACTION OVERLAY (HOVER) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-8 transition-all duration-500">
                <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="space-y-1">
                      <span className="text-xs font-black text-studio uppercase tracking-[0.4em]">DIRECTIVE</span>
                      <p className="text-white text-sm font-bold leading-relaxed italic">"{item.prompt}"</p>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex flex-col">
                         <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Architect</span>
                         <span className="text-xs font-black text-white uppercase italic">{item.architect || 'ANONYMOUS'}</span>
                      </div>
                      <div className="flex gap-2">
                         <button 
                          onClick={(e) => { e.stopPropagation(); handleCopy(item.prompt); }}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white"
                         >
                            {copied === item.prompt ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                         </button>
                         <button 
                          onClick={(e) => { e.stopPropagation(); onTryPrompt(); }}
                          className="w-10 h-10 rounded-xl bg-studio flex items-center justify-center hover:bg-white transition-all text-black shadow-lg"
                         >
                            <Zap className="w-4 h-4 fill-black" />
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* 3. SELECTED PROTOCOL MONITOR */}
      <AnimatePresence>
        {activePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            className="mt-16 p-10 rounded-[3rem] bg-[#0a0a0b] border border-studio/20 text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-studio/5 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-6">
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-studio/10 border border-studio/20 flex items-center justify-center text-studio">
                     <Zap className="w-5 h-5 fill-studio" />
                  </div>
                  <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-black">Sync Directive</p>
               </div>
               <p className="text-xl md:text-2xl text-white font-black italic max-w-3xl mx-auto">"{activePrompt}"</p>
               <Button
                 onClick={onTryPrompt}
                 className="h-16 px-12 bg-studio text-black font-black uppercase tracking-[0.3em] text-xs rounded-[2rem] shadow-[0_20px_50px_rgba(6,182,212,0.3)] hover:bg-white hover:scale-105 transition-all"
               >
                 INITIALIZE TRANSMISSION <ArrowRight className="ml-3 w-5 h-5" />
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};



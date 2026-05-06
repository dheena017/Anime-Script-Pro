import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoreCardProps {
  id: string;
  title: string;
  type: string;
  desc: string;
  items: number;
  efficiency: string;
}

export function LoreCard({ id, title, type, desc, items, efficiency }: LoreCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="group relative bg-[#0a0a0b] border border-white/5 rounded-[2rem] p-8 hover:border-studio/30 transition-all duration-500"
    >
      <div className="absolute top-0 right-0 p-8 flex flex-col items-end gap-1">
         <div className="flex items-center gap-1.5 px-3 py-1 bg-studio/10 rounded-full border border-studio/20">
            <Sparkles className="w-3 h-3 text-studio" />
            <span className="text-[9px] font-black text-studio uppercase tracking-widest">{efficiency} SYNC</span>
         </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-studio/50 uppercase tracking-widest">{id}</span>
              <div className="h-[1px] w-8 bg-studio/20" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{type}</span>
           </div>
           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-studio transition-colors">
              {title}
           </h3>
        </div>

        <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase tracking-wider line-clamp-2 italic">
           {desc}
        </p>

        <div className="flex items-end justify-between pt-4">
           <div className="space-y-1">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Total Artifacts</span>
              <span className="text-xl font-black text-white uppercase tabular-nums tracking-widest">{items.toLocaleString()}</span>
           </div>
           <button className="flex items-center gap-3 group/btn">
              <span className="text-[10px] font-black text-zinc-100 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                 Access Data
              </span>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:border-white transition-all duration-500">
                 <ArrowRight className="w-5 h-5 text-white group-hover/btn:text-black transition-colors" />
              </div>
           </button>
        </div>
      </div>

      {/* Hover Decoration */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-studio/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}

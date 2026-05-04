import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function WorldLayout() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4 border-b border-amber-500/20 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
          <Globe className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Comic World Genesis</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Graphic Novel Environments</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2rem] bg-black/40 border border-amber-500/10 h-64 flex flex-col items-center justify-center text-center space-y-4"
        >
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">System Ready</p>
          <h3 className="text-zinc-400 text-xs font-bold px-8">The Comic World Synthesis module is initializing. Define your concept in the Creative Engine to begin.</h3>
        </motion.div>
      </div>
    </div>
  );
}

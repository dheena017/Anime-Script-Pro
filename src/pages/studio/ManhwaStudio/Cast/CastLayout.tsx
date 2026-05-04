import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function CastLayout() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4 border-b border-violet-500/20 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/30">
          <Users className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Manhwa Cast Registry</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Character Profiles & DNA Forge</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2rem] bg-black/40 border border-violet-500/10 h-64 flex flex-col items-center justify-center text-center space-y-4"
        >
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">System Ready</p>
          <h3 className="text-zinc-400 text-xs font-bold px-8">The Manhwa Cast module is initializing. Synthesize your characters to populate the registry.</h3>
        </motion.div>
      </div>
    </div>
  );
}

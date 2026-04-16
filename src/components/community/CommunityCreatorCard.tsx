import React from 'react';
import { UserPlus, Star, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

interface CommunityCreatorCardProps {
  id: number;
  name: string;
  stats: string;
}

export function CommunityCreatorCard({ id, name, stats }: CommunityCreatorCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl hover:bg-zinc-900/80 hover:border-red-500/30 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-2 border-zinc-950 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-6">
            <img 
              src={`https://i.pravatar.cc/150?u=${id}`} 
              alt={name} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
              referrerPolicy="no-referrer" 
            />
          </div>
          {id % 2 === 0 && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-blue-600 border-2 border-zinc-950 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div>
          <h4 className="text-sm font-black text-white hover:text-red-500 transition-colors uppercase tracking-tight">{name}</h4>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{stats}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
         <div className="hidden sm:flex flex-col items-end px-4">
            <div className="flex items-center gap-1 text-[10px] font-black text-amber-500">
               <Star className="w-3 h-3 fill-current" />
               ELITE
            </div>
            <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-right">Lvl 42</p>
         </div>
         <Button 
            variant="ghost" 
            size="sm" 
            className="h-10 w-10 sm:w-auto sm:px-4 rounded-xl text-zinc-400 group-hover:text-red-500 group-hover:bg-red-500/10 border border-transparent group-hover:border-red-500/20 transition-all"
         >
            <UserPlus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Follow</span>
         </Button>
      </div>
    </motion.div>
  );
}

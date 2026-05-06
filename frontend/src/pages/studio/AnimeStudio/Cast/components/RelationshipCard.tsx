import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Users, 
  Heart, 
  Swords, 
  Shield, 
  Zap, 
  Lock,
  Eye
} from 'lucide-react';
  
interface Connection {
  id: string;
  source: string;
  target: string;
  type: string;
  tension: number;
  description: string;
}

interface RelationshipCardProps {
  connection: Connection;
  onRemove: (id: string) => void;
  onView?: (id: string) => void;
}

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Ally': return <Shield className="w-4 h-4 text-emerald-500" />;
    case 'Rival': return <Zap className="w-4 h-4 text-orange-500" />;
    case 'Enemy': return <Swords className="w-4 h-4 text-red-500" />;
    case 'Love': return <Heart className="w-4 h-4 text-fuchsia-500" />;
    case 'Secret': return <Lock className="w-4 h-4 text-zinc-500" />;
    default: return <Users className="w-4 h-4 text-cyan-500" />;
  }
};

export const RelationshipCard: React.FC<RelationshipCardProps> = ({
  connection: conn,
  onRemove,
  onView
}) => {
  const isHighTension = conn.tension >= 8;
  const isLowTension = conn.tension <= 3;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative flex items-center justify-between p-6 bg-gradient-to-r from-zinc-950 to-[#0a0a0a] border border-zinc-900 rounded-[2rem] group hover:border-fuchsia-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.05)] overflow-hidden h-full flex flex-col"
    >
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* High Tension Warning Glow */}
      {isHighTension && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative z-10 w-full flex-1">
        {/* Source & Target Block */}
        <div className="flex items-center gap-4 min-w-[300px] justify-center">
            <div className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 uppercase tracking-tighter text-center sm:text-right flex-1 truncate">
              {conn.source}
            </div>
            
            <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500 px-2 shrink-0">
              <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-zinc-600 rounded-full" />
              <div className="p-2 rounded-full bg-zinc-900/80 border border-zinc-700/50 shadow-xl relative">
                {isHighTension && <div className="absolute inset-0 bg-red-500/20 blur-md rounded-full animate-pulse" />}
                {getTypeIcon(conn.type)}
              </div>
              <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-zinc-600 rounded-full" />
            </div>

            <div className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-zinc-400 uppercase tracking-tighter text-center sm:text-left flex-1 truncate">
              {conn.target}
            </div>
        </div>

        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent hidden md:block" />

        {/* Details Block */}
        <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-sm", {
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30': conn.type === 'Ally',
                    'bg-orange-500/10 text-orange-400 border-orange-500/30': conn.type === 'Rival',
                    'bg-red-500/10 text-red-400 border-red-500/30': conn.type === 'Enemy',
                    'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30': conn.type === 'Love',
                    'bg-zinc-800 text-zinc-400 border-zinc-700': conn.type === 'Secret',
                })}>
                  {conn.type}
                </span>
                
                {/* Tension Meter */}
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mr-1">Tension</span>
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={cn("w-1.5 h-2.5 rounded-sm transition-all duration-500", 
                          i < conn.tension 
                            ? isHighTension ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                            : isLowTension ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                            : "bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" 
                            : "bg-zinc-800"
                        )} 
                      />
                    ))}
                    <span className="text-[10px] font-black text-white ml-2 tabular-nums">{conn.tension}</span>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-zinc-400/90 font-medium italic leading-relaxed">
              "{conn.description}"
            </p>
        </div>

        {/* Actions Block */}
        <div className="flex sm:flex-col items-center gap-2 pl-0 sm:pl-4 mt-4 sm:mt-0 relative z-10 shrink-0 border-t sm:border-t-0 sm:border-l border-zinc-800/50 pt-4 sm:pt-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-zinc-900 text-zinc-600 hover:text-cyan-400 transition-colors"
            onClick={() => onView?.(conn.id)}
          >
              <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-red-500/10 text-zinc-600 hover:text-red-500 transition-colors"
            onClick={() => onRemove(conn.id)}
          >
              <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};




import { motion } from 'framer-motion';
import { LucideIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeriesEmptyTabProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor?: string;
}

export function SeriesEmptyTab({ 
  icon: Icon, 
  title, 
  description,
  accentColor = "studio"
}: SeriesEmptyTabProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] space-y-6 text-center px-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "w-20 h-20 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center relative group",
          `shadow-[0_0_50px_rgba(var(--${accentColor}-rgb),0.1)]`
        )}
      >
        <div className={cn(
          "absolute inset-0 blur-2xl rounded-full opacity-20",
          accentColor === 'studio' ? "bg-studio" : `bg-${accentColor}-500`
        )} />
        <Icon className={cn("w-10 h-10 relative z-10", accentColor === 'studio' ? "text-studio" : `text-${accentColor}-400`)} />
      </motion.div>
      
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">{title}</h3>
        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
        <AlertCircle className="w-3 h-3 text-zinc-600" />
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">No data yet — generate or add manually</span>
      </div>
    </div>
  );
}

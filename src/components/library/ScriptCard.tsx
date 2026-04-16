import React from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  Clock, 
  Calendar,
  MoreVertical,
  ExternalLink,
  Star,
  Zap,
  Layers,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { Timestamp } from 'firebase/firestore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ScriptCardProps {
  script: any;
  onView: (script: any) => void;
  onDelete: (id: string) => void;
  onFavorite?: (id: string, isFavorite: boolean) => void;
  onQuickView?: (script: any) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export function ScriptCard({ 
  script, 
  onView, 
  onDelete, 
  onFavorite, 
  onQuickView, 
  isSelected, 
  onSelect 
}: ScriptCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(script.isFavorite || false);
  const wordCount = script.script?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);
  const characterCount = script.script?.length || 0;
  
  const date = script.createdAt instanceof Timestamp 
    ? script.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : 'Recent';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextValue = !isFavorite;
    setIsFavorite(nextValue);
    onFavorite?.(script.id, nextValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="h-full"
    >
      <Card className="group relative bg-zinc-900/40 border-zinc-800/50 hover:border-red-500/40 transition-all duration-500 overflow-hidden h-full flex flex-col backdrop-blur-md shadow-2xl hover:shadow-red-500/10">
        {/* Holographic Background Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:via-transparent group-hover:to-red-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Banner Section */}
        <div className="aspect-[16/9] bg-zinc-950 relative overflow-hidden">
          {/* Main Preview Image */}
          <img 
            src={`https://picsum.photos/seed/${script.id}/800/450`} 
            alt="Production Preview" 
            className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          
          {/* Scanning Line Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20 group-hover:opacity-40" />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          
          {/* Status Badge & Checkbox */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onSelect?.(script.id, !isSelected); }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/30' 
                    : 'bg-zinc-950/50 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />}
              </button>
              <Badge className="bg-red-600 text-white border-none text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm shadow-lg shadow-red-600/20">
                {script.status || 'Active Draft'}
              </Badge>
            </div>
            <Badge variant="outline" className="bg-zinc-950/80 backdrop-blur-md border-zinc-800 text-zinc-400 text-[8px] font-bold uppercase tracking-widest px-1.5 h-4">
              AI GEN 3.5
            </Badge>
          </div>

          {/* Favorite Toggle */}
          <button 
            onClick={handleFavoriteClick}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
              isFavorite 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-lg shadow-amber-500/20' 
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom Metas */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-red-500 text-[9px] font-black uppercase tracking-tighter h-5">
                  {script.tone || 'Action'}
                </Badge>
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-4 h-4 rounded-full border border-zinc-950 bg-zinc-800 flex items-center justify-center text-[6px] font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-4 h-4 rounded-full border border-zinc-950 bg-red-600 flex items-center justify-center text-[6px] font-bold">
                    +2
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 bg-zinc-950/40 backdrop-blur-sm pl-1 pr-2 py-0.5 rounded-full border border-white/5">
                <Clock className="w-3 h-3 text-red-500" />
                {readingTime}m Total Read
              </div>
            </div>
          </div>
          
          {/* Hover Main Action */}
          <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Button 
                size="lg" 
                className="rounded-xl bg-red-600 hover:bg-red-700 font-black uppercase tracking-[0.1em] text-xs h-12 shadow-xl shadow-red-600/20 px-8 group/btn"
                onClick={() => onView(script)}
              >
                <ExternalLink className="w-4 h-4 mr-3 group-hover/btn:translate-x-1 transition-transform" />
                Launch Studio
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-zinc-500 hover:text-white text-xs font-bold tracking-widest uppercase h-8"
                onClick={(e) => { e.stopPropagation(); onQuickView?.(script); }}
              >
                <Search className="w-3 h-3 mr-2" />
                Quick Inspect
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Content Section */}
        <CardHeader className="p-6 pb-2 space-y-3 relative z-10">
          <div className="space-y-1">
            <CardTitle className="text-xl line-clamp-1 group-hover:text-red-500 transition-all duration-300 font-bold tracking-tight">
              {script.prompt?.slice(0, 60) || 'Untitled Production'}
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                <Calendar className="w-3 h-3" />
                {date}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                <Layers className="w-3 h-3" />
                v2.4.0
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between relative z-10">
          <div className="relative">
            <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-red-600/20 group-hover:bg-red-600/50 transition-colors" />
            <p className="text-xs text-zinc-400 line-clamp-3 mb-6 leading-relaxed font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
              "{script.script?.replace(/[#|*-]/g, '').slice(0, 150)}..."
            </p>
          </div>
          
          {/* Footer Actions */}
          <div className="flex flex-col gap-4">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] uppercase font-black text-zinc-500 tracking-widest">
                <span>Script Maturity</span>
                <span className="text-red-500">75%</span>
              </div>
              <div className="h-1 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 group-hover:animate-pulse"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white font-mono tracking-tighter">{wordCount}</span>
                  <span className="text-[7px] uppercase font-bold text-zinc-600 tracking-[0.2em]">Words</span>
                </div>
                <div className="w-[1px] h-6 bg-zinc-800/50" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white font-mono tracking-tighter">{characterCount}</span>
                  <span className="text-[7px] uppercase font-bold text-zinc-600 tracking-[0.2em]">Chars</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors rounded-xl"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-800 text-[10px] font-bold uppercase tracking-widest">Download Assets</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-xl"
                        onClick={(e) => { e.stopPropagation(); onDelete(script.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-red-950 border-red-900 text-red-500 text-[10px] font-bold uppercase tracking-widest">Archive Script</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


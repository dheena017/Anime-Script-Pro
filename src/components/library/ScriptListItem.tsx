import React from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  Clock, 
  Calendar,
  ExternalLink,
  Star,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import { Timestamp } from '@/lib/storage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ScriptListItemProps {
  script: any;
  onView: (script: any) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export function ScriptListItem({ script, onView, onDelete, isSelected, onSelect }: ScriptListItemProps) {
  const wordCount = script.script?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);
  const date = script.createdAt instanceof Timestamp 
    ? script.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
    : 'Recent';

  return (
    <motion.div 
      layout
      className={`group border p-4 rounded-xl flex items-center gap-6 transition-all backdrop-blur-sm ${
        isSelected 
          ? 'bg-red-600/10 border-red-500/50' 
          : 'bg-zinc-900/40 border-zinc-800/60 hover:border-red-500/30 hover:bg-zinc-900/80'
      }`}
    >
      {/* Selection Checkbox */}
      <button 
        onClick={(e) => { e.stopPropagation(); onSelect?.(script.id, !isSelected); }}
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
          isSelected 
            ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/30' 
            : 'bg-zinc-950/50 border-zinc-700 hover:border-zinc-500'
        }`}
      >
        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />}
      </button>

      {/* Thumbnail */}
      <div className="w-24 h-16 bg-zinc-950 rounded-lg overflow-hidden flex-shrink-0 relative border border-zinc-800">
        <img 
          src={`https://picsum.photos/seed/${script.id}/200/150`} 
          alt="Preview" 
          className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/20">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-bold text-sm truncate group-hover:text-red-500 transition-colors">
            {script.prompt?.slice(0, 80) || 'Untitled Production'}
          </h4>
          <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-[9px] uppercase tracking-widest h-4 px-1.5 font-black hidden sm:flex">
            {script.tone || 'Action'}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readingTime} min
          </span>
          <span className="hidden sm:block opacity-40">•</span>
          <span className="hidden sm:block italic lowercase font-medium opacity-60 truncate">
            {script.script?.replace(/[#|*-]/g, '').slice(0, 60)}...
          </span>
        </div>
      </div>

      {/* Stats/Meta */}
      <div className="hidden lg:flex flex-col items-end gap-1 text-right min-w-[100px]">
        <span className="text-xs font-mono font-bold text-zinc-400">{wordCount} words</span>
        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Drafted in Studio</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 border-l border-zinc-800 pl-4 ml-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                onClick={() => onView(script)}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open in Studio</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                onClick={() => onDelete(script.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-zinc-600 group-hover:text-red-500 transition-colors"
          onClick={() => onView(script)}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}

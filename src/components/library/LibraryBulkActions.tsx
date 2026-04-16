import React from 'react';
import { 
  Trash2, 
  Download, 
  FolderPlus, 
  Share2, 
  X,
  CheckSquare,
  MinusSquare
} from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryBulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
  onMove: () => void;
  onExport: () => void;
}

export function LibraryBulkActions({ 
  selectedCount, 
  onClear, 
  onDelete, 
  onMove, 
  onExport 
}: LibraryBulkActionsProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-zinc-950 border border-red-500/20 rounded-2xl shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] backdrop-blur-xl flex items-center gap-8 min-w-[500px]"
        >
          <div className="flex items-center gap-3 pr-8 border-r border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-tight">Selected Items</p>
              <p className="text-sm font-black text-white font-mono">{selectedCount} Productions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 px-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900"
              onClick={onMove}
            >
              <FolderPlus className="w-4 h-4 mr-2 text-blue-500" />
              Move to Folder
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 px-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900"
              onClick={onExport}
            >
              <Download className="w-4 h-4 mr-2 text-emerald-500" />
              Batch Export
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 px-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <Share2 className="w-4 h-4 mr-2 text-purple-500" />
              Share Group
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto pl-8 border-l border-zinc-800">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
              onClick={onDelete}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-xl"
              onClick={onClear}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

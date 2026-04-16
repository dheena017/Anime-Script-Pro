import { Layout, Sparkles, Undo2, Redo2, Clock, FastForward, PlayCircle, Download, List, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ViewMode } from './types';

interface StoryboardToolbarProps {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  totalRuntime: number;
  isContinuing: boolean;
  onContinue: () => void;
  onPlay: () => void;
  onExport: () => void;
}

export function StoryboardToolbar({
  viewMode,
  onSetViewMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  totalRuntime,
  isContinuing,
  onContinue,
  onPlay,
  onExport,
}: StoryboardToolbarProps) {
  return (
    <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-red-500">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">AI Storyboard Panel</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-lg border border-zinc-800 mr-1">
          <Tooltip><TooltipTrigger asChild><Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => onSetViewMode('grid')} className="h-8 w-8"><Layout className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Storyboard Grid</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant={viewMode === 'script' ? 'secondary' : 'ghost'} size="icon" onClick={() => onSetViewMode('script')} className="h-8 w-8"><List className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Script View</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant={viewMode === 'present' ? 'secondary' : 'ghost'} size="icon" onClick={() => onSetViewMode('present')} className="h-8 w-8"><Presentation className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Pitch Mode</TooltipContent></Tooltip>
        </div>

        <div className="hidden sm:flex items-center gap-1 bg-zinc-950/40 p-1 rounded-lg border border-zinc-800 mr-1">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} className="h-8 w-8 text-zinc-500"><Undo2 className="w-3.5 h-3.5" /></Button></TooltipTrigger><TooltipContent>Undo</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} className="h-8 w-8 text-zinc-500"><Redo2 className="w-3.5 h-3.5" /></Button></TooltipTrigger><TooltipContent>Redo</TooltipContent></Tooltip>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/60 rounded-lg border border-zinc-800 text-zinc-500">
          <Clock className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-[10px] font-mono font-bold">EST. {Math.floor(totalRuntime / 60)}:{(totalRuntime % 60).toString().padStart(2, '0')}</span>
        </div>

        <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400" onClick={onContinue} disabled={isContinuing}>
          {isContinuing ? <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-2" /> : <FastForward className="w-4 h-4 mr-2" />}
          Continue
        </Button>

        <Button variant="outline" size="sm" onClick={onPlay} className="bg-red-600 hover:bg-red-700 border-none text-white">
          <PlayCircle className="w-4 h-4 mr-2" /> Play
        </Button>

        <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" /> PDF
        </Button>
      </div>
    </div>
  );
}

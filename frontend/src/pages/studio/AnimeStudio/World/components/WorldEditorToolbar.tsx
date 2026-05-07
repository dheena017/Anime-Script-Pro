import React from 'react';
import { 
  Bold, Italic, List, Type, 
  Sparkles, RotateCcw, Save, 
  MessageSquare, Wand2, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface WorldEditorToolbarProps {
  onFormat: (type: string) => void;
  onRefine: () => void;
  onUndo: () => void;
  onSave: () => void;
  isGenerating?: boolean;
}

export const WorldEditorToolbar: React.FC<WorldEditorToolbarProps> = ({
  onFormat,
  onRefine,
  onUndo,
  onSave,
  isGenerating
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-2 mb-4 bg-zinc-900/80 backdrop-blur-md border border-white/5 rounded-xl shadow-inner group">
        <div className="flex items-center gap-1">
          {/* Formatting Tools */}
          <div className="flex items-center bg-black/40 rounded-lg p-1 mr-2 border border-white/5">
            <EditorAction icon={Bold} label="Bold" onClick={() => onFormat('bold')} />
            <EditorAction icon={Italic} label="Italic" onClick={() => onFormat('italic')} />
            <EditorAction icon={List} label="Bullet List" onClick={() => onFormat('list')} />
            <div className="w-px h-4 bg-white/10 mx-1" />
            <EditorAction icon={Type} label="Heading" onClick={() => onFormat('h2')} />
          </div>

          {/* AI Tools */}
          <div className="flex items-center bg-studio/5 rounded-lg p-1 border border-studio/20">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={onRefine}
                  disabled={isGenerating}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 gap-2 text-studio hover:bg-studio/10 transition-all duration-300"
                >
                  <Sparkles className={cn("w-3.5 h-3.5", isGenerating && "animate-spin")} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Neural Refine</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-[9px] font-bold uppercase tracking-widest">AI rewrite & polish</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <EditorAction icon={History} label="History" onClick={() => {}} />
          <EditorAction icon={RotateCcw} label="Undo Changes" onClick={onUndo} />
          
          <Button
            onClick={onSave}
            size="sm"
            className="h-8 px-4 bg-studio text-black font-black uppercase tracking-tighter text-[10px] hover:bg-studio/90 shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-lg transition-all duration-300 active:scale-95"
          >
            <Save className="w-3.5 h-3.5 mr-2" />
            Finalize
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

interface EditorActionProps {
  icon: any;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const EditorAction = ({ icon: Icon, label, onClick, active }: EditorActionProps) => (
  <Tooltip>
    <TooltipTrigger>
      <Button
        onClick={onClick}
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-md transition-all duration-200",
          active ? "bg-studio/20 text-studio" : "text-zinc-400 hover:text-studio hover:bg-studio/10"
        )}
      >
        <Icon className="w-4 h-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="top" className="bg-zinc-900 border-white/10">
      <p className="text-[9px] font-bold uppercase tracking-widest">{label}</p>
    </TooltipContent>
  </Tooltip>
);

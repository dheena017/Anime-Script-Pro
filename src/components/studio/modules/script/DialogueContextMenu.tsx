import { Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface DialogueContextMenuProps {
  x: number;
  y: number;
  text: string;
  isGenerating: boolean;
  variations: string;
  onGenerate: (text: string) => void;
  onPreview: (text: string) => void;
  onDismiss: () => void;
  onMouseLeave: () => void;
}

export function DialogueContextMenu({
  x,
  y,
  text,
  isGenerating,
  variations,
  onGenerate,
  onPreview,
  onDismiss,
  onMouseLeave,
}: DialogueContextMenuProps) {
  return (
    <div 
      className="fixed z-[100] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-1 min-w-[200px] animate-in fade-in zoom-in duration-100"
      style={{ top: y, left: x }}
      onMouseLeave={onMouseLeave}
    >
      <button
        className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
        onClick={() => onGenerate(text)}
        disabled={isGenerating}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {isGenerating ? 'Generating...' : 'Give me 5 variations'}
      </button>

      <button
        className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
        onClick={() => onPreview(text)}
      >
        <Play className="w-3.5 h-3.5" />
        Voice Preview
      </button>
      
      {variations && (
        <div className="mt-1 p-3 border-t border-zinc-900 bg-black/40 rounded-b-lg">
           <div className="prose prose-invert prose-red max-w-none text-[10px] leading-relaxed">
              <ReactMarkdown>{variations}</ReactMarkdown>
           </div>
           <Button 
            variant="ghost" 
            className="w-full h-6 mt-2 text-[8px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400"
            onClick={onDismiss}
           >
             Dismiss
           </Button>
        </div>
      )}
    </div>
  );
}

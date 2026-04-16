import React from 'react';
import { 
  X, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  FileText,
  MessageSquare,
  Clock,
  Zap,
  Tag
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryQuickViewProps {
  script: any | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenInStudio: (script: any) => void;
}

export function LibraryQuickView({ script, isOpen, onClose, onOpenInStudio }: LibraryQuickViewProps) {
  const [copied, setCopied] = React.useState(false);

  if (!script) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(script.script || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 p-0 overflow-hidden gap-0">
        <div className="flex h-[80vh]">
          {/* Left Panel: Preview Content */}
          <div className="flex-1 flex flex-col border-r border-zinc-800">
            <DialogHeader className="p-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-red-600/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase tracking-widest px-2">
                  DRAFT v2.4
                </Badge>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                  <Clock className="w-3 h-3" />
                  Last edited 2h ago
                </div>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tighter text-white">
                {script.prompt?.slice(0, 100) || 'Untitled Production'}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 mt-2 line-clamp-2 text-xs font-medium leading-relaxed italic">
                {script.script?.replace(/[#|*-]/g, '').slice(0, 200)}...
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 p-8 bg-zinc-950">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between opacity-50 mb-8 border-b border-zinc-900 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Script Preview</span>
                  <p className="text-[10px] font-mono text-white/40">{script.script?.length || 0} Characters / {script.script?.split(/\s+/).length || 0} Words</p>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  {script.script?.split('\n').map((line: string, i: number) => (
                    <p key={i} className="text-zinc-200 leading-relaxed font-medium mb-4 selection:bg-red-500/30">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                  {copied ? 'Copied' : 'Copy Script'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                >
                  <Download className="w-3 h-3 mr-2" />
                  Export .PDF
                </Button>
              </div>
              <Button 
                className="bg-red-600 hover:bg-red-700 h-10 px-6 font-black uppercase tracking-widest text-xs"
                onClick={() => onOpenInStudio(script)}
              >
                Launch In Studio
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Panel: Metadata & Actions */}
          <div className="w-72 bg-zinc-900/40 p-6 flex flex-col gap-8 flex-shrink-0">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Contextual Data</h4>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">Production Tone</p>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                    <span className="text-xs font-bold text-zinc-200">{script.tone || 'Action'}</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">Model Engine</p>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-200">Gemini 3 Flash</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Associated Tags</h4>
              <div className="flex flex-wrap gap-2">
                {['Cyberpunk', 'Mecha', 'Sci-fi', 'Cinematic'].map(tag => (
                  <Badge key={tag} variant="outline" className="bg-zinc-900 border-zinc-800 text-[9px] font-bold uppercase tracking-widest hover:border-red-500/50 cursor-pointer">
                    <Tag className="w-2.5 h-2.5 mr-1.5" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-zinc-800">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-600/5 border border-red-600/10">
                <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Story Engine</span>
                  <span className="text-[9px] text-zinc-500">Ready for generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

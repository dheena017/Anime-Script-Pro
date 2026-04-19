import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StructureViewProps {
  templateMarkdown: string;
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
}

export const StructureView: React.FC<StructureViewProps> = ({
  templateMarkdown,
  isLiked,
  setIsLiked
}) => {
  return (
    <Card className="bg-[#050505]/50 border border-orange-500/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden min-h-[700px]">
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0" />
      
      <div className="p-8 border-b border-orange-500/10 bg-[#0a0a0a]/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Monitor className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">Production Skeleton</h3>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] ml-1">
            Optimized for High Retention YouTube Performance
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge className="bg-zinc-800/50 text-zinc-400 border-zinc-700 uppercase px-3 py-1 text-[9px] font-black tracking-widest">v4.1.2 Production</Badge>
            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 uppercase px-3 py-1 text-[9px] font-black tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.1)]">High Retention</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-300 border border-transparent",
              isLiked ? "text-orange-500 bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "text-zinc-600 hover:text-orange-400 hover:bg-zinc-800/50"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[750px] w-full p-0 relative z-10 bg-[#050505]/50">
        <div className="p-12 max-w-5xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="prose prose-invert prose-orange max-w-none 
              prose-h1:font-black prose-h1:text-4xl prose-h1:uppercase prose-h1:tracking-tighter prose-h1:text-orange-500 prose-h1:mb-8
              prose-h2:font-black prose-h2:text-2xl prose-h2:uppercase prose-h2:tracking-widest prose-h2:text-white prose-h2:mt-12
              prose-strong:text-orange-400 prose-strong:font-black
              prose-li:text-zinc-400 prose-li:font-medium
              prose-table:border-orange-500/10 prose-th:bg-zinc-900/50 prose-th:text-orange-100 prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:text-[10px]
            ">
              <div className="mb-12 flex justify-center">
                 <div className="inline-block px-4 py-1.5 bg-orange-500/5 border border-orange-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                   Master Blueprint Matrix
                 </div>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{templateMarkdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

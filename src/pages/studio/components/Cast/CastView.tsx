import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CastViewProps {
  generatedCharacters: string;
  isLiked: boolean;
  setIsLiked: (l: boolean) => void;
}

export const CastView: React.FC<CastViewProps> = ({
  generatedCharacters,
  isLiked,
  setIsLiked
}) => {
  return (
    <div className="space-y-12">
      <div className="border-b border-cyan-500/20 pb-12 mb-12 text-center space-y-4 relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            Cast & Archetype Specification
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-300",
              isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_10px_rgba(217,70,239,0.2)]" : "text-zinc-600 hover:text-fuchsia-400 hover:bg-[#0a0a0a]"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
        </div>
        <h1 className="text-5xl font-black text-cyan-50 leading-tight uppercase tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          Supporting Cast
        </h1>
        <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
          Architecting the emotional core and ideological conflicts of your narrative world.
        </p>
      </div>

      <div className="prose prose-invert prose-cyan max-w-none 
        prose-h1:font-black prose-h1:uppercase prose-h1:tracking-tighter prose-h1:text-cyan-400
        prose-h2:font-bold prose-h2:uppercase prose-h2:tracking-widest prose-h2:text-cyan-200
        prose-strong:text-cyan-300 prose-strong:font-bold
        prose-li:text-zinc-400 prose-li:font-medium
      ">
        <ReactMarkdown>{generatedCharacters}</ReactMarkdown>
      </div>

      <div className="mt-24 pt-12 border-t border-cyan-500/10 text-center">
        <p className="text-[10px] text-cyan-500/50 uppercase tracking-[0.5em] font-bold">
          End of Cast Spec
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { templateStyles as s } from './templateStyles';

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
    <Card className={s.structureContainer}>
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#22d3ee20_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee20_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />
      
      <div className={s.structureHeader}>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Monitor className="w-5 h-5" />
            </div>
            <h3 className={s.structureTitle}>Standard Matrix</h3>
          </div>
          <p className={s.structureSubtitle}>
            Global Production Standards v5.2 // System Core
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge className={s.structureBadge}>Protocol v5.2</Badge>
            <Badge className={s.structureVerifiedBadge}>Verified</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-2xl transition-all duration-300 border border-transparent",
              isLiked ? "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.3)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-cyan-500/10"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
          </Button>
        </div>
      </div>

      <div className="w-full p-0 relative z-10">
        <div className="p-8 lg:p-16 max-w-5xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className={s.structureProse}>
              <div className="mb-16 flex justify-start">
                 <div className="inline-block px-6 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                   Technical Specification // Unit: Standard
                 </div>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{templateMarkdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};





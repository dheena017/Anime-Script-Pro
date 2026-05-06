import React from 'react';
import { Package, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssetsHeaderProps {
  onRegenerate: () => void;
  isGenerating: boolean;
  onNext: () => void;
  onPrev?: () => void;
  session: string;
  episode: string;
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
}

export const AssetsHeader: React.FC<AssetsHeaderProps> = ({
  onRegenerate,
  isGenerating,
  onNext,
  onPrev
}) => {
  return (
    <div className="flex items-center justify-between p-6 bg-[#0a0a0a]/80 backdrop-blur-md border border-zinc-800 rounded-3xl mb-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-studio/10 border border-studio/20 flex items-center justify-center shadow-studio">
            <Package className="w-6 h-6 text-studio" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-white italic leading-none">Asset Laboratory</h1>
            <p className="text-[9px] font-black text-studio/60 uppercase tracking-[0.3em] mt-1">Multi-Format Asset Generator</p>
          </div>
        </div>

      </div>
      
      <div className="flex items-center gap-3">
        {onPrev && (
          <Button 
            variant="ghost" 
            className="text-zinc-500 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 px-4 rounded-xl transition-all"
            onClick={onPrev}
          >
            Back
          </Button>
        )}
        <Button 
          variant="outline" 
          className="bg-black/40 border-zinc-800 text-zinc-400 hover:text-studio hover:border-studio/30 font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all"
          onClick={onRegenerate}
          disabled={isGenerating}
        >
          {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
          Synthesize All Assets
        </Button>
        <Button 
          className="bg-studio/10 hover:bg-studio text-studio hover:text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl border border-studio/30 transition-all shadow-studio/20"
          onClick={onNext}
        >
          Next Module <ChevronRight className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
};




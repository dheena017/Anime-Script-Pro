import React from 'react';
import { Package, RefreshCw, ChevronRight, Sparkles, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { assetsStyles as s } from '../../Assets/assetsStyles';

interface AssetsHeaderProps {
  onRegenerate: () => void;
  isGenerating: boolean;
  onNext: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  session: string;
  episode: string;
  isLiked?: boolean;
  setIsLiked?: (liked: boolean) => void;
  hasContent?: boolean;
}

export const AssetsHeader: React.FC<AssetsHeaderProps> = ({
  onRegenerate,
  isGenerating,
  onNext,
  onPrev,
  onSave,
  isSaving,
  hasContent
}) => {
  return (
    <div className={s.header.wrapper}>
      <div className={s.header.glow} />
      <div className={s.header.container}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={s.header.iconBox}>
              <Package className={s.header.icon} />
            </div>
            <div>
              <h1 className={s.header.title}>Asset Laboratory</h1>
              <p className={s.header.subtitle}>Multi-Format Asset Generator</p>
            </div>
          </div>

        </div>
        
        <div className="flex items-center gap-3">
          {onPrev && (
            <Button 
              variant="ghost" 
              className={s.header.btnPrev}
              onClick={onPrev}
            >
              Back
            </Button>
          )}
          <Button 
            variant="outline" 
            className={s.header.btnRegen}
            onClick={onRegenerate}
            disabled={isGenerating}
          >
            {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
            {hasContent ? 'Regenerate Assets' : 'Synthesize All Assets'}
          </Button>

          <Button 
            className={s.header.btnNext}
            onClick={onNext}
          >
            Next Module <ChevronRight className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};




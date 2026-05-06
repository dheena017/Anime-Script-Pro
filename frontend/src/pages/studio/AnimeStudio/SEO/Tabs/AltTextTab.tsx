import React from 'react';
import { Globe, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { seoStyles as s } from '../seoStyles';

interface AltTextTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const AltTextTab: React.FC<AltTextTabProps> = ({ content, isGenerating, onGenerate }) => {
  return (
    <div className="space-y-6">
      <div className={s.headerContainer}>
        <div>
          <h3 className={s.headerTitle}>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            Alt Text Matrix
          </h3>
          <p className={s.headerSubtitle}>A descriptive alt text bundle for your storyboard imagery and marketing visuals.</p>
        </div>

        <Button
          size="sm"
          className={s.generateButtonBase + ' bg-cyan-600 text-black hover:bg-cyan-500 shadow-[0_0_25px_rgba(56,189,248,0.4)]'}
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-3" />
          ) : (
            <Sparkles className="w-4 h-4 mr-3" />
          )}
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>

      <Card className={cn(
        s.cardContainer,
        content ? 'border-cyan-500/30 shadow-[0_0_40px_rgba(56,189,248,0.1)]' : 'border-white/5 hover:border-cyan-500/20'
      )}>
        <div className={s.gridPattern} />
        <div className={s.cardContent}>
          {isGenerating ? (
            <div className={s.loadingStateContainer + ' text-cyan-500'}>
              <div className={s.loadingSpinner + ' border-cyan-500/20 border-t-cyan-500 shadow-[0_0_20px_rgba(56,189,248,0.3)]'} />
              <h4 className={s.loadingTitle + ' text-cyan-400'}>Alt Text Generator Online</h4>
              <p className={s.loadingText}>Creating descriptive, accessibility-ready alt captions for your visual content.</p>
            </div>
          ) : content ? (
            <div className="prose prose-invert prose-cyan max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-h1:text-cyan-400 prose-strong:text-cyan-300 prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <div className={s.emptyStateContainer}>
              <div className={s.emptyIconBox + ' group-hover/empty:border-cyan-500/30 group-hover/empty:bg-cyan-500/5'}>
                <Globe className="w-8 h-8 opacity-20 group-hover/empty:opacity-60 transition-opacity" />
              </div>
              <p className={s.emptyText}>Generate descriptive alt text for storyboard and marketing visuals.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};




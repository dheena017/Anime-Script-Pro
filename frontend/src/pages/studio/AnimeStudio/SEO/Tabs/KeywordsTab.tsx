import React from 'react';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { seoStyles as s } from '../seoStyles';

interface KeywordsTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const KeywordsTab: React.FC<KeywordsTabProps> = ({ content, isGenerating, onGenerate }) => {
  return (
    <div className="space-y-6">
      <div className={s.headerContainer}>
        <div>
          <h3 className={s.headerTitle}>
            <div className="w-1.5 h-1.5 rounded-full bg-studio shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            Keywords & Titles
          </h3>
          <p className={s.headerSubtitle}>High-CTR title variants, SEO tags, and thumbnail concepts for your anime production.</p>
        </div>

        <Button
          size="sm"
          className={s.generateButtonBase + ' bg-studio text-black hover:bg-studio/90 shadow-[0_0_25px_rgba(6,182,212,0.4)]'}
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-3" />
          ) : (
            <Sparkles className="w-4 h-4 mr-3" />
          )}
          {isGenerating ? 'Synthesizing...' : 'Generate'}
        </Button>
      </div>

      <Card className={cn(
        s.cardContainer,
        content ? 'border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]' : 'border-white/5 hover:border-studio/20'
      )}>
        <div className={s.gridPattern} />
        <div className={s.cardContent}>
          {isGenerating ? (
            <div className={s.loadingStateContainer + ' text-studio'}>
              <div className={s.loadingSpinner + ' border-studio/20 border-t-studio shadow-studio'} />
              <h4 className={s.loadingTitle + ' text-studio'}>Keyword Atlas Calibrating</h4>
              <p className={s.loadingText}>Building SEO signals and title variants for algorithmic reach.</p>
            </div>
          ) : content ? (
            <div className={s.contentProseContainer}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <div className={s.emptyStateContainer}>
              <div className={s.emptyIconBox + ' group-hover/empty:border-studio/30 group-hover/empty:bg-studio/5'}>
                <Sparkles className="w-8 h-8 opacity-20 group-hover/empty:opacity-60 transition-opacity" />
              </div>
              <p className={s.emptyText}>Generate your keyword matrix and title concepts for the SEO engine.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};




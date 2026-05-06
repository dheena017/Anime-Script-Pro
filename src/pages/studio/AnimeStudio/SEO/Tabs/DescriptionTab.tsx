import React from 'react';
import { MonitorPlay } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { seoStyles as s } from '../seoStyles';

interface DescriptionTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const DescriptionTab: React.FC<DescriptionTabProps> = ({ content, isGenerating, onGenerate }) => {
  return (
    <div className="space-y-6">
      <div className={s.headerContainer}>
        <div>
          <h3 className={s.headerTitle}>
            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
            Manifest Description
          </h3>
          <p className={s.headerSubtitle}>A polished YouTube description with timestamps, CTA, and social hooks.</p>
        </div>

        <Button
          size="sm"
          className={s.generateButtonBase + ' bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-[0_0_25px_rgba(192,38,211,0.4)]'}
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
          ) : (
            <MonitorPlay className="w-4 h-4 mr-3" />
          )}
          {isGenerating ? 'Inscribing...' : 'Generate'}
        </Button>
      </div>

      <Card className={cn(
        s.cardContainer,
        content ? 'border-fuchsia-500/30 shadow-[0_0_40px_rgba(192,38,211,0.1)]' : 'border-white/5 hover:border-fuchsia-500/20'
      )}>
        <div className={s.gridPattern} />
        <div className={s.cardContent}>
          {isGenerating ? (
            <div className={s.loadingStateContainer + ' text-fuchsia-700'}>
              <div className={s.loadingSpinner + ' border-fuchsia-500/20 border-t-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)]'} />
              <h4 className={s.loadingTitle + ' text-fuchsia-400'}>Description Weaver Active</h4>
              <p className={s.loadingText}>Drafting a high-conversion narrative that converts viewers into subscribers.</p>
            </div>
          ) : content ? (
            <div className="prose prose-invert prose-fuchsia max-w-none animate-in fade-in slide-in-from-bottom-4 duration-1000 prose-h1:text-fuchsia-400 prose-strong:text-fuchsia-300 prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-medium">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <div className={s.emptyStateContainer}>
              <div className={s.emptyIconBox + ' group-hover/empty:border-fuchsia-500/30 group-hover/empty:bg-fuchsia-500/5'}>
                <MonitorPlay className="w-8 h-8 opacity-20 group-hover/empty:opacity-60 transition-opacity" />
              </div>
              <p className={s.emptyText}>Generate a conversion-focused description for your anime release.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};




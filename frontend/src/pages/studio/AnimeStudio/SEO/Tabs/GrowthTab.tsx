import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, Loader2, Play, Users, MessageSquare, Repeat, Zap, ChevronLeft, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { growthApi, GrowthStrategy } from '@/services/api/growth';
import { seoStyles as s } from '../seoStyles';

interface GrowthTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: (strategyId?: number) => void;
}

const ICON_MAP: Record<string, any> = {
  Play, Users, MessageSquare, Repeat, Zap, TrendingUp
};

export const GrowthTab: React.FC<GrowthTabProps> = ({
  content,
  isGenerating,
  onGenerate
}) => {
  const [strategies, setStrategies] = useState<GrowthStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const data = await growthApi.getStrategies();
        setStrategies(data);
      } catch (error) {
        console.error("Failed to load growth strategies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStrategies();
  }, []);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Accessing Strategy Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className={s.distributionHeader}>
        <div className="flex items-center gap-6">
          <div className={s.distributionIconBox + ' bg-orange-500/10 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]'}>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h2 className={s.distributionTitle}>Growth Blueprint</h2>
            <p className={s.distributionSubtitle}>
              Advanced YouTube Strategy & Audience Retention Matrix
            </p>
          </div>
        </div>
        
        {content && (
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => onGenerate()}
              className="h-12 px-6 rounded-xl border-white/5 hover:bg-white/5 text-xs font-black uppercase tracking-widest gap-2"
            >
              <ChevronLeft className="w-3 h-3" /> New Strategy
            </Button>
            <Button
              onClick={handleCopy}
              className={s.copyButtonBase}
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Blueprint'}
            </Button>
          </div>
        )}
      </div>

      {!content ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strat) => {
            const Icon = ICON_MAP[strat.icon] || TrendingUp;
            return (
              <button 
                key={strat.id}
                onClick={() => onGenerate(strat.id)}
                disabled={isGenerating}
                className="group relative p-8 rounded-[2rem] bg-[#050505]/40 border border-white/5 hover:border-orange-500/40 transition-all text-left space-y-4 hover:shadow-[0_0_30px_rgba(249,115,22,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all w-fit">
                  <Icon className="w-6 h-6 text-zinc-600 group-hover:text-orange-500" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">{strat.name}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-wide line-clamp-2">{strat.description}</p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-xs font-black text-orange-500/40 uppercase tracking-[0.2em] group-hover:text-orange-500 transition-colors">
                  {isGenerating ? 'AI Processing...' : 'Synthesize Blueprint'}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="prose prose-invert max-w-none">
          <div className="p-10 rounded-[2.5rem] bg-[#050505]/60 border border-white/5 backdrop-blur-md relative">
             <div className="absolute top-8 right-8 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
             </div>
             <ReactMarkdown
               components={{
                 h1: ({node, ...props}) => <h1 className="text-xl font-black text-white uppercase tracking-tighter mb-6 mt-10 first:mt-0" {...props} />,
                 h2: ({node, ...props}) => <h2 className="text-lg font-black text-orange-500 uppercase tracking-widest mb-4 mt-8" {...props} />,
                 h3: ({node, ...props}) => <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 mt-6" {...props} />,
                 p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed text-zinc-400" {...props} />,
                 ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                 li: ({node, ...props}) => <li className="text-zinc-400" {...props} />,
                 strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
               }}
             >
               {content || ''}
             </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};


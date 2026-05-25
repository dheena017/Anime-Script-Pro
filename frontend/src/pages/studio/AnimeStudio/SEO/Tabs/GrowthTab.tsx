import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, Loader2, Play, Users, MessageSquare, Repeat, Zap, ChevronLeft, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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

  return (
    <div className="space-y-6">
      <Card className={cn(
        s.cardContainer,
        content ? 'border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.1)]' : 'border-white/5 hover:border-orange-500/20'
      )}>
        <div className={s.gridPattern} />
        <div className={s.cardContent}>
          {isLoading ? (
            <div className={s.loadingStateContainer + ' text-orange-500'}>
              <Loader2 className="w-8 h-8 animate-spin mb-6 text-orange-500" />
              <p className={s.loadingText}>Accessing Strategy Vault...</p>
            </div>
          ) : isGenerating ? (
            <div className={s.loadingStateContainer + ' text-orange-500'}>
              <div className={s.loadingSpinner + ' border-orange-500/20 border-t-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]'} />
              <h4 className={s.loadingTitle + ' text-orange-400'}>Amplification Blueprints Compiling</h4>
              <p className={s.loadingText}>Generating viral hooks, audience retention checkpoints, and pacing guidelines.</p>
            </div>
          ) : content ? (
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">Episodic Amplification Blueprint</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onGenerate()}
                    className="h-9 px-4 rounded-xl border-zinc-700 bg-black/40 hover:bg-white/5 text-xs font-black uppercase tracking-widest gap-2 flex items-center text-zinc-300"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </Button>
                  <Button
                    onClick={handleCopy}
                    className="h-9 px-4 rounded-xl font-black uppercase tracking-widest text-xs text-zinc-300 border border-zinc-700 bg-black/40 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300 flex items-center gap-2"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-black text-white uppercase tracking-tighter mb-6 mt-10 first:mt-0" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-black text-orange-500 uppercase tracking-widest mb-4 mt-8" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 mt-6" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed text-zinc-400 font-medium" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2 font-medium" {...props} />,
                    li: ({node, ...props}) => <li className="text-zinc-400 font-medium" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-orange-300 font-black" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-zinc-300" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-orange-500 pl-4 italic text-zinc-400 bg-orange-500/5 p-3 rounded-r-lg my-4" {...props} />,
                    code: ({node, inline, className, children, ...props}: any) => {
                      return inline ? (
                        <code className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-orange-300" {...props}>{children}</code>
                      ) : (
                        <pre className="p-4 rounded-xl bg-black/40 border border-white/5 overflow-x-auto font-mono text-xs text-zinc-300 leading-relaxed my-4" {...props}>{children}</pre>
                      );
                    }
                  }}
                >
                  {content || ''}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center max-w-md mx-auto space-y-2 mb-8">
                <h3 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em]">Select Amplification Focus</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
                  Choose a growth vector to synthesize a high-engagement promotional strategy for this script.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {strategies.map((strat) => {
                  const Icon = ICON_MAP[strat.icon] || TrendingUp;
                  return (
                    <button 
                      key={strat.id}
                      onClick={() => onGenerate(strat.id)}
                      disabled={isGenerating}
                      className="group relative p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-orange-500/30 transition-all duration-300 text-left space-y-4 hover:shadow-[0_0_30px_rgba(249,115,22,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all w-fit">
                        <Icon className="w-5 h-5 text-zinc-500 group-hover:text-orange-400 transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1.5">{strat.name}</h4>
                        <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider line-clamp-3">{strat.description}</p>
                      </div>
                      <div className="pt-2 flex items-center gap-1.5 text-[10px] font-black text-orange-500/40 uppercase tracking-wider group-hover:text-orange-400 transition-colors">
                        Synthesize Blueprint
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


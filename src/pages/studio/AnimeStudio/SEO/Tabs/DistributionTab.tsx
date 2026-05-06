import React, { useState } from 'react';
import { Share2, Play, Music2, Camera, Globe, CheckCircle2, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { seoStyles as s } from '../seoStyles';

interface DistributionTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const DistributionTab: React.FC<DistributionTabProps> = ({
  content,
  isGenerating,
  onGenerate
}) => {
  const [copied, setCopied] = useState(false);

  const platforms = [
    { name: 'YouTube', icon: Play, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', status: 'Ready', desc: 'Optimized for high-retention long-form and Shorts.' },
    { name: 'TikTok', icon: Music2, color: 'text-zinc-100', bg: 'bg-zinc-100/10', border: 'border-zinc-100/20', status: 'Ready', desc: 'Fast-paced edits and trending sound integration.' },
    { name: 'Instagram', icon: Camera, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', status: 'Pending', desc: 'Aesthetic Reels and story-driven carousel posts.' },
    { name: 'Web Platform', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', status: 'Optimizing', desc: 'SEO-rich blog posts and newsletter snippets.' },
  ];

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-10">
      <div className={s.distributionHeader}>
        <div className="flex items-center gap-6">
          <div className={s.distributionIconBox + ' bg-rose-500/10 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]'}>
            <Share2 className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h2 className={s.distributionTitle}>Distribution Matrix</h2>
            <p className={s.distributionSubtitle}>
              Cross-platform content snippets and engagement strategy
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          {content && (
            <Button
              onClick={handleCopy}
              className={s.copyButtonBase}
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Plan'}
            </Button>
          )}
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className={s.generateButtonLarge + ' bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 hover:shadow-rose-500/40'}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Analyzing...' : 'Generate Distribution Plan'}
          </Button>
        </div>
      </div>

      {!content ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform, i) => (
            <Card key={i} className={cn(s.platformCard, platform.border)}>
              <div className="flex items-center justify-between mb-6">
                <div className={cn(s.platformIconBox, platform.bg)}>
                  <platform.icon className={cn('w-6 h-6', platform.color)} />
                </div>
                <div className={cn(s.platformStatus, 
                  platform.status === 'Ready' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                )}>
                  {platform.status}
                </div>
              </div>
              <h4 className={s.platformName}>{platform.name}</h4>
              <p className={s.platformDesc}>{platform.desc}</p>
              
              <Button variant="ghost" className="w-full mt-6 h-10 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-[9px] font-black uppercase tracking-widest gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Preview Metadata
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="prose prose-invert max-w-none">
          <div className="p-10 rounded-[2.5rem] bg-[#050505]/60 border border-white/5 backdrop-blur-md">
             <ReactMarkdown
               components={{
                 h1: ({node, ...props}) => <h1 className="text-xl font-black text-white uppercase tracking-tighter mb-6 mt-10 first:mt-0" {...props} />,
                 h2: ({node, ...props}) => <h2 className="text-lg font-black text-rose-500 uppercase tracking-widest mb-4 mt-8" {...props} />,
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

      <Card className="bg-[#050505]/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
          <Share2 className="w-8 h-8 text-zinc-700" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-black text-white uppercase tracking-widest">Global Sync Engaged</h4>
          <p className="text-[10px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
            All distribution channels are synchronized with the current production DNA. Snippets will update automatically upon script regeneration.
          </p>
        </div>
      </Card>
    </div>
  );
};




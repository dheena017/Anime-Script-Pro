import { useEffect, useState } from 'react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { Loader2, FileSearch, Megaphone, Search, Share2, TrendingUp } from 'lucide-react';
import { SEOTab } from '../Tabs/SEOTabs';

interface SEOLoadingPageProps {
  tab?: SEOTab;
  title?: string;
  description?: string;
  message?: string;
  subtext?: string;
  progress?: number;
}

const TAB_META: Record<string, { title: string; description: string; icon: any; color: string; accentColor: string; borderColor: string; bgColor: string; shadowColor: string }> = {
  keywords: { title: 'Indexing Keywords', description: 'Generating search-engine friendly titles and indexing tags', icon: FileSearch, color: 'text-green-400', accentColor: 'text-green-400', borderColor: 'border-green-500/20', bgColor: 'bg-green-500/5', shadowColor: 'rgba(34, 197, 94, 0.1)' },
  description: { title: 'Writing Descriptions', description: 'Drafting compelling series and episode summaries', icon: Megaphone, color: 'text-emerald-400', accentColor: 'text-emerald-400', borderColor: 'border-emerald-500/20', bgColor: 'bg-emerald-500/5', shadowColor: 'rgba(16, 185, 129, 0.1)' },
  alt: { title: 'Generating Alt Texts', description: 'Creating accessibility-compliant image descriptions', icon: Search, color: 'text-teal-400', accentColor: 'text-teal-400', borderColor: 'border-teal-500/20', bgColor: 'bg-teal-500/5', shadowColor: 'rgba(20, 184, 166, 0.1)' },
  tags: { title: 'Building Meta Tags', description: 'Structuring metadata for platform indexing', icon: FileSearch, color: 'text-cyan-400', accentColor: 'text-cyan-400', borderColor: 'border-cyan-500/20', bgColor: 'bg-cyan-500/5', shadowColor: 'rgba(34, 211, 238, 0.1)' },
  distribution: { title: 'Planning Distribution', description: 'Mapping content strategy and platform reach', icon: Share2, color: 'text-blue-400', accentColor: 'text-blue-400', borderColor: 'border-blue-500/20', bgColor: 'bg-blue-500/5', shadowColor: 'rgba(59, 130, 246, 0.1)' },
  growth: { title: 'Analyzing Growth', description: 'Projecting audience retention and growth trends', icon: TrendingUp, color: 'text-lime-400', accentColor: 'text-lime-400', borderColor: 'border-lime-500/20', bgColor: 'bg-lime-500/5', shadowColor: 'rgba(132, 204, 22, 0.1)' },
};

const LoadingDots = ({ color }: { color: string }) => (
  <div className="flex items-center gap-1">
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0s' }} />
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0.2s' }} />
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0.4s' }} />
  </div>
);

export function SEOLoadingPage({ tab, title, description, progress }: SEOLoadingPageProps) {
  const gen = useGeneratorState();
  const isActive = gen.isGeneratingMetadata || gen.isGeneratingDistribution || gen.isGeneratingGrowthStrategy || gen.isLoading;

  const [localProgress, setLocalProgress] = useState<number>(typeof progress === 'number' ? progress : 0);

  useEffect(() => {
    if (typeof progress === 'number') { setLocalProgress(progress); return; }
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      setLocalProgress(p => (p > 0 ? p : 3));
      interval = setInterval(() => setLocalProgress(prev => Math.min(80, prev + Math.random() * 6 + 1)), 700);
    } else if (!isActive && localProgress > 0) {
      setLocalProgress(100);
      const t = setTimeout(() => setLocalProgress(0), 700);
      return () => clearTimeout(t);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, progress]);

  const meta = (tab && TAB_META[tab]) ? TAB_META[tab] : { 
    title: title || 'Optimizing SEO', 
    description: description || 'Improving discoverability and platform reach',
    icon: Search,
    color: 'text-green-400',
    accentColor: 'text-green-400',
    borderColor: 'border-green-500/20',
    bgColor: 'bg-green-500/5',
    shadowColor: 'rgba(34, 197, 94, 0.1)'
  };
  
  const Icon = meta.icon;

  return (
    <div className="w-full py-20 flex items-center justify-center min-h-[500px]">
      <div className={`w-full max-w-3xl rounded-[2rem] border ${meta.borderColor} bg-[#050505] px-8 py-16 text-center backdrop-blur-sm`} style={{ boxShadow: `0 0 60px ${meta.shadowColor}` }}>
        {/* Icon Container with Pulse */}
        <div className="mx-auto mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`h-20 w-20 rounded-3xl ${meta.bgColor} border ${meta.borderColor} animate-pulse`} />
          </div>
          <div className={`relative flex h-20 w-20 items-center justify-center rounded-3xl border ${meta.borderColor} ${meta.bgColor}`}>
            <Icon className={`h-10 w-10 ${meta.color}`} />
          </div>
        </div>

        {/* Loading Title */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className={`h-5 w-5 animate-spin ${meta.accentColor}`} />
          <p className={`text-[12px] font-black uppercase tracking-[0.28em] text-white ${meta.accentColor}`}>
            {meta.title}
          </p>
        </div>

        {/* Description */}
        <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          {meta.description}
        </p>

        {/* Progress Bar */}
        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5 border border-white/10">
          <div className={`${meta.bgColor} rounded-full transition-all duration-300`} style={{ height: '100%', width: `${typeof progress === 'number' ? progress : localProgress}%` }} />
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <LoadingDots color={meta.accentColor} />
        </div>

        {/* Status Text */}
        <div className={`flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] ${meta.color}`}>
          <div className={`h-2 w-2 rounded-full ${meta.accentColor} animate-pulse`} />
          AI is optimizing your SEO
          <span className="ml-2 text-xs font-black text-zinc-400">{Math.round(typeof progress === 'number' ? progress : localProgress)}%</span>
        </div>
      </div>
    </div>
  );
}

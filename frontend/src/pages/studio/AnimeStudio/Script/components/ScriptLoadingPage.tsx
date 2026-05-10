import { useEffect, useState } from 'react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { Loader2, FileText, Languages, ListMusic, MessageSquare, Database } from 'lucide-react';
import { ScriptTab } from '../Tabs/ScriptTabs';

interface ScriptLoadingPageProps {
  tab?: ScriptTab;
  title?: string;
  description?: string;
  message?: string;
  subtext?: string;
  progress?: number;
}

const TAB_META: Record<string, { title: string; description: string; icon: any; color: string; accentColor: string; borderColor: string; bgColor: string; shadowColor: string }> = {
  teleprompter: { title: 'Drafting Script', description: 'Generating dialogue, stage directions, and episodic flow', icon: FileText, color: 'text-indigo-400', accentColor: 'text-indigo-400', borderColor: 'border-indigo-500/20', bgColor: 'bg-indigo-500/5', shadowColor: 'rgba(99, 102, 241, 0.1)' },
  linguistics: { title: 'Analyzing Linguistics', description: 'Mapping vocabulary patterns and language signatures', icon: Languages, color: 'text-violet-400', accentColor: 'text-violet-400', borderColor: 'border-violet-500/20', bgColor: 'bg-violet-500/5', shadowColor: 'rgba(167, 139, 250, 0.1)' },
  beats: { title: 'Synthesizing Beat Sheet', description: 'Sequencing narrative impact and emotional arc markers', icon: ListMusic, color: 'text-pink-400', accentColor: 'text-pink-400', borderColor: 'border-pink-500/20', bgColor: 'bg-pink-500/5', shadowColor: 'rgba(236, 72, 153, 0.1)' },
  dialogue: { title: 'Refining Dialogue', description: 'Optimizing character voice and conversational dynamics', icon: MessageSquare, color: 'text-rose-400', accentColor: 'text-rose-400', borderColor: 'border-rose-500/20', bgColor: 'bg-rose-500/5', shadowColor: 'rgba(244, 63, 94, 0.1)' },
  metadata: { title: 'Optimizing Metadata', description: 'Indexing script for narrative consistency and SEO signals', icon: Database, color: 'text-cyan-400', accentColor: 'text-cyan-400', borderColor: 'border-cyan-500/20', bgColor: 'bg-cyan-500/5', shadowColor: 'rgba(34, 211, 238, 0.1)' },
};

const LoadingDots = ({ color }: { color: string }) => (
  <div className="flex items-center gap-1">
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0s' }} />
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0.2s' }} />
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0.4s' }} />
  </div>
);

export function ScriptLoadingPage({ tab, title, description, progress }: ScriptLoadingPageProps) {
  const gen = useGeneratorState();
  const isActive = gen.isGeneratingDescription || gen.isGeneratingSeries || gen.isLoading;

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

  const defaultMeta = { 
    title: title || 'Synthesizing Script', 
    description: description || 'Generating episodic dialogue and visual directions',
    icon: FileText,
    color: 'text-cyan-400',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    bgColor: 'bg-cyan-500/5',
    shadowColor: 'rgba(34, 211, 238, 0.1)'
  };

  const meta = (tab && TAB_META[tab]) ? TAB_META[tab] : defaultMeta;
  
  const Icon = meta.icon || FileText;

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
        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
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
        <div className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${meta.color}`}>
          <div className={`h-2 w-2 rounded-full ${meta.accentColor} animate-pulse`} />
          AI screenwriting engine active
          <span className="ml-2 text-[10px] font-black text-zinc-400">{Math.round(typeof progress === 'number' ? progress : localProgress)}%</span>
        </div>
      </div>
    </div>
  );
}

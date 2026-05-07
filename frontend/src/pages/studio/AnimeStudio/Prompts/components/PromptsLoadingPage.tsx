import { useEffect, useState } from 'react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { Loader2, Terminal, Layers } from 'lucide-react';
import type { PromptsTab } from '../Tabs/PromptsTabs';

interface PromptsLoadingPageProps {
  tab?: PromptsTab;
  title?: string;
  description?: string;
  progress?: number;
}

const TAB_META: Record<string, { title: string; description: string; icon: any; color: string; accentColor: string; borderColor: string; bgColor: string; shadowColor: string }> = {
  image: { title: 'Compiling Image Prompts', description: 'Generating Midjourney and Stable Diffusion prompt matrices', icon: Layers, color: 'text-yellow-400', accentColor: 'text-yellow-400', borderColor: 'border-yellow-500/20', bgColor: 'bg-yellow-500/5', shadowColor: 'rgba(234, 179, 8, 0.1)' },
  video: { title: 'Compiling Video Prompts', description: 'Generating Runway and Sora cinematic prompt sequences', icon: Terminal, color: 'text-orange-400', accentColor: 'text-orange-400', borderColor: 'border-orange-500/20', bgColor: 'bg-orange-500/5', shadowColor: 'rgba(249, 115, 22, 0.1)' },
};

const LoadingDots = ({ color }: { color: string }) => (
  <div className="flex items-center gap-1">
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0s' }} />
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0.2s' }} />
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0.4s' }} />
  </div>
);

export function PromptsLoadingPage({ tab, title, description, progress }: PromptsLoadingPageProps) {
  const gen = useGeneratorState();
  const isActive = gen.isGeneratingImagePrompts || gen.isGeneratingVisuals || gen.isLoading;

  const [localProgress, setLocalProgress] = useState<number>(typeof progress === 'number' ? progress : (typeof gen.generationProgress === 'number' ? gen.generationProgress : 0));

  useEffect(() => {
    if (typeof progress === 'number') { setLocalProgress(progress); return; }
    if (typeof gen.generationProgress === 'number' && gen.generationProgress > 0) { setLocalProgress(gen.generationProgress); return; }
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

  useEffect(() => {
    try { console.debug('[PromptsLoadingPage] isActive=', isActive, 'progress=', localProgress); } catch (e) {}
  }, [isActive, localProgress]);

  const meta = tab ? TAB_META[tab] : { 
    title: title || 'Compiling Prompts', 
    description: description || 'Preparing your prompts for AI generation',
    icon: Layers,
    color: 'text-yellow-400',
    accentColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/20',
    bgColor: 'bg-yellow-500/5',
    shadowColor: 'rgba(234, 179, 8, 0.1)'
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
        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {meta.description}
        </p>

        {/* Progress Bar */}
        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5 border border-white/10">
          <div className={`${meta.bgColor} rounded-full transition-all duration-300`} style={{ height: '100%', width: `${typeof progress === 'number' ? progress : (typeof gen.generationProgress === 'number' && gen.generationProgress > 0 ? gen.generationProgress : localProgress)}%` }} />
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <LoadingDots color={meta.accentColor} />
        </div>

        {/* Status Text */}
        <div className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${meta.color}`}>
          <div className={`h-2 w-2 rounded-full ${meta.accentColor} animate-pulse`} />
          AI is compiling your prompts
          <span className="ml-2 text-[10px] font-black text-zinc-400">{Math.round(typeof progress === 'number' ? progress : (typeof gen.generationProgress === 'number' && gen.generationProgress > 0 ? gen.generationProgress : localProgress))}%</span>
        </div>
      </div>
    </div>
  );
}

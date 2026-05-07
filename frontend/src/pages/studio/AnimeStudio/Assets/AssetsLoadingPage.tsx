import { useEffect, useState } from 'react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { Loader2, Package } from 'lucide-react';

interface AssetsLoadingPageProps {
  title?: string;
  description?: string;
  progress?: number;
}

export function AssetsLoadingPage({ 
  title = 'Processing Your Assets', 
  description = 'Organizing images, media, and creative resources',
  progress
}: AssetsLoadingPageProps) {
  const gen = useGeneratorState();
  const isActive = gen.isGeneratingVisuals || gen.isGeneratingImagePrompts || gen.isLoading;

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
    try { console.debug('[AssetsLoadingPage] isActive=', isActive, 'progress=', localProgress); } catch (e) {}
  }, [isActive, localProgress]);
  return (
    <div className="w-full py-20 flex items-center justify-center min-h-[500px]">
      <div className="w-full max-w-3xl rounded-[2rem] border border-teal-500/20 bg-[#050505] px-8 py-16 text-center backdrop-blur-sm" style={{ boxShadow: '0 0 60px rgba(20, 184, 166, 0.1)' }}>
        {/* Icon Container with Pulse */}
        <div className="mx-auto mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-3xl bg-teal-500/5 border border-teal-500/20 animate-pulse" />
          </div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-teal-500/20 bg-teal-500/5">
            <Package className="h-10 w-10 text-teal-400" />
          </div>
        </div>

        {/* Loading Title */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
          <p className="text-[12px] font-black uppercase tracking-[0.28em] text-white text-teal-400">
            {title}
          </p>
        </div>

        {/* Description */}
        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5 border border-white/10">
          <div className={`rounded-full transition-all duration-300 bg-teal-500/5`} style={{ height: '100%', width: `${typeof progress === 'number' ? progress : (typeof gen.generationProgress === 'number' && gen.generationProgress > 0 ? gen.generationProgress : localProgress)}%` }} />
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-1 mb-4">
          <div className="h-1.5 w-1.5 rounded-full text-teal-400 animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="h-1.5 w-1.5 rounded-full text-teal-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="h-1.5 w-1.5 rounded-full text-teal-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Status Text */}
        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-teal-400">
          <div className="h-2 w-2 rounded-full text-teal-400 animate-pulse" />
          AI is processing your assets
          <span className="ml-2 text-[10px] font-black text-zinc-400">{Math.round(typeof progress === 'number' ? progress : (typeof gen.generationProgress === 'number' && gen.generationProgress > 0 ? gen.generationProgress : localProgress))}%</span>
        </div>
      </div>
    </div>
  );
}

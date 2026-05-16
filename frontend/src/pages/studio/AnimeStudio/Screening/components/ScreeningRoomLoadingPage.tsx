import { useEffect, useState } from 'react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { Loader2, Film } from 'lucide-react';

interface ScreeningRoomLoadingPageProps {
  title?: string;
  description?: string;
  progress?: number;
}

export function ScreeningRoomLoadingPage({ 
  title = 'Loading Screening Room', 
  description = 'Preparing preview and playback functionality',
  progress
}: ScreeningRoomLoadingPageProps) {
  const gen = useGeneratorState();
  const isActive = gen.isLoading || gen.isGeneratingVisuals;

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
    try { console.debug('[ScreeningRoomLoadingPage] isActive=', isActive, 'progress=', localProgress); } catch (e) {}
  }, [isActive, localProgress]);
  return (
    <div className="w-full py-20 flex items-center justify-center min-h-[500px]">
      <div className="w-full max-w-3xl rounded-[2rem] border border-red-500/20 bg-[#050505] px-8 py-16 text-center backdrop-blur-sm" style={{ boxShadow: '0 0 60px rgba(239, 68, 68, 0.1)' }}>
        {/* Icon Container with Pulse */}
        <div className="mx-auto mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-3xl bg-red-500/5 border border-red-500/20 animate-pulse" />
          </div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/5">
            <Film className="h-10 w-10 text-red-400" />
          </div>
        </div>

        {/* Loading Title */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-red-400" />
          <p className="text-[12px] font-black uppercase tracking-[0.28em] text-white text-red-400">
            {title}
          </p>
        </div>

        {/* Description */}
        <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5 border border-white/10">
          <div className={`rounded-full transition-all duration-300 bg-red-500/5`} style={{ height: '100%', width: `${typeof progress === 'number' ? progress : (typeof gen.generationProgress === 'number' && gen.generationProgress > 0 ? gen.generationProgress : localProgress)}%` }} />
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-1 mb-4">
          <div className="h-1.5 w-1.5 rounded-full text-red-400 animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="h-1.5 w-1.5 rounded-full text-red-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="h-1.5 w-1.5 rounded-full text-red-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Status Text */}
        <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-400">
          <div className="h-2 w-2 rounded-full text-red-400 animate-pulse" />
          Screening room is loading
          <span className="ml-2 text-xs font-black text-zinc-400">{Math.round(typeof progress === 'number' ? progress : (typeof gen.generationProgress === 'number' && gen.generationProgress > 0 ? gen.generationProgress : localProgress))}%</span>
        </div>
      </div>
    </div>
  );
}

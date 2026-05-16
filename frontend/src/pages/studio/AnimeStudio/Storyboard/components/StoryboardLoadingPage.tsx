import { useEffect, useState } from 'react';
import { useGeneratorState } from '@/hooks/useGenerator';
import { Loader2, Palette, Camera, Layers, Film, Music } from 'lucide-react';
import { StoryboardTab } from '../Tabs/StoryboardTabs';

interface StoryboardLoadingPageProps {
  tab?: StoryboardTab;
  title?: string;
  description?: string;
  message?: string;
  subtext?: string;
  progress?: number;
}

const TAB_META: Record<string, { title: string; description: string; icon: any; color: string; accentColor: string; borderColor: string; bgColor: string; shadowColor: string }> = {
  frames: { title: 'Creating Keyframes', description: 'Generating cinematic keyframes and visual compositions', icon: Palette, color: 'text-orange-400', accentColor: 'text-orange-400', borderColor: 'border-orange-500/20', bgColor: 'bg-orange-500/5', shadowColor: 'rgba(249, 115, 22, 0.1)' },
  angles: { title: 'Planning Camera Angles', description: 'Drafting camera paths and shot perspectives', icon: Camera, color: 'text-cyan-400', accentColor: 'text-cyan-400', borderColor: 'border-cyan-500/20', bgColor: 'bg-cyan-500/5', shadowColor: 'rgba(34, 211, 238, 0.1)' },
  composition: { title: 'Arranging Composition', description: 'Arranging visual elements and scene depth', icon: Layers, color: 'text-violet-400', accentColor: 'text-violet-400', borderColor: 'border-violet-500/20', bgColor: 'bg-violet-500/5', shadowColor: 'rgba(167, 139, 250, 0.1)' },
  animatic: { title: 'Building Animatic', description: 'Sequencing frames into a narrative preview', icon: Film, color: 'text-amber-400', accentColor: 'text-amber-400', borderColor: 'border-amber-500/20', bgColor: 'bg-amber-500/5', shadowColor: 'rgba(250, 204, 21, 0.1)' },
  audio: { title: 'Syncing Audio', description: 'Aligning visuals with the production soundscape', icon: Music, color: 'text-pink-400', accentColor: 'text-pink-400', borderColor: 'border-pink-500/20', bgColor: 'bg-pink-500/5', shadowColor: 'rgba(236, 72, 153, 0.1)' },
};

const LoadingDots = ({ color }: { color: string }) => (
  <div className="flex items-center gap-1">
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0s' }} />
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0.2s' }} />
    <div className={`h-1.5 w-1.5 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0.4s' }} />
  </div>
);

export function StoryboardLoadingPage({ tab, title, description, progress }: StoryboardLoadingPageProps) {
  const gen = useGeneratorState();
  const isActive = gen.isGeneratingVisuals || gen.isGeneratingImagePrompts || gen.isLoading;

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

  const meta = tab ? TAB_META[tab] : { 
    title: title || 'Creating Your Storyboard', 
    description: description || 'Generating cinematic image prompts and storyboard panels',
    icon: Palette,
    color: 'text-orange-400',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    bgColor: 'bg-orange-500/5',
    shadowColor: 'rgba(217, 70, 239, 0.1)'
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
          AI is designing your storyboard
          <span className="ml-2 text-xs font-black text-zinc-400">{Math.round(typeof progress === 'number' ? progress : localProgress)}%</span>
        </div>
      </div>
    </div>
  );
}

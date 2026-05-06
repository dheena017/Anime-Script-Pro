import { Loader2, Palette, Sparkles, Camera, Layers, Film, Music } from 'lucide-react';
import { StoryboardTab } from '../Tabs/StoryboardTabs';

interface StoryboardLoadingPageProps {
  tab?: StoryboardTab;
  title?: string;
  description?: string;
  message?: string;
  subtext?: string;
}

const TAB_META: Record<string, { title: string; description: string; icon: any }> = {
  frames: { title: 'Creating Keyframes', description: 'Generating cinematic keyframes and visual compositions', icon: Palette },
  angles: { title: 'Planning Camera Angles', description: 'Drafting camera paths and shot perspectives', icon: Camera },
  composition: { title: 'Arranging Composition', description: 'Arranging visual elements and scene depth', icon: Layers },
  animatic: { title: 'Building Animatic', description: 'Sequencing frames into a narrative preview', icon: Film },
  audio: { title: 'Syncing Audio', description: 'Aligning visuals with the production soundscape', icon: Music },
};

export function StoryboardLoadingPage({ tab, title, description }: StoryboardLoadingPageProps) {
  const meta = tab ? TAB_META[tab] : { 
    title: title || 'Creating Your Storyboard', 
    description: description || 'Generating cinematic image prompts and storyboard panels',
    icon: Palette 
  };
  
  const Icon = meta.icon;

  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-fuchsia-500/20 bg-[#050505] px-8 py-16 text-center shadow-[0_0_60px_rgba(217,70,239,0.08)]">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-fuchsia-500/30 bg-fuchsia-500/10">
          <Icon className="h-10 w-10 text-fuchsia-400" />
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-fuchsia-400" />
          <p className="text-[12px] font-black uppercase tracking-[0.28em] text-white">
            {meta.title}
          </p>
        </div>

        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {meta.description}
        </p>

        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-fuchsia-500" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-fuchsia-300/70">
          <Sparkles className="h-3.5 w-3.5" />
          AI is designing your storyboard
        </div>
      </div>
    </div>
  );
}

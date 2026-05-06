import { Loader2, MessageSquare, Sparkles, Terminal, Layers } from 'lucide-react';
import type { PromptsTab } from '../Tabs/PromptsTabs';

interface PromptsLoadingPageProps {
  tab?: PromptsTab;
  title?: string;
  description?: string;
}

const TAB_META: Record<string, { title: string; description: string; icon: any }> = {
  image: { title: 'Compiling Image Prompts', description: 'Generating Midjourney and Stable Diffusion prompt matrices', icon: Layers },
  video: { title: 'Compiling Video Prompts', description: 'Generating Runway and Sora cinematic prompt sequences', icon: Terminal },
};

export function PromptsLoadingPage({ tab, title, description }: PromptsLoadingPageProps) {
  const meta = tab ? TAB_META[tab] : { 
    title: title || 'Compiling Prompts', 
    description: description || 'Preparing your prompts for AI generation',
    icon: MessageSquare 
  };
  
  const Icon = meta.icon;

  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-blue-500/20 bg-[#050505] px-8 py-16 text-center shadow-[0_0_60px_rgba(59,130,246,0.08)]">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-500/30 bg-blue-500/10">
          <Icon className="h-10 w-10 text-blue-400" />
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          <p className="text-[12px] font-black uppercase tracking-[0.28em] text-white">
            {meta.title}
          </p>
        </div>

        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {meta.description}
        </p>

        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-500" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-300/70">
          <Sparkles className="h-3.5 w-3.5" />
          AI is compiling your prompts
        </div>
      </div>
    </div>
  );
}

import { Loader2, Monitor, Sparkles, Film, Database, Eye, Play } from 'lucide-react';
import type { ScreeningTab } from '../Tabs/ScreeningTabs';

interface ScreeningLoadingPageProps {
  tab?: ScreeningTab;
  title?: string;
  description?: string;
  message?: string;
  subtext?: string;
}

const TAB_META: Record<string, { title: string; description: string; icon: any }> = {
  preview: { title: 'Generating Previews', description: 'Generating cinematic scene previews', icon: Play },
  timeline: { title: 'Syncing Timeline', description: 'Aligning episode beats with visual production markers', icon: Film },
  metadata: { title: 'Loading Details', description: 'Loading technical specifications and scene properties', icon: Database },
  review: { title: 'Preparing Review', description: 'Setting up your production for final review', icon: Eye },
};

export function ScreeningLoadingPage({ tab, title, description, message, subtext }: ScreeningLoadingPageProps) {
  const meta = tab ? TAB_META[tab] : { 
    title: message || title || 'Loading Screening Room', 
    description: subtext || description || 'Preparing your cinematic previews and production review',
    icon: Monitor 
  };
  
  const Icon = meta.icon;

  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-studio/20 bg-[#050505] px-8 py-16 text-center shadow-[0_0_60px_rgba(6,182,212,0.08)]">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-studio/30 bg-studio/10">
          <Icon className="h-10 w-10 text-studio" />
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-studio" />
          <p className="text-[12px] font-black uppercase tracking-[0.28em] text-white">
            {meta.title}
          </p>
        </div>

        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {meta.description}
        </p>

        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-studio" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-studio/70">
          <Sparkles className="h-3.5 w-3.5" />
          AI is preparing your preview
        </div>
      </div>
    </div>
  );
}

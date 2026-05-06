import { Loader2, Layout, Sparkles, Milestone, Calendar, BarChart3, Package } from 'lucide-react';
import { SeriesTab } from '../Tabs/SeriesTabs';

interface SeriesLoadingPageProps {
  tab?: SeriesTab;
  title?: string;
  description?: string;
  message?: string;
  subtext?: string;
}

const TAB_META: Record<string, { title: string; description: string; icon: any }> = {
  roadmap: { title: 'Mapping Roadmap', description: 'Generating macro-level series pacing and checkpoints', icon: Milestone },
  blueprint: { title: 'Planning Episode Structure', description: 'Organizing episode beats and overarching story arcs', icon: Layout },
  episodes: { title: 'Expanding Episodes', description: 'Building out specific episode structures and themes', icon: Milestone },
  timeline: { title: 'Adjusting Timeline', description: 'Planning production schedule and release milestones', icon: Calendar },
  arcs: { title: 'Mapping Story Arcs', description: 'Visualizing character growth and narrative momentum', icon: BarChart3 },
  assets: { title: 'Reviewing Assets', description: 'Listing production requirements and resources', icon: Package },
};

export function SeriesLoadingPage({ tab, title, description }: SeriesLoadingPageProps) {
  const meta = tab ? TAB_META[tab] : { 
    title: title || 'Planning Your Series', 
    description: description || 'Building your episode structure and story plan',
    icon: Layout 
  };
  
  const Icon = meta.icon;

  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-cyan-500/20 bg-[#050505] px-8 py-16 text-center shadow-[0_0_60px_rgba(6,182,212,0.08)]">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-500/30 bg-cyan-500/10">
          <Icon className="h-10 w-10 text-cyan-400" />
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          <p className="text-[12px] font-black uppercase tracking-[0.28em] text-white">
            {meta.title}
          </p>
        </div>

        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {meta.description}
        </p>

        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-cyan-500" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-300/70">
          <Sparkles className="h-3.5 w-3.5" />
          AI is planning your series
        </div>
      </div>
    </div>
  );
}

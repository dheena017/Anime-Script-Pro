import { Loader2, Globe, Map, History, Users, Zap, Building2, Map as Atlas, Globe as Culture, Cpu } from 'lucide-react';
import { WorldTab } from './tabs/WorldTabs';

interface WorldLoadingPageProps {
  tab?: WorldTab;
  title?: string;
  description?: string;
}

const TAB_META: Record<string, { title: string; description: string; icon: any }> = {
  manifest: { title: 'Creating World Overview', description: 'Building the foundation and core vision of your world', icon: Globe },
  lore: { title: 'Writing History', description: 'Composing historical timelines and world lore', icon: History },
  factions: { title: 'Creating Factions', description: 'Defining political powers and social structures', icon: Users },
  powers: { title: 'Creating Power System', description: 'Designing magic systems and special abilities', icon: Zap },
  architecture: { title: 'Designing Architecture', description: 'Visualizing physical world and stylistic themes', icon: Building2 },
  atlas: { title: 'Mapping Geography', description: 'Generating key locations and geographical regions', icon: Atlas },
  culture: { title: 'Crafting Culture', description: 'Developing customs, traditions, and societal norms', icon: Culture },
  systems: { title: 'Building Systems', description: 'Creating economic structures and governance systems', icon: Cpu },
};

export function WorldLoadingPage({ tab, title, description }: WorldLoadingPageProps) {
  const meta = tab ? TAB_META[tab] : { 
    title: title || 'Creating Your World', 
    description: description || 'Building your world structure, lore, and systems',
    icon: Globe 
  };
  
  const Icon = meta.icon;

  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-[2rem] border border-amber-500/20 bg-[#050505] px-8 py-16 text-center shadow-[0_0_60px_rgba(250,204,21,0.06)]">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-500/30 bg-amber-500/10">
          <Icon className="h-10 w-10 text-amber-400" />
        </div>

        <div className="mb-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          <p className="text-[12px] font-black uppercase tracking-[0.28em] text-white">
            {meta.title}
          </p>
        </div>

        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {meta.description}
        </p>

        <div className="mx-auto mb-6 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-amber-500" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-amber-300/70">
          <Map className="h-3.5 w-3.5" />
          AI is building your world
        </div>
      </div>
    </div>
  );
}

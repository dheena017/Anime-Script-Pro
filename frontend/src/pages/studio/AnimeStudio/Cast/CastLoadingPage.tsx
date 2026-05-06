import { Loader2, Users, Sparkles, Fingerprint, Brain, ShieldCheck, UserPlus } from 'lucide-react';
import { CastTab } from './components/CastToolbar';

interface CastLoadingPageProps {
  tab?: CastTab;
  title?: string;
  description?: string;
}

const TAB_META: Record<string, { title: string; description: string; icon: any }> = {
  registry: { title: 'Creating Characters', description: 'Building character profiles and backstories', icon: Users },
  dna: { title: 'Analyzing Character Traits', description: 'Mapping personality and behavioral patterns', icon: Fingerprint },
  dynamics: { title: 'Mapping Relationships', description: 'Determining character relationships and group dynamics', icon: Brain },
  integrity: { title: 'Checking Consistency', description: 'Verifying character and narrative consistency', icon: ShieldCheck },
  'add-lead': { title: 'Adding Character', description: 'Adding your custom character to the cast', icon: UserPlus },
};

export function CastLoadingPage({ tab, title, description }: CastLoadingPageProps) {
  const meta = tab && TAB_META[tab] ? TAB_META[tab] : { 
    title: title || 'Creating Your Characters', 
    description: description || 'Building character profiles and relationships',
    icon: Users 
  };

  const Icon = meta?.icon ?? Users;

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
          AI is creating your characters
        </div>
      </div>
    </div>
  );
}

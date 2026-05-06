import { motion } from 'framer-motion';
import { Grid, BookOpen, Command, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProfileTab = 'vault' | 'library' | 'config' | 'security';

const tabs: { id: ProfileTab; label: string; icon: any }[] = [
  { id: 'vault', label: 'Vault', icon: Grid },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'config', label: 'Directives', icon: Command },
  { id: 'security', label: 'Security', icon: Lock }
];

interface ProfileToolbarProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export function ProfileToolbar({ activeTab, onTabChange }: ProfileToolbarProps) {
  return (
    <div className="flex justify-center">
      <div className="flex bg-zinc-900/50 p-2 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-[2rem] transition-all relative",
              activeTab === tab.id ? "text-white" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="profile-tab" className="absolute inset-0 bg-white/5 border border-white/10 rounded-[2rem]" />
            )}
            <tab.icon className={cn("w-4 h-4 relative z-10", activeTab === tab.id && "text-studio")} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
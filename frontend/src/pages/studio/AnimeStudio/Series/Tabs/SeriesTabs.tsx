import React from 'react';
import { Film, Box, LayoutGrid, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { seriesStyles as s } from '../seriesStyles';
import { useGeneratorState } from '@/hooks/useGenerator';

export type SeriesTab = 'episodes' | 'assets' | 'blueprint' | 'ai-output';

interface SeriesTabsProps {
  activeTab: SeriesTab;
  setActiveTab: (tab: SeriesTab) => void;
  loadingStates?: Partial<Record<SeriesTab, boolean>>;
}

const TABS: { id: SeriesTab; label: string; icon: React.FC<any>; color: string; glow: string }[] = [
  { id: 'blueprint', label: 'BLUEPRINT', icon: LayoutGrid, color: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]' },
  { id: 'ai-output', label: 'AI OUTPUT', icon: Cpu, color: 'text-fuchsia-400', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]' },
  { id: 'episodes', label: 'EPISODES', icon: Film, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]' },
  { id: 'assets', label: 'ASSETS', icon: Box, color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.3)]' },
];

export const SeriesTabs: React.FC<SeriesTabsProps> = ({
  activeTab,
  setActiveTab,
  loadingStates = {}
}) => {
  const { generatedSeriesPlan, generatedScript } = useGeneratorState();
  const hasContent = Boolean(
    (generatedSeriesPlan && generatedSeriesPlan.length > 0) ||
    (generatedScript && generatedScript.trim().length > 0)
  );
  const visibleTabs = TABS.filter((tab) => tab.id === 'blueprint' || hasContent);

  return (
    <div className={s.tabs.container}>
      <div className={s.tabs.overlay} />

      {visibleTabs.map((tab) => {
        const loading = loadingStates[tab.id] || false;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              s.tabs.button,
              isActive ? s.tabs.buttonActive : s.tabs.buttonInactive
            )}
          >
            {isActive && (
              <div
                className={cn(s.tabs.pill, tab.glow)}
              />
            )}

            <div className="relative z-10 flex items-center gap-2.5">
              {loading ? (
                <div className={s.tabs.spinner} />
              ) : (
                <tab.icon className={cn(s.tabs.icon, isActive ? s.tabs.iconActive : s.tabs.iconInactive)} />
              )}
              <span className={s.tabs.label}>{tab.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

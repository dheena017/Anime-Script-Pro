import React from 'react';
import { History, Zap, Users, Building2, Map, Globe, Cpu, LucideIcon } from 'lucide-react';
import { WorldTab } from '../tabs/WorldTabs';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface SpecializedTabEmptyStateProps {
  tab: Exclude<WorldTab, 'manifest'>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const TAB_CONFIG: Record<Exclude<WorldTab, 'manifest'>, { 
  label: string;
  accentColor: string;
  description: string;
  icon: LucideIcon;
}> = {
  lore: {
    label: 'Historical Timeline',
    accentColor: 'fuchsia',
    description: 'Expand your world\'s history with eras and legendary events.',
    icon: History
  },
  powers: {
    label: 'Power System',
    accentColor: 'amber',
    description: 'Define mechanics, tiers, and limitations of your world\'s powers.',
    icon: Zap
  },
  factions: {
    label: 'Faction Politics',
    accentColor: 'cyan',
    description: 'Create complex relationships between world factions and ideologies.',
    icon: Users
  },
  architecture: {
    label: 'Visual Style',
    accentColor: 'amber',
    description: 'Define the architectural aesthetic and visual motifs of your world.',
    icon: Building2
  },
  atlas: {
    label: 'World Atlas',
    accentColor: 'cyan',
    description: 'Map out the physical geography, biomes, and regional boundaries.',
    icon: Map
  },
  culture: {
    label: 'Societal Ethos',
    accentColor: 'fuchsia',
    description: 'Profile the rituals, daily life, and cultural traditions of your people.',
    icon: Globe
  },
  systems: {
    label: 'World Dynamics',
    accentColor: 'emerald',
    description: 'Define ecosystems, signature technology, and mechanical systems.',
    icon: Cpu
  }
};

export const SpecializedTabEmptyState: React.FC<SpecializedTabEmptyStateProps> = ({
  tab,
  onGenerate,
  isGenerating
}) => {
  const config = TAB_CONFIG[tab];

  return (
    <StudioEmptyState
      icon={config.icon}
      title={config.label}
      description={config.description}
      actionLabel={isGenerating ? `Generating ${config.label}...` : `Generate ${config.label}`}
      onAction={onGenerate}
      isLoading={isGenerating}
      accentColor={config.accentColor}
      footerLabel="AI will create this section based on your world foundation"
    />
  );
};

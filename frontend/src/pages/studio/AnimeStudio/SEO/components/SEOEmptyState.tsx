import React from 'react';
import { Search, BarChart, Globe, Zap } from 'lucide-react';
import { StudioEmptyState } from '@/pages/studio/components/studio/shared/StudioEmptyState';

interface SEOEmptyStateProps {
  onLaunch: () => void;
  isGenerating: boolean;
}

export const SEOEmptyState: React.FC<SEOEmptyStateProps> = ({
  onLaunch,
  isGenerating
}) => {
  const features = [
    { icon: BarChart, title: 'Retention Analysis', description: 'AI predicts engagement based on meta-structure' },
    { icon: Globe, title: 'Global Reach', description: 'Auto-translates metadata for international visibility' },
    { icon: Zap, title: 'Speed Sync', description: 'Optimizes resource loading for crawl performance' }
  ];

  return (
    <StudioEmptyState
      icon={Search}
      title="No Asset Metadata"
      description="Your production is missing SEO and metadata. Generate optimized keywords, descriptions, and tags for better visibility."
      actionLabel="Generate Assets"
      loadingLabel="Creating Metadata..."
      onAction={onLaunch}
      isLoading={isGenerating}
      features={features}
      accentColor="emerald"
    />
  );
};





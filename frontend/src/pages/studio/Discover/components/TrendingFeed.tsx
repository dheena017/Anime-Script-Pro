import React, { useEffect, useRef, useState } from 'react';
import { ProjectShowcaseCard } from './ProjectShowcaseCard';
import { DiscoverEmptyState } from './DiscoverEmptyState';
import { discoverService, DiscoverItem } from '@/services/api/discover';

const POLL_INTERVAL = 60_000; // 60 seconds

export const TrendingFeed: React.FC = () => {
  const [projects, setProjects] = useState<DiscoverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTrending = async () => {
    try {
      const data = await discoverService.getDiscoverItems();
      setProjects(data);
    } catch (err) {
      console.error('[TrendingFeed] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    intervalRef.current = setInterval(fetchTrending, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-48 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />
      ))}
    </div>
  );

  if (projects.length === 0) return <DiscoverEmptyState />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {projects.map((p, i) => <ProjectShowcaseCard key={p.id ?? i} {...p} />)}
    </div>
  );
};

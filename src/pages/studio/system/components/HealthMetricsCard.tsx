import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Database, Network } from 'lucide-react';
import { apiRequest } from '@/lib/api-utils';

interface Metrics {
  cpu: number;
  memory: number;
  latency: number;
}

const POLL_INTERVAL = 3_000; // 3 seconds

export const HealthMetricsCard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>({ cpu: 0, memory: 0, latency: 0 });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      try {
        const data = await apiRequest<Metrics>('/api/v1/system/metrics', {
          signal: abortRef.current.signal,
          label: 'System Metrics'
        });
        setMetrics(data);
      } catch (err: any) {
        if (err?.message?.includes('499') || err?.name === 'AbortError') return;
        console.error('[HealthMetrics] fetch error:', err);
      }
    };

    fetchMetrics();
    const int = setInterval(fetchMetrics, POLL_INTERVAL);
    return () => {
      clearInterval(int);
      abortRef.current?.abort();
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricBox icon={Cpu} label="CPU USAGE" value={`${metrics.cpu}%`} color="text-blue-400" />
      <MetricBox icon={Database} label="MEMORY" value={`${metrics.memory}%`} color="text-purple-400" />
      <MetricBox icon={Network} label="LATENCY" value={`${metrics.latency}ms`} color="text-emerald-400" />
    </div>
  );
};

const MetricBox = ({ icon: Icon, label, value, color }: any) => (
  <div className="p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
      <Icon className="w-4 h-4" /> {label}
    </div>
    <div className={`text-2xl font-black ${color}`}>{value}</div>
  </div>
);

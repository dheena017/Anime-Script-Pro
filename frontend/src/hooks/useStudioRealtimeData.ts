import { useEffect, useMemo, useState } from 'react';
import { engineApi, EngineConfig } from '@/services/api/engine';
import { logsApi, SystemLog } from '@/services/api/logs';

export type StudioRealtimeDataState = {
  engineConfig: EngineConfig | null;
  recentLogs: SystemLog[];
  isLoading: boolean;
  lastSyncedAt: string | null;
};

const STUDIO_SYNC_INTERVAL = 15000;

export const useStudioRealtimeData = (userId?: string) => {
  const [engineConfig, setEngineConfig] = useState<EngineConfig | null>(null);
  const [recentLogs, setRecentLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const syncStudioData = async () => {
      setIsLoading(true);

      try {
        const [config, logs] = await Promise.all([
          engineApi.getConfig(userId),
          logsApi.getLogs(12),
        ]);

        if (!isMounted) return;

        setEngineConfig(config);
        setRecentLogs(logs);
        setLastSyncedAt(new Date().toISOString());
      } catch (error) {
        console.error('Studio realtime sync failed:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    syncStudioData();
    const interval = setInterval(syncStudioData, STUDIO_SYNC_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  return useMemo<StudioRealtimeDataState>(() => ({
    engineConfig,
    recentLogs,
    isLoading,
    lastSyncedAt,
  }), [engineConfig, recentLogs, isLoading, lastSyncedAt]);
};

import { useEffect, useState } from 'react';
import { logsApi, SystemLog } from '@/services/api/logs';

export interface GenerationLog {
  id: string | number;
  created_at: string;
  module: string;
  status: string;
  message?: string;
}

export const useRealtimeLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsRefreshing(true);
      try {
        const data = await logsApi.getLogs(20);
        setLogs(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchLogs();

    // Poll for new logs every 30 seconds since we are removing Supabase Realtime
    const interval = setInterval(fetchLogs, 30000);

    return () => clearInterval(interval);
  }, []);

  return Object.assign(logs, { isRefreshing });
};





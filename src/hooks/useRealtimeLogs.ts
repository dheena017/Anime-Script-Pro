import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';

export interface GenerationLog {
  id: string;
  created_at: string;
  module: string;
  status: string;
  model_used?: string;
  project_id?: string;
  user_prompt?: string;
}

export const useRealtimeLogs = () => {
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of the latest 20 logs
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('generation_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching logs:', error);
          return;
        }

        if (data) {
          setLogs(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchLogs();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('generation_logs_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'generation_logs',
        },
        (payload) => {
          console.log('New log received:', payload);
          setLogs((prev) => [payload.new as GenerationLog, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return logs;
};

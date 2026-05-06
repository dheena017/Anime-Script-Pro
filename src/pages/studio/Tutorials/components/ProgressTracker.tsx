import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { apiRequest } from '@/lib/api-utils';
import { useAuth } from '@/hooks/useAuth';

const POLL_INTERVAL = 30_000; // 30 seconds

export const ProgressTracker: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchProgress = async () => {
    if (!user?.id) return;
    try {
      const data = await apiRequest<{ completionPercentage: number }>(
        `/api/v1/tutorials/progress?user_id=${user.id}`,
        { label: 'Tutorial Progress' }
      );
      setProgress(data.completionPercentage || 0);
    } catch (err) {
      console.error('[ProgressTracker] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    fetchProgress();
    intervalRef.current = setInterval(fetchProgress, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user?.id]);

  if (loading) return <div className="animate-pulse h-12 bg-white/5 rounded-lg" />;

  return (
    <div className="p-4 border border-emerald-500/20 rounded-xl bg-emerald-500/5">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Academy Progress</h3>
        </div>
        <span className="text-emerald-400 font-mono font-bold">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-emerald-500" />
      </div>
    </div>
  );
};

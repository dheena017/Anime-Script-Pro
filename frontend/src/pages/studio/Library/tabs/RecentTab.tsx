import { Clock, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { libraryApi, LibraryRecentItem } from '@/services/api/library';

export const RecentTab = () => {
  const [items, setItems] = useState<LibraryRecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await libraryApi.fetchRecentActivity(40);
        if (mounted) setItems(data || []);
      } catch (e) {
        console.error('Failed to load recent activity', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="w-12 h-12 border-4 border-[#bd4a4a] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Loading Recent Activity...</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="py-20 text-center space-y-6 bg-zinc-950/40 rounded-[4rem] border border-dashed border-white/5">
        <Clock className="w-20 h-20 text-zinc-900 mx-auto opacity-40" />
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">No Recent Activity</h2>
          <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.4em]">No recent events were recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div key={it.id} className="p-3 bg-zinc-900 rounded-xl border border-white/5 flex items-start gap-4">
          <div className="w-10 text-xs text-zinc-400">{new Date(it.timestamp).toLocaleString()}</div>
          <div className="flex-1">
            <div className="text-sm font-black text-white">{it.title}</div>
            <div className="text-xs text-zinc-500">{it.message}</div>
            <div className="text-xs text-zinc-600 mt-2">Source: {it.source}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTab;

import { Film, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { libraryApi } from '@/services/api/library';

export const StoryboardsTab = () => {
  const [storyboards, setStoryboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await libraryApi.fetchStoryboards();
        if (mounted) setStoryboards(data || []);
      } catch (e) {
        console.error('Failed to load storyboards', e);
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
        <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Loading Storyboards...</p>
      </div>
    );
  }

  if (!storyboards.length) {
    return (
      <div className="py-20 text-center space-y-6 bg-zinc-950/40 rounded-[4rem] border border-dashed border-white/5">
        <Film className="w-20 h-20 text-zinc-900 mx-auto opacity-40" />
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">No Storyboards</h2>
          <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.4em]">No storyboards available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {storyboards.map((sb, idx) => (
        <div key={sb.id || idx} className="p-4 bg-zinc-900 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-24 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
            {sb.image_url ? <img src={sb.image_url} alt={sb.description || 'storyboard'} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-sm">No Image</div>}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-white uppercase tracking-tight">{sb.title || sb.id || 'Storyboard'}</div>
                <div className="text-xs text-zinc-500">{sb.description || ''}</div>
              </div>
              <div className="text-xs text-zinc-600">{sb.created_at ? new Date(sb.created_at).toLocaleString() : ''}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryboardsTab;

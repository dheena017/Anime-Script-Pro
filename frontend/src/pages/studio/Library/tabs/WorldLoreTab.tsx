import { BookOpen, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { libraryApi } from '@/services/api/library';

interface WorldLoreTabProps {
  searchTerm?: string;
  viewMode?: 'grid' | 'list';
  sortBy?: string;
}

export const WorldLoreTab: React.FC<WorldLoreTabProps> = ({ searchTerm }) => {
  const [lore, setLore] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const overview = await libraryApi.fetchOverview();
        if (mounted) setLore(overview.worldLore || null);
      } catch (e) {
        console.error('Failed to load world lore', e);
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
        <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Loading Lore...</p>
      </div>
    );
  }

  if (!lore) {
    return (
      <div className="py-20 text-center space-y-6 bg-zinc-950/40 rounded-[4rem] border border-dashed border-white/5">
        <BookOpen className="w-20 h-20 text-zinc-900 mx-auto opacity-40" />
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">No World Lore</h2>
          <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.4em]">No lore entries are available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5">
        <h3 className="text-lg font-black text-white uppercase tracking-tight">{lore.title || 'World Lore'}</h3>
        <p className="text-xs text-zinc-400 mt-2">{lore.description || lore.summary || 'No description available.'}</p>
      </div>
      {(lore.entries || []).map((entry: any, idx: number) => (
        <div key={entry.id || idx} className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-white uppercase text-sm">{entry.title || `Entry ${idx + 1}`}</div>
              <div className="text-xs text-zinc-500">{entry.type || 'lore'}</div>
            </div>
            <div className="text-xs text-zinc-600">{entry.updated_at ? new Date(entry.updated_at).toLocaleString() : ''}</div>
          </div>
          {entry.body && <p className="mt-3 text-xs text-zinc-400 line-clamp-4">{entry.body}</p>}
        </div>
      ))}
    </div>
  );
};

export default WorldLoreTab;

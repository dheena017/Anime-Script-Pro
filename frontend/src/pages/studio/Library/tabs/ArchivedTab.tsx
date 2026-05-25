import { Archive, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectService } from '@/services/api/projects';

export const ArchivedTab = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await projectService.getProjects(true);
        if (mounted) setProjects(data || []);
      } catch (e) {
        console.error('Failed to load archived projects', e);
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
        <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Loading Archives...</p>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="py-20 text-center space-y-6 bg-zinc-950/40 rounded-[4rem] border border-dashed border-white/5">
        <Archive className="w-20 h-20 text-zinc-900 mx-auto opacity-40" />
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">No Archived Projects</h2>
          <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.4em]">There are no archived projects to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((p) => (
        <div key={p.id} className="p-4 bg-zinc-900 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-white uppercase">{p.title || p.name || `Project ${p.id}`}</div>
            <div className="text-xs text-zinc-500">Archived {p.archived_at ? new Date(p.archived_at).toLocaleDateString() : ''}</div>
          </div>
          <div className="text-xs text-zinc-600">{p.items_count ? `${p.items_count} items` : ''}</div>
        </div>
      ))}
    </div>
  );
};

export default ArchivedTab;

import { Archive, Filter } from 'lucide-react';

export const ArchivedTab = () => {
  return (
    <div className="py-20 text-center space-y-6 bg-zinc-950/40 rounded-[4rem] border border-dashed border-white/5">
      <Archive className="w-20 h-20 text-zinc-900 mx-auto animate-pulse" />
      <div className="space-y-2">
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Archive Node Offline</h2>
        <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.4em]">Deep storage archives are currently being synchronized.</p>
      </div>
      
      <div className="max-w-md mx-auto p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2 bg-studio/10 rounded-lg">
            <Filter className="w-4 h-4 text-studio" />
          </div>
          <div>
            <p className="text-xs font-black text-white uppercase">System Notice</p>
            <p className="text-xs font-bold text-zinc-500 uppercase">Archive retrieval protocols are undergoing maintenance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivedTab;

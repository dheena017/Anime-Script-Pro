import { Layout } from 'lucide-react';

export function StoryboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-zinc-700 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800 max-w-4xl mx-auto">
      <div className="w-24 h-24 bg-zinc-950/60 rounded-2xl flex items-center justify-center mb-8 border border-zinc-800">
        <Layout className="w-10 h-10 opacity-20" />
      </div>
      <h3 className="text-xl font-serif italic text-zinc-600 mb-2">The canvas is blank</h3>
      <p className="text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black">Generate a production script to begin boarding</p>
    </div>
  );
}

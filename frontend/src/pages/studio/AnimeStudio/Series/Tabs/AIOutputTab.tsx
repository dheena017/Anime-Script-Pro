import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AIOutputTabProps {
  plan?: any[];
  script?: string | null;
}

export const AIOutputTab: React.FC<AIOutputTabProps> = ({ plan = [], script }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const hasPlan = plan.length > 0;
  const hasScript = Boolean(script && script.trim().length > 0);
  const hasOutput = hasScript || hasPlan;

  React.useEffect(() => {
    if (selectedIndex >= plan.length) {
      setSelectedIndex(Math.max(0, plan.length - 1));
    }
  }, [plan.length, selectedIndex]);

  const selectedEpisode = hasPlan ? plan[selectedIndex] : undefined;
  const rawOutput = script || (hasPlan ? JSON.stringify(plan, null, 2) : '');

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-black uppercase tracking-[0.2em] text-cyan-200">AI Output</h2>
        <p className="text-sm text-slate-400">Review the latest generated AI series output one item at a time. Use the controls to step through generated episodes or view the raw script.</p>
      </div>

      {!hasOutput ? (
        <Card className="border border-dashed border-slate-700 bg-slate-950/80 p-8 text-slate-400">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-200">No AI output is available yet.</p>
            <p className="text-sm text-slate-400">Generate a series blueprint or load an existing plan to display the AI output here.</p>
          </div>
        </Card>
      ) : hasPlan ? (
        <Card className="overflow-hidden bg-slate-900/90">
          <div className="px-6 py-4 border-b border-slate-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Episode {selectedIndex + 1} of {plan.length}</p>
              <h3 className="text-lg font-black text-white">{selectedEpisode?.title || `Episode ${String(selectedIndex + 1).padStart(2, '0')}`}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedIndex <= 0}
                onClick={() => setSelectedIndex((prev) => Math.max(prev - 1, 0))}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Prev
              </button>
              <button
                type="button"
                disabled={selectedIndex >= plan.length - 1}
                onClick={() => setSelectedIndex((prev) => Math.min(prev + 1, plan.length - 1))}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-slate-300">{selectedEpisode?.summary || selectedEpisode?.hook || 'No summary is available for this episode yet.'}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-200">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Episode ID</p>
                  <p className="mt-2 font-black">{selectedEpisode?.episode ?? String(selectedIndex + 1).padStart(2, '0')}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-200">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Scene Count</p>
                  <p className="mt-2 font-black">{selectedEpisode?.asset_matrix?.scene_count ?? 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950/80 p-4 overflow-auto max-h-[calc(100vh-380px)]">
              <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-100">{JSON.stringify(selectedEpisode, null, 2)}</pre>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-slate-900/90">
          <div className="px-6 py-4 border-b border-slate-800">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Raw Script Output</p>
          </div>
          <pre className="max-h-[calc(100vh-320px)] overflow-auto whitespace-pre-wrap break-words bg-slate-950 px-6 py-5 text-sm leading-6 text-slate-100">
            {rawOutput}
          </pre>
        </Card>
      )}
    </div>
  );
};

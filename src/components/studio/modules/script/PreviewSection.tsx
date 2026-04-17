import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewSectionProps {
  generatedScript: string;
  previewScrollRef: React.RefObject<HTMLDivElement | null>;
  isLorePending: boolean;
  loreCandidatesCount: number;
}

export function PreviewSection({
  generatedScript,
  previewScrollRef,
  isLorePending,
  loreCandidatesCount,
}: PreviewSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Lore / Bible Preview</p>
        <p className="text-[10px] text-zinc-600">
          {isLorePending ? 'Building lore map...' : `${loreCandidatesCount} entities detected`}
        </p>
      </div>
      <div ref={previewScrollRef} className="min-h-[550px] rounded-xl border border-zinc-800/60 bg-black/30 p-4 overflow-auto">
        {generatedScript ? (
          <div className="prose prose-invert prose-red max-w-none prose-table:border-collapse prose-th:border prose-th:border-zinc-800 prose-th:bg-zinc-900/80 prose-th:p-3 prose-th:text-left prose-td:border prose-td:border-zinc-800/50 prose-td:p-4 prose-td:align-top">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScript}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full min-h-[500px] items-center justify-center text-zinc-600 text-sm">
            Generate or load a script to see lore and locations highlighted here.
          </div>
        )}
      </div>
    </div>
  );
}

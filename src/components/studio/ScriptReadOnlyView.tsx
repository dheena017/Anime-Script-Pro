import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles } from 'lucide-react';

interface ScriptReadOnlyViewProps {
  isLoading: boolean;
  generatedScript: string;
}

export function ScriptReadOnlyView({ isLoading, generatedScript }: ScriptReadOnlyViewProps) {
  return (
    <div className="prose prose-invert prose-red max-w-none prose-table:border-collapse prose-th:border prose-th:border-zinc-800 prose-th:bg-zinc-900/80 prose-th:p-3 prose-th:text-left prose-td:border prose-td:border-zinc-800/50 prose-td:p-4 prose-td:align-top">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4" />
          <p>Generating your masterpiece...</p>
        </div>
      ) : generatedScript ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScript}</ReactMarkdown>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
          <Sparkles className="w-12 h-12 mb-4 opacity-20" />
          <p>Generate a script to see it here.</p>
        </div>
      )}
    </div>
  );
}

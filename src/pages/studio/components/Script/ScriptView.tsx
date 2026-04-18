import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clapperboard, Hash, Users } from 'lucide-react';

interface ScriptViewProps {
  generatedScript: string;
  prompt: string;
  session: string;
  episode: string;
  audience: string;
}

export const ScriptView: React.FC<ScriptViewProps> = ({
  generatedScript,
  prompt,
  session,
  episode,
  audience
}) => {
  return (
    <div className="space-y-12">
      <div className="border-b border-cyan-500/20 pb-12 mb-12 text-center space-y-4 relative">
        <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          Official Production Script
        </div>
        <h1 className="text-4xl font-black text-cyan-50 leading-tight uppercase tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          {prompt?.split(' ').slice(0, 5).join(' ') || "Untitled Sequence"}
        </h1>
        <div className="flex items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-cyan-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <Clapperboard className="w-3 h-3 text-cyan-400" />
            Session {session}
          </span>
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-fuchsia-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <Hash className="w-3 h-3 text-fuchsia-400" />
            Episode {episode}
          </span>
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-teal-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <Users className="w-3 h-3 text-teal-400" />
            {audience}
          </span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none 
        prose-table:border-separate prose-table:border-spacing-0 prose-table:shadow-[0_0_30px_rgba(0,0,0,0.8)] prose-table:rounded-xl prose-table:overflow-hidden prose-table:border prose-table:border-cyan-500/20
        prose-th:bg-[#0a0a0a] prose-th:text-cyan-400 prose-th:font-black prose-th:p-4 prose-th:text-left prose-th:border-b prose-th:border-cyan-500/30 prose-th:text-[10px] prose-th:uppercase prose-th:tracking-[0.2em] prose-th:font-sans
        prose-td:p-5 prose-td:border-b prose-td:border-zinc-800/50 prose-td:text-[13px] prose-td:text-zinc-300 prose-td:align-top prose-td:leading-relaxed prose-td:font-sans prose-td:bg-[#050505]/50
        prose-tr:hover:td:bg-cyan-900/10 prose-tr:hover:td:text-cyan-50
        prose-h1:font-sans prose-h1:font-black prose-h1:tracking-tight prose-h1:text-cyan-100 prose-h1:uppercase
        prose-h2:font-sans prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-cyan-200 prose-h2:uppercase
        prose-h3:font-sans prose-h3:font-bold prose-h3:tracking-tight prose-h3:text-cyan-300 prose-h3:uppercase
        prose-strong:text-cyan-400 prose-strong:font-bold prose-strong:tracking-wide
        overflow-x-auto no-scrollbar"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScript}</ReactMarkdown>
      </div>

      <div className="mt-24 pt-12 border-t border-cyan-500/10 text-center">
        <p className="text-[10px] text-cyan-500/50 uppercase tracking-[0.5em] font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.2)]">
          End of Sequence
        </p>
      </div>
    </div>
  );
};

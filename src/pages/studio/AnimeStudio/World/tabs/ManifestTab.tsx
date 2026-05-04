import React, { useMemo } from 'react';
import { FileText, Download, ClipboardList, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ManifestTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export const ManifestTab: React.FC<ManifestTabProps> = ({
  isEditing,
  content,
  onContentChange,
  onGenerate,
  isGenerating
}) => {
  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "World_Bible_Full_Report.md";
    document.body.appendChild(element);
    element.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('Full World Bible copied to clipboard!');
  };

  // Memoize markdown to prevent re-renders on scroll or state changes
  const MemoizedMarkdown = useMemo(() => (
    <ReactMarkdown>{content}</ReactMarkdown>
  ), [content]);

  return (
    <div className="world-container will-change-transform transform-gpu">
      <div className="world-header">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="world-badge bg-zinc-500/10 border-zinc-500/20">
              <FileText className="w-3 h-3 text-zinc-400" />
              <span className="world-badge-text text-zinc-400">Master Source</span>
            </div>
            <h1 className="world-header-title">
              WORLD BIBLE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 uppercase">FULL MANIFEST</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onGenerate && (
              <button 
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-full transition-all group disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">Synthesize</span>
              </button>
            )}
            
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
            >
              <ClipboardList className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest">Copy Raw</span>
            </button>
            <button 
              onClick={downloadReport}
              className="flex items-center gap-2 px-5 py-2.5 bg-studio/10 hover:bg-studio/20 border border-studio/20 rounded-full transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-studio group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-studio uppercase tracking-widest">Download .MD</span>
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="world-textarea min-h-[800px]"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your comprehensive world bible here..."
        />
      ) : (
        <div className="world-content-area !block">
          <div className="world-main-column !w-full max-w-5xl mx-auto">
            <div className="bg-[#050505]/80 border border-white/5 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
              <div className="world-prose max-w-none" style={{ '--prose-accent-color': '#a1a1aa' } as React.CSSProperties}>
                {MemoizedMarkdown}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

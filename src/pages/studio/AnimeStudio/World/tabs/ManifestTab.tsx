import React, { useMemo } from 'react';
import { FileText, Download, ClipboardList, Sparkles, Bold, Italic, Heading2, Code, List, Quote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { studioLog } from '@/lib/studio-logger';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';

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
  const { textareaRef, scheduleResizeTextarea } = useAutoResizeTextarea(content || '', isEditing);

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [content]);

  const charCount = content.length;
  const lineCount = content.split('\n').length;

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    onContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
      scheduleResizeTextarea();
    }, 0);
  };

  const downloadReport = () => {
    studioLog('ManifestTab', 'Exporting World Bible Full Report...', 'info');
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "World_Bible_Full_Report.md";
    document.body.appendChild(element);
    element.click();
    studioLog('ManifestTab', 'World Bible Full Report export initiated.', 'success');
  };

  const copyToClipboard = () => {
    studioLog('ManifestTab', 'Copying World Bible to clipboard...', 'info');
    navigator.clipboard.writeText(content);
    studioLog('ManifestTab', 'World Bible copied successfully.', 'success');
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
          <div className="space-y-4">
            <div className="world-badge bg-zinc-500/10 border-zinc-500/20">
              <FileText className="w-3 h-3 text-zinc-400" />
              <span className="world-badge-text text-zinc-400">Master Source</span>
            </div>
            <h1 className="world-header-title">
              WORLD BIBLE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio via-studio/80 to-studio/60 uppercase text-2xl lg:text-3xl">FULL MANIFEST</span>
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold">Complete worldbuilding specification</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {onGenerate && (
              <button 
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-studio to-studio/80 text-black hover:from-studio hover:to-studio font-black uppercase tracking-widest text-[10px] rounded-full transition-all group disabled:opacity-50 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
                <span>Regenerate</span>
              </button>
            )}
            
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-studio/50 rounded-full transition-all group"
            >
              <ClipboardList className="w-3.5 h-3.5 text-zinc-400 group-hover:text-studio transition-colors" />
              <span className="text-[10px] font-black text-zinc-400 group-hover:text-studio uppercase tracking-widest">Copy</span>
            </button>
            <button 
              onClick={downloadReport}
              className="flex items-center gap-2 px-5 py-2.5 bg-studio/10 hover:bg-studio/20 border border-studio/20 hover:border-studio/50 rounded-full transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-studio group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-studio uppercase tracking-widest">Export</span>
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="relative space-y-4">
          {/* Edit Mode Header */}
          <div className="flex items-center justify-between p-4 bg-studio/10 border border-studio/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-studio animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-studio">Edit Mode Active</span>
            </div>
            <span className="text-xs text-zinc-500 font-mono">{lineCount} lines</span>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <button
              onClick={() => insertMarkdown('**', '**')}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-studio/20 border border-white/10 hover:border-studio/50 rounded-lg transition-all group"
              title="Bold (Cmd+B)"
            >
              <Bold className="w-4 h-4 text-zinc-400 group-hover:text-studio" />
              <span className="text-xs font-bold text-zinc-400 group-hover:text-studio">Bold</span>
            </button>
            
            <button
              onClick={() => insertMarkdown('_', '_')}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-studio/20 border border-white/10 hover:border-studio/50 rounded-lg transition-all group"
              title="Italic (Cmd+I)"
            >
              <Italic className="w-4 h-4 text-zinc-400 group-hover:text-studio" />
              <span className="text-xs font-bold text-zinc-400 group-hover:text-studio">Italic</span>
            </button>

            <div className="w-px bg-white/10" />

            <button
              onClick={() => insertMarkdown('## ', '\n')}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-studio/20 border border-white/10 hover:border-studio/50 rounded-lg transition-all group"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4 text-zinc-400 group-hover:text-studio" />
              <span className="text-xs font-bold text-zinc-400 group-hover:text-studio">H2</span>
            </button>

            <button
              onClick={() => insertMarkdown('`', '`')}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-studio/20 border border-white/10 hover:border-studio/50 rounded-lg transition-all group"
              title="Code"
            >
              <Code className="w-4 h-4 text-zinc-400 group-hover:text-studio" />
              <span className="text-xs font-bold text-zinc-400 group-hover:text-studio">Code</span>
            </button>

            <button
              onClick={() => insertMarkdown('- ', '\n')}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-studio/20 border border-white/10 hover:border-studio/50 rounded-lg transition-all group"
              title="Bullet List"
            >
              <List className="w-4 h-4 text-zinc-400 group-hover:text-studio" />
              <span className="text-xs font-bold text-zinc-400 group-hover:text-studio">List</span>
            </button>

            <button
              onClick={() => insertMarkdown('> ', '\n')}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-studio/20 border border-white/10 hover:border-studio/50 rounded-lg transition-all group"
              title="Quote"
            >
              <Quote className="w-4 h-4 text-zinc-400 group-hover:text-studio" />
              <span className="text-xs font-bold text-zinc-400 group-hover:text-studio">Quote</span>
            </button>

            <div className="flex-1" />
            <div className="flex items-center gap-4 text-xs text-zinc-500 px-2">
              <span className="font-mono">{charCount.toLocaleString()} chars</span>
              <span className="font-mono">{wordCount.toLocaleString()} words</span>
            </div>
          </div>

          {/* Enhanced Textarea */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-studio/30 to-studio/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-studio/10 via-transparent to-studio/5 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 rounded-b-2xl bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-transparent" />
            <textarea
              ref={textareaRef}
              className="world-textarea relative w-full min-h-[500px] p-6 bg-zinc-950/50 border border-studio/30 rounded-2xl text-zinc-100 placeholder-zinc-600 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-studio/50 focus:border-studio/50 resize-none overflow-hidden backdrop-blur-sm transition-all duration-200 group-hover:border-studio/50"
              value={content || ''}
              onChange={(e) => {
                onContentChange(e.target.value);
                scheduleResizeTextarea();
              }}
              onInput={scheduleResizeTextarea}
              onPaste={scheduleResizeTextarea}
              placeholder="Edit your comprehensive world bible here...

Use markdown formatting:
• **Bold** for emphasis
• _Italic_ for subtle text
• ## Headings for sections
• `Code` for technical terms
• - Lists for items
• > Quotes for important notes"
              spellCheck="true"
            />
          </div>

          {/* Editor Footer */}
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="font-mono">Markdown enabled</span>
              <span>•</span>
              <span>Ctrl+Enter to format</span>
            </div>
            <span className="text-studio font-bold">Live preview on save</span>
          </div>
        </div>
      ) : (
        <div className="world-content-area relative">
          {/* Blueprint Background */}
          <div className="absolute inset-0 world-bible-blueprint pointer-events-none opacity-30 rounded-3xl" />
          
          {/* Content */}
          <div className="world-main-column relative z-10">
            <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl p-8 lg:p-16 backdrop-blur-sm relative overflow-hidden group">
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-studio/0 via-studio/[0.02] to-studio/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
              
              <div className="world-prose max-w-none relative z-10">
                {MemoizedMarkdown}
              </div>

              {/* Terminal Footer */}
              <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-70 transition-opacity">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">End of Transmission</span>
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">World Builder v2.0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

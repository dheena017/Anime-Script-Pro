import React, { useMemo } from 'react';
import { Bold, Italic, Heading2, Code, List, Quote } from 'lucide-react';
import { useAutoResizeTextarea } from '../World/hooks/useAutoResizeTextarea';
import { cn } from '@/lib/utils';

interface StudioEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  isEditing: boolean;
  placeholder?: string;
  className?: string;
  statsClassName?: string;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  content,
  onContentChange,
  isEditing,
  placeholder = "Start writing your masterpiece here...",
  className,
  statsClassName
}) => {
  const { textareaRef, scheduleResizeTextarea } = useAutoResizeTextarea(content || '', isEditing);

  const wordCount = useMemo(() => {
    return (content || '').trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [content]);

  const charCount = (content || '').length;
  const lineCount = (content || '').split('\n').length;

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = (content || '').substring(start, end) || 'text';
    const newContent = 
      (content || '').substring(0, start) + 
      before + selectedText + after + 
      (content || '').substring(end);
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

  if (!isEditing) return null;

  return (
    <div className={cn("relative space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
      {/* Edit Mode Header */}
      <div className="flex items-center justify-between p-4 bg-studio/10 border border-studio/30 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(var(--studio-rgb),0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-studio animate-pulse shadow-[0_0_8px_rgba(var(--studio-rgb),0.8)]" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-studio">Edit Mode Active</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest">{lineCount} lines</span>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => insertMarkdown('**', '**')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-studio/20 rounded-lg transition-all group border border-transparent hover:border-studio/30"
            title="Bold (Cmd+B)"
          >
            <Bold className="w-3.5 h-3.5 text-zinc-400 group-hover:text-studio group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-studio uppercase tracking-wider">Bold</span>
          </button>
          
          <button
            onClick={() => insertMarkdown('_', '_')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-studio/20 rounded-lg transition-all group border border-transparent hover:border-studio/30"
            title="Italic (Cmd+I)"
          >
            <Italic className="w-3.5 h-3.5 text-zinc-400 group-hover:text-studio group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-studio uppercase tracking-wider">Italic</span>
          </button>
        </div>

        <div className="w-px h-8 bg-white/10 mx-1" />

        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => insertMarkdown('## ', '\n')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-studio/20 rounded-lg transition-all group border border-transparent hover:border-studio/30"
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-studio group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-studio uppercase tracking-wider">H2</span>
          </button>

          <button
            onClick={() => insertMarkdown('`', '`')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-studio/20 rounded-lg transition-all group border border-transparent hover:border-studio/30"
            title="Code"
          >
            <Code className="w-3.5 h-3.5 text-zinc-400 group-hover:text-studio group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-studio uppercase tracking-wider">Code</span>
          </button>

          <button
            onClick={() => insertMarkdown('- ', '\n')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-studio/20 rounded-lg transition-all group border border-transparent hover:border-studio/30"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5 text-zinc-400 group-hover:text-studio group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-studio uppercase tracking-wider">List</span>
          </button>

          <button
            onClick={() => insertMarkdown('> ', '\n')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-studio/20 rounded-lg transition-all group border border-transparent hover:border-studio/30"
            title="Quote"
          >
            <Quote className="w-3.5 h-3.5 text-zinc-400 group-hover:text-studio group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-studio uppercase tracking-wider">Quote</span>
          </button>
        </div>

        <div className="flex-1" />
        <div className={cn("flex items-center gap-4 text-[10px] text-zinc-500 px-4 font-mono font-bold uppercase tracking-widest", statsClassName)}>
          <span className="flex items-center gap-1.5"><span className="text-zinc-400">{charCount.toLocaleString()}</span> chars</span>
          <span className="flex items-center gap-1.5"><span className="text-zinc-400">{wordCount.toLocaleString()}</span> words</span>
        </div>
      </div>

      {/* Enhanced Textarea */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-studio/30 to-studio/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-studio/10 via-transparent to-studio/5 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        
        <textarea
          ref={textareaRef}
          className="world-textarea relative w-full min-h-[500px] p-8 bg-zinc-950/80 border border-studio/30 rounded-2xl text-zinc-100 placeholder-zinc-700 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-studio/50 focus:border-studio/50 resize-none overflow-hidden backdrop-blur-xl transition-all duration-300 group-hover:border-studio/50 selection:bg-studio/30 shadow-2xl"
          value={content || ''}
          onChange={(e) => {
            onContentChange(e.target.value);
            scheduleResizeTextarea();
          }}
          onInput={scheduleResizeTextarea}
          onPaste={scheduleResizeTextarea}
          placeholder={placeholder}
          spellCheck="false"
        />
        
        {/* Decorative corner elements like in the image */}
        <div className="absolute top-4 right-4 flex gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
          <div className="w-1 h-1 rounded-full bg-studio" />
          <div className="w-1 h-1 rounded-full bg-studio/50" />
          <div className="w-1 h-1 rounded-full bg-studio/20" />
        </div>
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span>Markdown enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-amber-500" />
            <span>Ctrl+Enter to format</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-studio">
          <div className="w-1 h-1 rounded-full bg-studio animate-pulse" />
          <span>Live preview on save</span>
        </div>
      </div>
    </div>
  );
};

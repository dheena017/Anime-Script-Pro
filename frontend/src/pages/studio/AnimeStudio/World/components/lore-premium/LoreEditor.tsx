import React, { useMemo } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Code,
  List,
  Quote,
  Sparkles,
} from "lucide-react";
import { useAutoResizeTextarea } from "../../hooks/useAutoResizeTextarea";
import { worldStyles as s } from "../../worldStyles";

interface LoreEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
  accentColor?: string;
}

export const LoreEditor: React.FC<LoreEditorProps> = ({
  content,
  onContentChange,
  placeholder = "Edit your world lore here...",
  accentColor = "#06b6d4", // Default studio cyan
}) => {
  const { textareaRef, scheduleResizeTextarea } = useAutoResizeTextarea(
    content || "",
    true,
  );

  const wordCount = useMemo(() => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }, [content]);

  const charCount = content.length;
  const lineCount = content.split("\n").length;

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || "text";
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);
    onContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      );
      scheduleResizeTextarea();
    }, 0);
  };

  return (
    <div className="relative space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Edit Mode Header */}
      <div
        className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md"
        style={{ borderColor: `${accentColor}30` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            Edit Mode Active
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
          <span className="font-mono">{lineCount} lines</span>
          <span>•</span>
          <span className="font-mono">{charCount.toLocaleString()} chars</span>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md">
        {[
          {
            icon: Bold,
            label: "Bold",
            action: () => insertMarkdown("**", "**"),
          },
          {
            icon: Italic,
            label: "Italic",
            action: () => insertMarkdown("_", "_"),
          },
          {
            icon: Heading2,
            label: "H2",
            action: () => insertMarkdown("## ", "\n"),
          },
          { icon: Code, label: "Code", action: () => insertMarkdown("`", "`") },
          {
            icon: List,
            label: "List",
            action: () => insertMarkdown("- ", "\n"),
          },
          {
            icon: Quote,
            label: "Quote",
            action: () => insertMarkdown("> ", "\n"),
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className={s.actionToolbarButton}
          >
            <btn.icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            <span className="text-xs font-bold text-zinc-500 group-hover:text-white transition-colors uppercase tracking-widest">
              {btn.label}
            </span>
          </button>
        ))}
      </div>

      {/* Enhanced Textarea */}
      <div className="relative group">
        <div
          className="absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          }}
        />
        <textarea
          ref={textareaRef}
          className="relative w-full min-h-[400px] p-8 bg-zinc-950/50 border border-white/10 rounded-3xl text-zinc-100 placeholder-zinc-700 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 resize-none overflow-hidden backdrop-blur-sm transition-all duration-300"
          style={{ caretColor: accentColor }}
          value={content || ""}
          onChange={(e) => {
            onContentChange(e.target.value);
            scheduleResizeTextarea();
          }}
          onInput={scheduleResizeTextarea}
          placeholder={placeholder}
          spellCheck="true"
        />
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between p-3 bg-black/20 border border-white/5 rounded-xl text-xs text-zinc-600 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" style={{ color: accentColor }} />{" "}
            Markdown Enabled
          </span>
          <span>•</span>
          <span>Live preview on save</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{wordCount.toLocaleString()} Words</span>
        </div>
      </div>
    </div>
  );
};

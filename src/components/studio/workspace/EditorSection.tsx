import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EditorSectionProps {
  generatedScript: string;
  editorScrollRef: React.RefObject<HTMLPreElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onScriptChange: (val: string) => void;
  onSelectionSync: () => void;
  onScroll: () => void;
  renderHighlightedEditor: (text: string) => React.ReactNode;
  onContextMenu: (e: React.MouseEvent) => void;
  selectionText: string;
}

export function EditorSection({
  generatedScript,
  editorScrollRef,
  textareaRef,
  onScriptChange,
  onSelectionSync,
  onScroll,
  renderHighlightedEditor,
  onContextMenu,
  selectionText,
}: EditorSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Editor</p>
        <p className="text-[10px] text-zinc-600">
          {selectionText.trim() ? `${selectionText.length} characters selected` : 'No selection yet'}
        </p>
      </div>
      <div 
        className="relative min-h-[550px] rounded-xl border border-zinc-800/60 bg-black/30 overflow-hidden"
        onContextMenu={onContextMenu}
      >
        <pre
          ref={editorScrollRef}
          className="pointer-events-none absolute inset-0 overflow-auto px-4 py-4 font-mono text-sm leading-7 whitespace-pre-wrap break-words text-zinc-500"
        >
          {renderHighlightedEditor(generatedScript || '')}
        </pre>
        <Textarea 
          ref={textareaRef}
          className="relative z-10 min-h-[550px] bg-transparent border-none focus-visible:ring-0 text-transparent caret-red-400 font-mono text-sm leading-7 resize-none placeholder:text-zinc-700"
          value={generatedScript || ''}
          onChange={(e) => onScriptChange(e.target.value)}
          onSelect={onSelectionSync}
          onMouseUp={onSelectionSync}
          onKeyUp={onSelectionSync}
          onScroll={onScroll}
          onFocus={onSelectionSync}
          placeholder="Highlight a paragraph, then use AI Writing Assist to expand, condense, or reformat the script."
        />
      </div>
    </div>
  );
}

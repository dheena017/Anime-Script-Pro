import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ScriptFocusModeProps {
  generatedScript: string;
  editorScrollRef: React.RefObject<HTMLPreElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onExit: () => void;
  onChange: (nextValue: string) => void;
  onSyncSelectAndScroll: () => void;
  onScroll: () => void;
  renderHighlightedEditor: (text: string) => React.ReactNode;
}

export function ScriptFocusMode({
  generatedScript,
  editorScrollRef,
  textareaRef,
  onExit,
  onChange,
  onSyncSelectAndScroll,
  onScroll,
  renderHighlightedEditor,
}: ScriptFocusModeProps) {
  return (
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.12),_transparent_34%),linear-gradient(180deg,_rgba(9,9,11,0.98),_rgba(3,7,18,0.99))]">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div className="flex items-center gap-2 text-red-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-[0.25em]">Focus Mode</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 bg-black/50 text-zinc-300 hover:bg-zinc-900"
          onClick={onExit}
        >
          Exit Focus
        </Button>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-6 md:px-6">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
          <Card className="w-full border-zinc-800 bg-black/35 backdrop-blur-xl shadow-[0_0_80px_rgba(0,0,0,0.45)]">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono uppercase tracking-[0.25em]">
                <Clock className="w-3 h-3" />
                Vertical Centering Enabled
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Highlighted line stays centered
              </div>
            </div>
            <div className="relative h-[78vh]">
              <div className="absolute inset-0 overflow-hidden">
                <pre
                  ref={editorScrollRef}
                  className="pointer-events-none h-full overflow-auto px-8 py-[38vh] font-mono text-sm leading-7 text-zinc-500 whitespace-pre-wrap break-words"
                >
                  {renderHighlightedEditor(generatedScript)}
                </pre>
              </div>
              <Textarea
                ref={textareaRef}
                className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent px-8 py-[38vh] font-mono text-sm leading-7 text-transparent caret-red-400 outline-none focus-visible:ring-0 placeholder:text-zinc-700"
                value={generatedScript}
                onChange={(e) => onChange(e.target.value)}
                onSelect={onSyncSelectAndScroll}
                onMouseUp={onSyncSelectAndScroll}
                onKeyUp={onSyncSelectAndScroll}
                onScroll={onScroll}
                placeholder="Type here..."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

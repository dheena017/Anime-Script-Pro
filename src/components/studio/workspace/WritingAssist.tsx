import { Button } from '@/components/ui/button';
import { Mic2, Boxes, Languages, FileOutput } from 'lucide-react';

interface WritingAssistProps {
  selectedText: string;
  isExpanding: boolean;
  isCondensing: boolean;
  isFormattingScreenplay: boolean;
  isFormattingAnime: boolean;
  isGeneratingBreakdown: boolean;
  isAnalyzingPacing: boolean;
  isTranslating: boolean;
  hasScript: boolean;
  onRewrite: (mode: 'expand' | 'condense') => void;
  onFormat: (format: 'screenplay' | 'anime') => void;
  onExportSides: () => void;
  onExportNotes: () => void;
  onGenerateBreakdown: () => void;
  onAnalyzePacing: () => void;
  onTranslate: (lang: string) => void;
}

export function WritingAssist({
  selectedText,
  isExpanding,
  isCondensing,
  isFormattingScreenplay,
  isFormattingAnime,
  isGeneratingBreakdown,
  isAnalyzingPacing,
  hasScript,
  onRewrite,
  onFormat,
  onExportSides,
  onGenerateBreakdown,
  onAnalyzePacing,
}: WritingAssistProps) {
  const hasSelection = selectedText.trim().length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-red-500/10 bg-black/30 p-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mr-2">AI Writing Assist</span>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-white/10 bg-zinc-950/60 text-zinc-300 hover:bg-zinc-900"
        onClick={() => onRewrite('expand')}
        disabled={!hasSelection || isExpanding}
      >
        {isExpanding ? 'Expanding...' : 'Expand Selection'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-white/10 bg-zinc-950/60 text-zinc-300 hover:bg-zinc-900"
        onClick={() => onRewrite('condense')}
        disabled={!hasSelection || isCondensing}
      >
        {isCondensing ? 'Condensing...' : 'Condense Selection'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15"
        onClick={() => onFormat('screenplay')}
        disabled={isFormattingScreenplay || isFormattingAnime}
      >
        {isFormattingScreenplay ? 'Formatting...' : 'Format as Screenplay'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15"
        onClick={() => onFormat('anime')}
        disabled={isFormattingScreenplay || isFormattingAnime}
      >
        {isFormattingAnime ? 'Formatting...' : 'Format as Anime Script'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-cyan-500/20 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/15"
        onClick={onExportSides}
        disabled={!hasScript}
      >
        <Mic2 className="w-3.5 h-3.5 mr-1.5" />
        Export Sides
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
        onClick={onGenerateBreakdown}
        disabled={!hasScript || isGeneratingBreakdown}
      >
        <Boxes className="w-3.5 h-3.5 mr-1.5" />
        {isGeneratingBreakdown ? 'Breaking Down...' : 'Auto Scene Breakdown'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-purple-500/20 bg-purple-500/10 text-purple-300 hover:bg-purple-500/15"
        onClick={onAnalyzePacing}
        disabled={!hasScript || isAnalyzingPacing}
      >
        {isAnalyzingPacing ? 'Analyzing...' : 'Fix the Pacing'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-indigo-500/20 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/15"
        onClick={() => onTranslate('Japanese')}
        disabled={!hasScript || isTranslating}
      >
        <Languages className="w-3.5 h-3.5 mr-1.5" />
        {isTranslating ? 'Translating...' : 'Translate (JP)'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-zinc-500/20 bg-zinc-500/10 text-zinc-300 hover:bg-zinc-500/15"
        onClick={onExportNotes}
        disabled={!hasScript}
      >
        <FileOutput className="w-3.5 h-3.5 mr-1.5" />
        Export Director's Notes
      </Button>
      <div className="ml-auto text-[10px] text-zinc-500 uppercase tracking-widest">
        {hasSelection ? 'Highlight a passage to rewrite it' : 'Select text to unlock paragraph rewrites'}
      </div>
    </div>
  );
}

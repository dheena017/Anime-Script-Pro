import { Sparkles, Search, Image as ImageIcon, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScriptQuickActionsProps {
  hasScript: boolean;
  isContinuingScript: boolean;
  isGeneratingMetadata: boolean;
  isGeneratingImagePrompts: boolean;
  onContinue: () => void;
  onGenerateSeo: () => void;
  onGeneratePrompts: () => void;
  onListen: () => void;
}

export function ScriptQuickActions({
  hasScript,
  isContinuingScript,
  isGeneratingMetadata,
  isGeneratingImagePrompts,
  onContinue,
  onGenerateSeo,
  onGeneratePrompts,
  onListen,
}: ScriptQuickActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-[10px] text-zinc-400 hover:text-white"
        onClick={onContinue}
        disabled={isContinuingScript || !hasScript}
      >
        {isContinuingScript ? (
          <div className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-1" />
        ) : (
          <Sparkles className="w-3 h-3 mr-1" />
        )}
        Continue
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-[10px] text-zinc-400 hover:text-white"
        onClick={onGenerateSeo}
        disabled={isGeneratingMetadata}
      >
        <Search className="w-3 h-3 mr-1" /> SEO
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-[10px] text-zinc-400 hover:text-white"
        onClick={onGeneratePrompts}
        disabled={isGeneratingImagePrompts}
      >
        <ImageIcon className="w-3 h-3 mr-1" /> Prompts
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-[10px] text-zinc-400 hover:text-white"
        onClick={onListen}
      >
        <Play className="w-3 h-3 mr-1" /> Listen
      </Button>
    </div>
  );
}

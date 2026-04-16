import React from 'react';
import {
  Send,
  UserPlus,
  Layers,
  Layout as LayoutIcon,
  Search,
  Image as ImageIcon,
  HelpCircle,
  Mic,
  Package,
  ScrollText,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudioToolPanelsProps {
  selectedTool?:
    | 'script'
    | 'cast'
    | 'series'
    | 'storyboard'
    | 'seo'
    | 'prompts'
    | 'example'
    | 'template'
    | 'framework'
    | 'whatif'
    | 'audio'
    | 'export';
  canGenerate: boolean;
  isGeneratingScript: boolean;
  isGeneratingCast: boolean;
  isGeneratingSeries: boolean;
  isGeneratingAll?: boolean;
  onGenerateScript: () => void;
  onGenerateCast: () => void;
  onGenerateSeries: () => void;
  onGenerateAll?: () => void;
  onOpenStoryboard: () => void;
  onOpenSeo: () => void;
  onOpenPrompts: () => void;
  onOpenWhatIf: () => void;
  onOpenAudio: () => void;
  onOpenExport: () => void;
  onOpenExample: () => void;
  onOpenTemplate: () => void;
  onOpenFramework: () => void;
}

function ToolButton({
  label,
  icon,
  active,
  onClick,
  loading = false,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      className={[
        'w-full h-10 justify-start gap-2 text-xs font-semibold border-zinc-800 bg-zinc-950/60 text-zinc-300',
        'hover:bg-zinc-900 hover:border-zinc-700',
        active ? 'bg-red-600/90 border-red-500 text-white hover:bg-red-600 hover:border-red-500' : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        icon
      )}
      {loading ? 'Working...' : label}
    </Button>
  );
}

export function StudioToolPanels({
  selectedTool,
  canGenerate,
  isGeneratingScript,
  isGeneratingCast,
  isGeneratingSeries,
  isGeneratingAll,
  onGenerateScript,
  onGenerateCast,
  onGenerateSeries,
  onGenerateAll,
  onOpenStoryboard,
  onOpenSeo,
  onOpenPrompts,
  onOpenWhatIf,
  onOpenAudio,
  onOpenExport,
}: StudioToolPanelsProps) {
  return (
    <div className="space-y-3 pt-2">
      {onGenerateAll && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={onGenerateAll}
            disabled={!canGenerate || Boolean(isGeneratingAll)}
            className="h-7 rounded-full border border-red-500/20 bg-red-600/10 px-3 text-[9px] font-black uppercase tracking-[0.22em] text-red-400 hover:bg-red-600 hover:text-white"
          >
            {isGeneratingAll ? (
              <>
                <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Working
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-3 w-3" />
                Gen All
              </>
            )}
          </Button>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <ToolButton
          label="Script"
          icon={<Send className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'script'}
          onClick={onGenerateScript}
          loading={isGeneratingScript}
          disabled={!canGenerate}
        />
        <ToolButton
          label="Cast"
          icon={<UserPlus className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'cast'}
          onClick={onGenerateCast}
          loading={isGeneratingCast}
          disabled={!canGenerate}
        />
        <ToolButton
          label="Series"
          icon={<Layers className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'series'}
          onClick={onGenerateSeries}
          loading={isGeneratingSeries}
          disabled={!canGenerate}
        />
        <ToolButton
          label="Storyboard"
          icon={<LayoutIcon className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'storyboard'}
          onClick={onOpenStoryboard}
        />
        <ToolButton
          label="SEO"
          icon={<Search className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'seo'}
          onClick={onOpenSeo}
        />
        <ToolButton
          label="Prompts"
          icon={<ImageIcon className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'prompts'}
          onClick={onOpenPrompts}
        />
        <ToolButton
          label="What If?"
          icon={<HelpCircle className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'whatif'}
          onClick={onOpenWhatIf}
        />
        <ToolButton
          label="Audio Bay"
          icon={<Mic className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'audio'}
          onClick={onOpenAudio}
        />
        <ToolButton
          label="Export"
          icon={<Package className="w-4 h-4 text-red-500" />}
          active={selectedTool === 'export'}
          onClick={onOpenExport}
        />
      </div>
    </div>
  );
}

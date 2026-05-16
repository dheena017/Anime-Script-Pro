import React from 'react';
import { Layers, Copy, Download, Maximize, Minimize, FileText, Plus, ListFilter, Activity, Database, Users, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useGeneratorState } from '@/hooks/useGenerator';
import { seriesStyles as s } from '../seriesStyles';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface SeriesToolbarProps {
  status: 'active' | 'draft' | 'empty';
  session?: string;
  episode?: string;
  content?: string | null;
  onExportClick?: () => void;
  onAddEpisode?: () => void;
  onFilterArchive?: () => void;
}

export const SeriesToolbar: React.FC<SeriesToolbarProps> = ({
  status,
  session = '1',
  episode = '1',
  content = null,
  onExportClick,
  onAddEpisode,
  onFilterArchive
}) => {
  const { isFullscreen } = useApp();
  const { 
    generatedWorld, 
    generatedWorldLore,
    generatedWorldPowers,
    generatedWorldFactions,
    generatedWorldAtlas,
    generatedWorldSystems,
    castList,
    selectedModel,
    contentType,
    prompt
  } = useGeneratorState();

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  const handleDownload = () => {
    if (onExportClick) {
      onExportClick();
      return;
    }

    if (content) {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `series-manifest-S${session}-E${episode}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const worldChars = (generatedWorld?.length || 0) + 
                    (generatedWorldLore?.length || 0) + 
                    (generatedWorldPowers?.length || 0) + 
                    (generatedWorldFactions?.length || 0) + 
                    (generatedWorldAtlas?.length || 0) + 
                    (generatedWorldSystems?.length || 0);

  const isWorldSynced = worldChars > 0;
  const isCastSynced = castList?.length > 0;

  const handleViewPrompt = () => {
    const mockPrompt = `
      SYSTEM_INSTRUCTION: HIGH-FIDELITY SERIES ORCHESTRATION
      MODEL: ${selectedModel?.toUpperCase()}
      CONTENT: ${contentType}
      
      WORLD_BIBLE_INJECTION: ${isWorldSynced ? 'ACTIVE ✅' : 'EMPTY ❌'}
      CAST_DNA_INJECTION: ${isCastSynced ? 'ACTIVE ✅' : 'EMPTY ❌'}
      
      CORE_DIRECTIVE: ${prompt}
      
      [EPISODE_PLANNING_CONTRACT_V4.2_ACTIVE]
    `;
    alert(mockPrompt.trim());
  };

  return (
    <TooltipProvider>
      <div className={s.toolbar.container}>
        <div className={s.toolbar.header}>
          {/* Identity */}
          <div className={s.toolbar.statusBox}>
            <div className={s.toolbar.statusIcon}>
              <Layers className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
            </div>
            <div className="flex flex-col gap-1">
              <span className={s.toolbar.statusTitle}>
                Series Nexus {status === 'active' ? 'Active' : 'Standby'}
              </span>
              <span className={s.toolbar.statusSubtitle}>
                System Status: Optimal // Series_Sync_01
              </span>
            </div>
          </div>

          {/* Studio Intelligence Diagnostics */}
          <div className="flex items-center gap-6 px-8 border-x border-white/5 mx-auto">
            <div className="flex items-center gap-3 group/diag">
               <Database className={cn("w-4 h-4 transition-colors", isWorldSynced ? "text-studio" : "text-zinc-700")} />
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">World Lore Sync</span>
                 <span className={cn("text-[10px] font-mono", isWorldSynced ? "text-studio" : "text-zinc-700")}>
                   {isWorldSynced ? `${worldChars} Chars | ACTIVE ✅` : 'INACTIVE ❌'}
                 </span>
               </div>
            </div>

            <div className="flex items-center gap-3 group/diag">
               <Users className={cn("w-4 h-4 transition-colors", isCastSynced ? "text-studio" : "text-zinc-700")} />
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Cast DNA Sync</span>
                 <span className={cn("text-[10px] font-mono", isCastSynced ? "text-studio" : "text-zinc-700")}>
                   {isCastSynced ? `${castList.length} Entities | ACTIVE ✅` : 'INACTIVE ❌'}
                 </span>
               </div>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleViewPrompt}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5 hover:border-studio/30 transition-all group/prompt"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-zinc-500 group-hover/prompt:text-studio transition-colors" />
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover/prompt:text-zinc-400">Neural Prompt</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-[10px] font-black uppercase tracking-widest">View System Instructions</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className={s.toolbar.actionGroup}>
            <div className={s.toolbar.btnGroup}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                    disabled={!content}
                  >
                    <Copy className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">Copy JSON</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownload}
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                    disabled={!content}
                  >
                    <Download className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">Export File</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleFullscreen}
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" /> : <Maximize className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">{isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 border-l border-white/5 pl-8">
              <Button
                variant="outline"
                className="h-11 px-5 border-white/10 bg-black/40 text-zinc-500 hover:text-studio hover:border-studio/40 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300"
                onClick={onFilterArchive}
              >
                <ListFilter className="w-4 h-4 mr-3" /> Filter Archive
              </Button>

              <Button
                className="h-11 px-8 bg-studio text-black font-black uppercase tracking-widest text-[10px] hover:bg-studio/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] rounded-xl transition-all duration-300"
                onClick={onAddEpisode}
              >
                <Plus className="w-5 h-5 mr-3" /> New Episode
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};


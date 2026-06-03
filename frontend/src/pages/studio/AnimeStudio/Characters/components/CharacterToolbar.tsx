import React from "react";
import {
  Activity,
  Copy,
  Download,
  Maximize,
  Minimize,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  ListFilter,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CharacterTabs, CharacterTab } from "../Tabs/CharacterTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { characterStyles as s } from "../characterStyles";
import { CharacterPageContext, CharacterTabActionsContext } from "../CharactersLayout";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useNavigate } from "react-router-dom";
import { useStudioBasePath } from "@/hooks/useStudioBasePath";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type { CharacterTab };

interface CharacterToolbarProps {
  activeTab: CharacterTab;
  setActiveTab: (tab: CharacterTab) => void;
  status: "active" | "draft" | "empty";
  session?: string;
  episode?: string;
  content?: string | null;
  showTabsOnly?: boolean;
}

export const CharacterToolbar: React.FC<CharacterToolbarProps> = ({
  status,
  session = "1",
  episode = "1",
  content = null,
  showTabsOnly = false,
  activeTab,
  setActiveTab,
}) => {
  const { isFullscreen } = useApp();
  const navigate = useNavigate();
  const basePath = useStudioBasePath();
  const { isEditing } = useGeneratorState();
  const { setIsEditing, showNotification: notify } = useGeneratorDispatch();
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = React.useContext(CharacterPageContext);
  const { handleSynthesizeSocialWeb, isGeneratingRelationships } = React.useContext(CharacterTabActionsContext);

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
    if (content) {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cast_manifest.md";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <TooltipProvider>
      {showTabsOnly && (
        <div className="w-full rounded-[1.5rem] border border-cyan-500/20 bg-[#050505]/95 px-3 py-3 shadow-[0_0_30px_rgba(6,182,212,0.06)]">
          <CharacterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      {/* Mobile compact toolbar (bottom, icon-only) */}
      {!showTabsOnly && (
        <>
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 border-t border-white/5 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("studio-generate-profile-image"),
                  );
                }}
                size="icon"
                variant="ghost"
                className={s.toolbar.iconButton}
              >
                <Sparkles className="w-4 h-4 relative z-10 text-studio" />
              </Button>

              <Button
                onClick={handleCopy}
                size="icon"
                variant="ghost"
                className={s.toolbar.iconButton}
                disabled={!content}
              >
                <Copy className="w-4 h-4" />
              </Button>

              <Button
                onClick={handleDownload}
                size="icon"
                variant="ghost"
                className={s.toolbar.iconButton}
                disabled={!content}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleFullscreen}
                size="icon"
                variant="ghost"
                className={s.toolbar.iconButton}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className={s.toolbar.container}>
              <div className={s.toolbar.header}>
                {/* Identity */}
                <div className={s.toolbar.statusBox}>
                  <div className={s.toolbar.statusIcon}>
                    <Activity
                      className={cn(
                        "w-5 h-5 transition-all duration-500",
                        status === "active"
                          ? s.toolbar.statusActive
                          : s.toolbar.statusInactive,
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={s.toolbar.statusTitle}>
                      Cast Nexus {status === "active" ? "Active" : "Standby"}
                    </span>
                  </div>
                </div>

                {activeTab === "characters" && (
                  <div className="flex-1 flex items-center justify-center max-w-xl mx-8">
                    <div className="flex items-center w-full gap-4 p-1.5 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                          value={searchQuery || ""}
                          onChange={(e) => setSearchQuery?.(e.target.value)}
                          placeholder="Search characters by name or role..."
                          className="h-10 pl-11 bg-zinc-950/50 border-white/10 focus:border-studio/50 rounded-xl text-xs placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewMode?.("grid")}
                          className={cn(
                            "w-8 h-8 rounded-lg transition-all",
                            viewMode === "grid"
                              ? "bg-studio text-black hover:bg-studio"
                              : "text-zinc-500 hover:text-white",
                          )}
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewMode?.("list")}
                          className={cn(
                            "w-8 h-8 rounded-lg transition-all",
                            viewMode === "list"
                              ? "bg-studio text-black hover:bg-studio"
                              : "text-zinc-500 hover:text-white",
                          )}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className={s.toolbar.actionGroup}>
                  {activeTab === "characters" && (
                    <div className="flex items-center gap-3 mr-4">
                      <Button
                        variant="outline"
                        className="h-10 border-zinc-800 bg-black/40 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-xl"
                      >
                        <ListFilter className="w-4 h-4 mr-2" /> Filter
                      </Button>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-10 px-6 rounded-xl border font-black uppercase tracking-widest text-xs transition-all duration-300",
                          isEditing
                            ? "bg-studio text-black border-studio shadow-studio"
                            : "bg-white/5 border-white/10 text-zinc-400 hover:text-studio hover:border-studio/30",
                        )}
                        onClick={() => {
                          if (isEditing)
                            notify?.("Character manifest saved successfully!", "success");
                          setIsEditing?.(!isEditing);
                        }}
                      >
                        {isEditing ? "Save Bios" : "Manual Edit"}
                      </Button>
                      <Button
                        className="h-10 bg-studio text-black font-black uppercase tracking-wider hover:bg-studio/80 shadow-studio rounded-xl"
                        onClick={() => navigate(`${basePath}/cast/add-lead`)}
                      >
                        <Plus className="w-4 h-4 mr-2" /> New character
                      </Button>
                    </div>
                  )}

                  {activeTab === "relationships" && (
                    <div className="flex items-center gap-3 mr-4">
                      <Button
                        variant="outline"
                        disabled={isGeneratingRelationships}
                        className="border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-500 font-black uppercase tracking-wider hover:bg-fuchsia-500/10 h-10 px-6 rounded-xl transition-all group"
                        onClick={handleSynthesizeSocialWeb}
                      >
                        {isGeneratingRelationships ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        )}
                        {isGeneratingRelationships ? "Synthesizing..." : "Synthesize Social Web"}
                      </Button>

                      <Button
                        className="bg-fuchsia-600 text-white font-black uppercase tracking-wider hover:bg-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)] h-10 px-6 rounded-xl"
                        onClick={() => navigate(`${basePath}/cast/relationships/new`)}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Establish Connection
                      </Button>
                    </div>
                  )}

                  <div className={s.toolbar.btnGroup}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent("studio-generate-profile-image"),
                            );
                          }}
                          size="icon"
                          variant="ghost"
                          className={s.toolbar.iconButton}
                        >
                          <Sparkles className="w-4 h-4 relative z-10 group-hover:scale-110 text-studio transition-transform duration-300 animate-pulse" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="font-black uppercase tracking-widest text-xs">
                          Generate Profile Images
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
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
                        <p className="font-black uppercase tracking-widest text-xs">
                          Copy Cast
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
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
                        <p className="font-black uppercase tracking-widest text-xs">
                          Export Markdown
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={toggleFullscreen}
                          size="icon"
                          variant="ghost"
                          className={s.toolbar.iconButton}
                        >
                          {isFullscreen ? (
                            <Minimize className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <Maximize className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="font-black uppercase tracking-widest text-xs">
                          {isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </TooltipProvider>
  );
};

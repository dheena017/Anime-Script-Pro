import React, { useState } from "react";
import {
  Terminal,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  METADATA_GENERATION_PROMPT,
  YOUTUBE_DESCRIPTION_GENERATION_PROMPT,
  ALT_TEXT_GENERATION_PROMPT,
  GROWTH_STRATEGY_PROMPT,
  REPURPOSE_MATRIX_PROMPT,
} from "@/services/prompts";

interface AIPromptViewerProps {
  activeTab: string;
  script: string | null;
  contentType?: string;
}

export const AIPromptViewer: React.FC<AIPromptViewerProps> = ({
  activeTab,
  script,
  contentType = "Anime",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getActivePromptData = () => {
    const dummyScript =
      script ||
      "[Your Anime Script Content will be inserted here when you write a script...]";

    switch (activeTab) {
      case "keywords":
        return {
          title: "YouTube Keywords & Package Strategy Prompt",
          prompt: METADATA_GENERATION_PROMPT(dummyScript),
          theme: "cyan" as const,
        };
      case "tags":
        return {
          title: "Search Tag Cluster Strategy Prompt",
          prompt: METADATA_GENERATION_PROMPT(dummyScript),
          theme: "fuchsia" as const,
        };
      case "description":
        return {
          title: "Narrative & YouTube Description Funnel Prompt",
          prompt: YOUTUBE_DESCRIPTION_GENERATION_PROMPT(
            contentType,
            dummyScript,
          ),
          theme: "fuchsia" as const,
        };
      case "alt":
        return {
          title: "Accessibility Alt-Text Blueprint Prompt",
          prompt: ALT_TEXT_GENERATION_PROMPT(dummyScript),
          theme: "cyan" as const,
        };
      case "distribution":
        return {
          title: "Cross-Platform Distribution Matrix Prompt",
          prompt: REPURPOSE_MATRIX_PROMPT(dummyScript),
          theme: "rose" as const,
        };
      case "growth":
        return {
          title: "Viral Channel Growth & Strategy Blueprint Prompt",
          prompt: GROWTH_STRATEGY_PROMPT(contentType, dummyScript),
          theme: "orange" as const,
        };
      default:
        return {
          title: "AI System Prompt",
          prompt: METADATA_GENERATION_PROMPT(dummyScript),
          theme: "cyan" as const,
        };
    }
  };

  const { title, prompt, theme } = getActivePromptData();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeStyles = {
    cyan: {
      text: "text-cyan-400",
      border: "border-cyan-500/20 hover:border-cyan-500/40",
      bg: "bg-cyan-500/[0.02]",
      glow: "shadow-[0_0_30px_rgba(6,182,212,0.04)]",
      pulse: "bg-cyan-500",
      badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
    },
    fuchsia: {
      text: "text-fuchsia-400",
      border: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
      bg: "bg-fuchsia-500/[0.02]",
      glow: "shadow-[0_0_30px_rgba(217,70,239,0.04)]",
      pulse: "bg-fuchsia-500",
      badge: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-300",
    },
    rose: {
      text: "text-rose-400",
      border: "border-rose-500/20 hover:border-rose-500/40",
      bg: "bg-rose-500/[0.02]",
      glow: "shadow-[0_0_30px_rgba(244,63,94,0.04)]",
      pulse: "bg-rose-500",
      badge: "bg-rose-500/10 border-rose-500/20 text-rose-300",
    },
    orange: {
      text: "text-orange-400",
      border: "border-orange-500/20 hover:border-orange-500/40",
      bg: "bg-orange-500/[0.02]",
      glow: "shadow-[0_0_30px_rgba(249,115,22,0.04)]",
      pulse: "bg-orange-500",
      badge: "bg-orange-500/10 border-orange-500/20 text-orange-300",
    },
  }[theme] || {
    text: "text-cyan-400",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    bg: "bg-cyan-500/[0.02]",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.04)]",
    pulse: "bg-cyan-500",
    badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
  };

  return (
    <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div
        className={cn(
          "w-full rounded-[2rem] border bg-black/40 backdrop-blur-md transition-all duration-500 p-6 md:p-8 relative group overflow-hidden",
          themeStyles.border,
          themeStyles.glow,
        )}
      >
        {/* Glowing Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

        {/* Header Toggle Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <Terminal className={cn("w-4.5 h-4.5", themeStyles.text)} />
              <span
                className={cn(
                  "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-black animate-pulse",
                  themeStyles.pulse,
                )}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  System Prompt Console
                </h4>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                    themeStyles.badge,
                  )}
                >
                  Gemini-3.1-Pro
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                Exposing system prompt & strategic guidelines for the{" "}
                {activeTab.toUpperCase()} module
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-xl border-zinc-700 bg-black/40 hover:bg-white/5 text-xs font-black uppercase tracking-widest gap-2 text-zinc-300 transition-all duration-300"
            >
              {isOpen ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Hide Prompts
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Reveal Prompts
                </>
              )}
            </Button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleCopy}
                    className="h-9 px-4 rounded-xl font-black uppercase tracking-widest text-xs text-zinc-300 border border-zinc-700 bg-black/40 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300 flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-400 animate-in zoom-in-50" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copied ? "Copied" : "Copy Prompt"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapsible Prompt Body */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden relative z-10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Active System Instructions
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      themeStyles.text,
                    )}
                  >
                    {title}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-950/80 border border-white/5 text-[9px] font-bold text-zinc-500 tracking-wider font-mono uppercase">
                    <Cpu className="w-3 h-3 text-zinc-400" />
                    System Context
                  </div>
                  <pre className="p-5 rounded-2xl bg-black/60 border border-white/5 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent whitespace-pre-wrap select-text selection:bg-white/10 selection:text-white">
                    {prompt.trim()}
                  </pre>
                </div>

                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-right">
                  System triggers automatic payload parsing on response
                  acquisition.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

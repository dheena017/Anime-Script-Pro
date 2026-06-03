import React, { useState } from "react";
import {
  Share2,
  Play,
  Music2,
  Camera,
  Globe,
  CheckCircle2,
  Loader2,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { seoStyles as s } from "../seoStyles";

interface DistributionTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const DistributionTab: React.FC<DistributionTabProps> = ({
  content,
  isGenerating,
  onGenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const platforms = [
    {
      name: "YouTube",
      icon: Play,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      status: "Ready",
      desc: "Optimized for high-retention long-form and Shorts.",
    },
    {
      name: "TikTok",
      icon: Music2,
      color: "text-fuchsia-400",
      bg: "bg-fuchsia-500/10",
      status: "Ready",
      desc: "Fast-paced edits and trending sound integration.",
    },
    {
      name: "Instagram",
      icon: Camera,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      status: "Pending",
      desc: "Aesthetic Reels and story-driven carousel posts.",
    },
    {
      name: "Web Platform",
      icon: Globe,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      status: "Optimizing",
      desc: "SEO-rich blog posts and newsletter snippets.",
    },
  ];

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          s.cardContainer,
          content
            ? "border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.1)]"
            : "border-white/5 hover:border-rose-500/20",
        )}
      >
        <div className={s.gridPattern} />
        <div className={s.cardContent}>
          {isGenerating ? (
            <div className={s.loadingStateContainer + " text-rose-500"}>
              <div
                className={
                  s.loadingSpinner +
                  " border-rose-500/20 border-t-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                }
              />
              <h4 className={s.loadingTitle + " text-rose-400"}>
                Distribution Array Calibrating
              </h4>
              <p className={s.loadingText}>
                Synthesizing custom multi-channel delivery specifications and
                amplification plans.
              </p>
            </div>
          ) : content ? (
            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              {/* Floating Copy Controls */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-400">
                  Distribution Blueprint
                </span>
                <Button
                  onClick={handleCopy}
                  className="h-9 px-4 rounded-xl font-black uppercase tracking-widest text-xs text-zinc-300 border border-zinc-700 bg-black/40 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300 flex items-center gap-2"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copied" : "Copy Plan"}
                </Button>
              </div>

              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-xl font-black text-white uppercase tracking-tighter mb-6 mt-10 first:mt-0"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg font-black text-rose-500 uppercase tracking-widest mb-4 mt-8"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-sm font-black text-white uppercase tracking-wider mb-3 mt-6"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-4 last:mb-0 leading-relaxed text-zinc-400 font-medium"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-5 mb-4 space-y-2"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-5 mb-4 space-y-2 font-medium"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-zinc-400 font-medium" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="text-rose-300 font-black" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-zinc-300" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-2 border-rose-500 pl-4 italic text-zinc-400 bg-rose-500/5 p-3 rounded-r-lg my-4"
                        {...props}
                      />
                    ),
                    code: ({
                      node,
                      inline,
                      className,
                      children,
                      ...props
                    }: any) => {
                      return inline ? (
                        <code
                          className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-rose-300"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <pre
                          className="p-4 rounded-xl bg-black/40 border border-white/5 overflow-x-auto font-mono text-xs text-zinc-300 leading-relaxed my-4"
                          {...props}
                        >
                          {children}
                        </pre>
                      );
                    },
                  }}
                >
                  {content || ""}
                </ReactMarkdown>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 mt-8">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-white uppercase tracking-widest">
                    Global Sync Engaged
                  </h5>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                    Distribution playbooks automatically align with the script
                    DNA on regeneration.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {platforms.map((platform, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex flex-col justify-between min-h-[160px] group/item hover:border-rose-500/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover/item:scale-110",
                          platform.bg,
                        )}
                      >
                        <platform.icon
                          className={cn("w-5 h-5", platform.color)}
                        />
                      </div>
                      <div
                        className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border",
                          platform.status === "Ready"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : platform.status === "Optimizing"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
                        )}
                      >
                        {platform.status}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1.5">
                        {platform.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider leading-relaxed">
                        {platform.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center pt-8 border-t border-white/5 space-y-4 text-center">
                <p className="text-xs text-zinc-500 max-w-sm uppercase tracking-wider leading-relaxed">
                  Synthesize an algorithmic delivery roadmap for your primary
                  publishing platforms.
                </p>
                <Button
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="bg-rose-500 hover:bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] px-8 py-3.5 h-auto rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2.5 transition-all active:scale-95 duration-200"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Generate Distribution Plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

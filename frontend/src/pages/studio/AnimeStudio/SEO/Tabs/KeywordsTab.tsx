import React, { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { seoStyles as s } from "../seoStyles";

interface KeywordsTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const KeywordsTab: React.FC<KeywordsTabProps> = ({
  content,
  isGenerating,
  onGenerate,
}) => {
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);
  const [copiedDesc, setCopiedDesc] = useState(false);

  let data: any = null;
  if (content) {
    try {
      data = JSON.parse(content);
    } catch (e) {
      // Content is not JSON, render as plain markdown
    }
  }

  const handleCopyTitle = (title: string, index: number) => {
    navigator.clipboard.writeText(title);
    setCopiedTitleIndex(index);
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  const handleCopyDesc = (desc: string) => {
    navigator.clipboard.writeText(desc);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          s.cardContainer,
          content
            ? "border-studio/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]"
            : "border-white/5 hover:border-studio/20",
        )}
      >
        <div className={s.gridPattern} />
        <div className={s.cardContent}>
          {isGenerating ? (
            <div className={s.loadingStateContainer + " text-studio"}>
              <div
                className={
                  s.loadingSpinner +
                  " border-studio/20 border-t-studio shadow-studio"
                }
              />
              <h4 className={s.loadingTitle + " text-studio"}>
                Keyword Atlas Calibrating
              </h4>
              <p className={s.loadingText}>
                Building SEO signals and title variants for algorithmic reach.
              </p>
            </div>
          ) : data ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Title Suggestions */}
              {data.title_suggestions && data.title_suggestions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                    Title Options
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {data.title_suggestions.map((title: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all group"
                      >
                        <span className="text-sm font-bold text-zinc-200 tracking-wide">
                          {title}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-white"
                          onClick={() => handleCopyTitle(title, i)}
                        >
                          {copiedTitleIndex === i ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Description */}
              {data.meta_description && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                    Meta Description
                  </h4>
                  <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 relative">
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-white"
                        onClick={() => handleCopyDesc(data.meta_description)}
                      >
                        {copiedDesc ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium pr-10">
                      {data.meta_description}
                    </p>
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.primary_keywords && data.primary_keywords.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                      Primary Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.primary_keywords.map((kw: string, i: number) => (
                        <div
                          key={i}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                        >
                          {kw}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.secondary_keywords &&
                  data.secondary_keywords.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                        Secondary Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {data.secondary_keywords.map(
                          (kw: string, i: number) => (
                            <div
                              key={i}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.02] border border-white/5 text-zinc-400"
                            >
                              {kw}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ) : content ? (
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
                      className="text-lg font-black text-cyan-400 uppercase tracking-widest mb-4 mt-8"
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
                    <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal pl-5 mb-4 space-y-2 font-medium"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-zinc-400" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-white font-bold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-zinc-300" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-2 border-cyan-500 pl-4 italic text-zinc-400 bg-cyan-500/5 p-3 rounded-r-lg my-4"
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
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-cyan-300"
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
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className={s.emptyStateContainer}>
              <div
                className={
                  s.emptyIconBox +
                  " group-hover/empty:border-studio/30 group-hover/empty:bg-studio/5"
                }
              >
                <Sparkles className="w-8 h-8 opacity-20 group-hover/empty:opacity-60 transition-opacity" />
              </div>
              <p className={s.emptyText}>
                Generate your keyword matrix and title concepts for the SEO
                engine.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

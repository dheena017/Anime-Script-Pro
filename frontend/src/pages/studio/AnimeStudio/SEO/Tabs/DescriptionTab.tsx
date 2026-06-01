import React from "react";
import { MonitorPlay } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { seoStyles as s } from "../seoStyles";

interface DescriptionTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const DescriptionTab: React.FC<DescriptionTabProps> = ({
  content,
  isGenerating,
  onGenerate,
}) => {
  return (
    <div className="space-y-6">
      <Card
        className={cn(
          s.cardContainer,
          content
            ? "border-fuchsia-500/30 shadow-[0_0_40px_rgba(192,38,211,0.1)]"
            : "border-white/5 hover:border-fuchsia-500/20",
        )}
      >
        <div className={s.gridPattern} />
        <div className={s.cardContent}>
          {isGenerating ? (
            <div className={s.loadingStateContainer + " text-fuchsia-700"}>
              <div
                className={
                  s.loadingSpinner +
                  " border-fuchsia-500/20 border-t-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                }
              />
              <h4 className={s.loadingTitle + " text-fuchsia-400"}>
                Description Weaver Active
              </h4>
              <p className={s.loadingText}>
                Drafting a high-conversion narrative that converts viewers into
                subscribers.
              </p>
            </div>
          ) : content ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
                      className="text-lg font-black text-fuchsia-400 uppercase tracking-widest mb-4 mt-8"
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
                      className="mb-4 last:mb-0 leading-relaxed text-zinc-400 font-medium whitespace-pre-wrap"
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
                    <li className="text-zinc-400 font-medium" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className="text-fuchsia-300 font-black"
                      {...props}
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-zinc-300" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-2 border-fuchsia-500 pl-4 italic text-zinc-400 bg-fuchsia-500/5 p-3 rounded-r-lg my-4"
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
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-fuchsia-300"
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
                  " group-hover/empty:border-fuchsia-500/30 group-hover/empty:bg-fuchsia-500/5"
                }
              >
                <MonitorPlay className="w-8 h-8 opacity-20 group-hover/empty:opacity-60 transition-opacity" />
              </div>
              <p className={s.emptyText}>
                Generate a conversion-focused description for your anime
                release.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

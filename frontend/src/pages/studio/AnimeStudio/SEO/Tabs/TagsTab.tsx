import React, { useState } from "react";
import { Tag, Sparkles, Copy, RefreshCcw, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { seoStyles as s } from "../seoStyles";
import { cn } from "@/lib/utils";

interface TagsTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const TagsTab: React.FC<TagsTabProps> = ({
  content,
  isGenerating,
  onGenerate,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTagIndex, setCopiedTagIndex] = useState<number | null>(null);

  // Parse keywords dynamically from JSON content
  let tags: string[] = [
    "Anime",
    "Storytelling",
    "AI Production",
    "Animation",
    "Tutorial",
    "Nexus",
    "Visual DNA",
  ];
  if (content) {
    try {
      const data = JSON.parse(content);
      const combined = [
        ...(data.primary_keywords || []),
        ...(data.secondary_keywords || []),
      ];
      if (combined.length > 0) {
        tags = combined;
      }
    } catch (e) {
      // Fallback to defaults or parse simple comma-separated string
      if (typeof content === "string" && content.trim().length > 0) {
        const splitTags = content
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        if (splitTags.length > 0) {
          tags = splitTags;
        }
      }
    }
  }

  const handleCopyTag = (tag: string, index: number) => {
    navigator.clipboard.writeText(tag);
    setCopiedTagIndex(index);
    setTimeout(() => setCopiedTagIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const formatted = tags.join(", ");
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className={cn(s.cardContainer, "p-8 min-h-[400px]")}>
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {content ? (
          <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <span className={s.tagManifestHeader + " text-fuchsia-400"}>
                Tag Manifest
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-zinc-500 hover:text-white border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] rounded-xl flex items-center gap-2"
                onClick={handleCopyAll}
              >
                {copiedAll ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-xs font-bold uppercase tracking-widest">
                  {copiedAll ? "Copied" : "Copy All"}
                </span>
              </Button>
            </div>
            <div className={s.tagsContainer}>
              {tags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleCopyTag(tag, i)}
                  className={
                    s.tagItem +
                    " bg-fuchsia-500/10 border-fuchsia-500/20 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/20 text-fuchsia-300 transition-all active:scale-95 duration-200 cursor-pointer"
                  }
                >
                  {copiedTagIndex === i ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Tag className="w-3 h-3 text-fuchsia-400" />
                  )}
                  {tag}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 italic mt-8 leading-relaxed">
              These tags are optimized for YouTube, TikTok, and Instagram
              discovery algorithms based on your script content. Click any tag
              to copy it individually.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-700">
            <Tag className="w-12 h-12 mb-6 opacity-20" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-center max-w-[200px]">
              No tag clusters generated yet.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

import React from "react";
import ReactMarkdown from "react-markdown";
import { StudioEditor } from "../../components/StudioEditor";
import {
  Users,
  Flag,
  Sword,
  Landmark,
  Sparkles,
  ScrollText,
} from "lucide-react";
import { motion } from "framer-motion";
import { TableOfContents } from "../components/TableOfContents";
import { worldStyles as s } from "../worldStyles";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea";
import { reportGeneration } from "@/lib/dev-console-logs";

interface FactionsTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  prompt?: string;
  onPromptChange?: (p: string) => void;
}

export const FactionsTab: React.FC<FactionsTabProps> = ({
  isEditing,
  content,
  onContentChange,
  onGenerate,
  isGenerating,
  prompt,
  onPromptChange,
}) => {
  const sectionContent = content;
  const {
    textareaRef: promptTextareaRef,
    scheduleResizeTextarea: schedulePromptResize,
  } = useAutoResizeTextarea(prompt || "", isEditing);

  const stats = React.useMemo(
    () => [
      {
        title: "Alliances",
        icon: Landmark,
        color: "text-blue-400",
        desc: "Diplomatic treaties and hidden collaborations.",
      },
      {
        title: "Territories",
        icon: Flag,
        color: "text-studio",
        desc: "Lands and resources controlled by factions.",
      },
      {
        title: "Conflict",
        icon: Sword,
        color: "text-rose-400",
        desc: "Active wars and ideological friction points.",
      },
      {
        title: "Leadership",
        icon: Users,
        color: "text-emerald-400",
        desc: "Hierarchies and governing philosophies.",
      },
    ],
    [],
  );

  React.useEffect(() => {
    if (!isGenerating && content && content.length > 0) {
      // This is a bit naive but shows completion when generating finishes
    }
  }, [isGenerating, content]);

  return (
    <div className={s.content.container}>
      {isEditing ? (
        <StudioEditor
          content={content}
          onContentChange={onContentChange}
          isEditing={isEditing}
          placeholder="Design your world's political landscape..."
        />
      ) : (
        <div className={s.content.contentArea}>
          <div className={s.content.mainColumn}>
            <div
              className={s.content.prose}
              style={
                { "--prose-accent-color": "#60a5fa" } as React.CSSProperties
              }
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {sectionContent}
              </ReactMarkdown>
            </div>
          </div>

          <div className={cn(s.content.sidebar, "space-y-8")}>
            <div className={s.content.sidebarCard}>
              <div
                className={
                  s.content.sidebarGlow +
                  " bg-blue-500/5 group-hover:bg-blue-500/10"
                }
              />
              <div className={s.content.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.content.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-blue-500" /> Core Seed
                  </h4>
                  {isEditing && (
                    <span className="text-xs font-bold text-blue-500/50 uppercase">
                      Modular Prompt
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={
                      s.content.sidebarPromptInput + " focus:border-blue-500/30"
                    }
                    value={prompt || ""}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the faction dynamics with specific instructions..."
                  />
                ) : (
                  <div className={s.content.sidebarPromptBox}>
                    <p className={s.content.sidebarPromptText}>
                      {prompt
                        ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? "..." : ""}"`
                        : "Using global project seed for synthesis."}
                    </p>
                  </div>
                )}

                <p className={s.content.sidebarNote}>
                  Refine the political landscape by defining key conflicts,
                  leadership styles, or hidden agendas.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={s.content.statCard + " hover:border-blue-500/30"}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] pointer-events-none" />
                  <div className={cn(s.content.statIconBox, stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest line-clamp-1">
                      {stat.title}
                    </h3>
                    <p className="text-xs font-medium text-zinc-500 leading-relaxed line-clamp-2">
                      {stat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="pt-2">
              <h5 className={s.content.sidebarTitle + " mb-4"}>
                <ScrollText className="w-3 h-3" /> Navigation Index
              </h5>
              <TableOfContents content={content} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

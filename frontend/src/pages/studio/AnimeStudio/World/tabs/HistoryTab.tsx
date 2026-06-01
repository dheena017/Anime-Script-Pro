import React from "react";
import { motion } from "framer-motion";
import { StudioEditor } from "../../components/StudioEditor";
import {
  History,
  Calendar,
  Sword,
  Sparkles,
  BookOpen,
  ScrollText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { studioLog, reportGeneration } from "@/lib/dev-console-logs";
import { useAutoResizeTextarea } from "../hooks/useAutoResizeTextarea";
import { worldStyles as s } from "../worldStyles";
import { TableOfContents } from "../components/TableOfContents";

interface HistoryTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  prompt?: string;
  onPromptChange?: (p: string) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
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

  const timelineEvents = React.useMemo(() => {
    const findEvents = (regex: RegExp) => {
      const matches = content?.matchAll(regex);
      return matches
        ? Array.from(matches)
            .map((m) => m[1].trim())
            .slice(0, 3)
        : [];
    };
    return findEvents(/(?:Year|Era|Event):\s*(.*)/gi);
  }, [content]);

  const customComponents = React.useMemo(
    () => ({
      h2: ({ node, ...props }: any) => {
        const text = React.Children.toArray(props.children)
          .map((child) => (typeof child === "string" ? child : ""))
          .join("");
        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        return (
          <motion.h2
            id={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            {...props}
          />
        );
      },
      p: ({ node, ...props }: any) => (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          {...props}
        />
      ),
    }),
    [],
  );

  return (
    <div className={s.content.container}>
      {isEditing ? (
        <StudioEditor
          content={content}
          onContentChange={onContentChange}
          isEditing={isEditing}
          placeholder="Write the history and timeline of your world here..."
        />
      ) : (
        <div className={s.content.contentArea}>
          <div className={s.content.mainColumn}>
            <div
              className={s.content.prose}
              style={
                { "--prose-accent-color": "#d946ef" } as React.CSSProperties
              }
            >
              <ReactMarkdown components={customComponents}>
                {sectionContent}
              </ReactMarkdown>
            </div>
          </div>

          <div className={s.content.sidebar + " space-y-8"}>
            <div className={s.content.sidebarCard}>
              <div
                className={
                  s.content.sidebarGlow +
                  " bg-fuchsia-500/5 group-hover:bg-fuchsia-500/10"
                }
              />
              <div className={s.content.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.content.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-fuchsia-500" /> Core Seed
                  </h4>
                  {isEditing && (
                    <span className="text-xs font-bold text-fuchsia-500/50 uppercase">
                      Modular Prompt
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={
                      s.content.sidebarPromptInput +
                      " focus:border-fuchsia-500/30"
                    }
                    value={prompt || ""}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the history synthesis with specific instructions..."
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
                  Focus the AI on specific eras, cataclysmic events, or
                  historical turning points.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Calendar className="w-3 h-3" /> Key Timeline Events
              </h5>
              {timelineEvents.length > 0 ? (
                timelineEvents.map((event, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-fuchsia-500/20 transition-all"
                  >
                    <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed">
                      {event}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-white/[0.01] border border-white/5 border-dashed rounded-2xl text-center">
                  <p className="text-xs font-bold text-zinc-600 uppercase">
                    No major events identified
                  </p>
                </div>
              )}
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

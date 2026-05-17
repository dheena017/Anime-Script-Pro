import React, { useMemo } from 'react';
import { StudioEditor } from '../../components/StudioEditor';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ScrollText } from 'lucide-react';
import { TableOfContents } from '../components/TableOfContents';
import { worldStyles as s } from '../worldStyles';

interface ManifestTabProps {
  isEditing: boolean;
  content: string;
  prompt?: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export const ManifestTab: React.FC<ManifestTabProps> = ({
  isEditing,
  content,
  prompt,
  onContentChange,
  onGenerate,
  isGenerating
}) => {
  // Memoize markdown to prevent re-renders on scroll or state changes
  const MemoizedMarkdown = useMemo(() => (
    <ReactMarkdown>{content}</ReactMarkdown>
  ), [content]);

  return (
    <div className={s.content.container + " will-change-transform transform-gpu"}>
      {isEditing ? (
        <StudioEditor
          content={content}
          onContentChange={onContentChange}
          isEditing={isEditing}
          placeholder="Edit your comprehensive world bible here...

Use markdown formatting:
• **Bold** for emphasis
• _Italic_ for subtle text
• ## Headings for sections
• `Code` for technical terms
• - Lists for items
• > Quotes for important notes"
        />
      ) : (
        <div className={s.content.contentArea + " relative"}>
          {/* Blueprint Background */}
          <div className="absolute inset-0 world-bible-blueprint pointer-events-none opacity-30 rounded-3xl" />
          
          {/* Content Column */}
          <div className={s.content.mainColumn + " relative z-10"}>
            <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl p-8 lg:p-16 backdrop-blur-sm relative overflow-hidden group">
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-studio/0 via-studio/[0.02] to-studio/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
              
              <div className={s.content.prose + " max-w-none relative z-10"}>
                {MemoizedMarkdown}
              </div>

              {/* Terminal Footer */}
              <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-70 transition-opacity">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">End of Transmission</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-600">World Builder v2.0</span>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className={s.content.sidebar + " space-y-8"}>
            {/* Core Seed Card */}
            <div className={s.content.sidebarCard}>
              <div className={s.content.sidebarGlow + " bg-studio/5 group-hover:bg-studio/10"} />
              <div className={s.content.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.content.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-studio" /> Core Seed
                  </h4>
                </div>
                <div className={s.content.sidebarPromptBox}>
                  <p className={s.content.sidebarPromptText}>
                    {prompt ? `"${prompt.substring(0, 160)}${prompt.length > 160 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                  </p>
                </div>
                <p className={s.content.sidebarNote}>
                  The foundational logline driving the AI's world-building logic.
                </p>
              </div>
            </div>

            {/* World Stats Card */}
            <div className="p-6 bg-studio/5 border border-studio/10 rounded-[2rem] space-y-6">
              <h4 className="text-xs font-black text-studio uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> World Nexus Status
              </h4>
              <div className="space-y-4">
                {[
                  { label: "Stability", val: "Optimal", color: "text-emerald-400" },
                  { label: "Coherence", val: "High", color: "text-studio" },
                  { label: "Detail Level", val: "Vivid", color: "text-fuchsia-400" },
                  { label: "AI Node", val: "Synced", color: "text-amber-400" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 uppercase">{item.label}</span>
                    <span className={`text-xs font-black uppercase tracking-tighter ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation TOC */}
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

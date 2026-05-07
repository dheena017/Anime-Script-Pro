import React from 'react';
import { motion } from 'framer-motion';
import { History, Hourglass, Landmark, ScrollText, Sparkles, ClipboardList, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { studioLog, reportGeneration } from '@/lib/studio-logger';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { worldStyles as s } from '../worldStyles/worldStyles';

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
  onPromptChange
}) => {
  const sectionContent = content;
  const { textareaRef: mainTextareaRef, scheduleResizeTextarea: scheduleMainResize } = useAutoResizeTextarea(content || '', isEditing);
  const { textareaRef: promptTextareaRef, scheduleResizeTextarea: schedulePromptResize } = useAutoResizeTextarea(prompt || '', isEditing);

  const timeline = React.useMemo(() => {
    // Extract era-like lines or use fallback
    const eraRegex = /- \*\*(.*?)\*\*:\s*(.*)/g;
    const matches = Array.from((sectionContent || '').matchAll(eraRegex));
    
    if (matches.length > 0) {
      return matches.slice(0, 3).map((m, i) => ({
        era: m[1],
        date: i === 0 ? 'Ancient' : i === 1 ? 'Expansion' : 'Modern',
        desc: m[2].substring(0, 100) + '...',
        icon: [Landmark, ScrollText, Hourglass][i % 3]
      }));
    }

    return [
      { era: 'The First Spark', date: '3000 B.E.', desc: 'The discovery of the Etheric core and the dawn of civilizations.', icon: Landmark },
      { era: 'The Great Regression', date: '500 B.E.', desc: 'A global conflict that shattered the old kingdoms.', icon: ScrollText },
      { era: 'Current Epoch', date: 'Year 0', desc: 'The stabilization of the mega-metropolises.', icon: Hourglass },
    ];
  }, [sectionContent]);
  return (
    <div className="world-container">


      {isEditing ? (
        <StudioEditor
          content={content}
          onContentChange={onContentChange}
          isEditing={isEditing}
          placeholder="Archive your world history here..."
        />
      ) : (
        <div className="world-content-area">
          <div className="world-main-column">
            <div className="world-prose" style={{ '--prose-accent-color': '#d946ef' } as React.CSSProperties}>
              <ReactMarkdown>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className="world-sidebar space-y-8">
            <div className={s.sidebarCard}>
              <div className={s.sidebarGlow + " bg-fuchsia-500/5 group-hover:bg-fuchsia-500/10"} />
              <div className={s.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-fuchsia-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-fuchsia-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.sidebarPromptInput + " focus:border-fuchsia-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      studioLog('HistoryTab', `Refining Lore Seed. Length: ${val.length} chars.`, 'info');
                      onPromptChange?.(val);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the history synthesis with specific instructions..."
                  />
                ) : (
                  <div className={s.sidebarPromptBox}>
                    <p className={s.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.sidebarNote}>
                  Refining this seed will specialize the AI's focus for this specific module without affecting other tabs.
                </p>
              </div>
            </div>

            <div className="relative border-l border-white/5 ml-4 pl-12 space-y-16">
              {timeline.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative"
                >
                  <div className="absolute -left-[61px] top-0 w-6 h-6 rounded-full bg-zinc-950 border-2 border-fuchsia-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-fuchsia-500 uppercase tracking-widest">{item.date}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter line-clamp-1">{item.era}</h3>
                    <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



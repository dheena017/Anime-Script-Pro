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
      <div className="world-header">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="world-badge bg-fuchsia-500/10 border-fuchsia-500/20">
              <History className="w-3 h-3 text-fuchsia-500" />
              <span className="world-badge-text text-fuchsia-500">Temporal Archivist</span>
            </div>
            <h1 className="world-header-title">
              CHRONICLED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-500 to-fuchsia-400">ERAS</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onGenerate && (
              <button 
                onClick={() => {
                  reportGeneration('HistoryTab', 'Specialized Lore synthesis', 'request', 'anime');
                  onGenerate();
                }}
                disabled={isGenerating}
                className={s.actionButton}
              >
                {isGenerating ? (
                  <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">Synthesize</span>
              </button>
            )}

            <button 
              onClick={() => {
                studioLog('HistoryTab', 'Copying Lore Timeline to clipboard...', 'info');
                navigator.clipboard.writeText(content);
                studioLog('HistoryTab', 'Lore Timeline copied successfully.', 'success');
                alert('Lore Timeline copied!');
              }}
              className={s.actionButtonGhost}
            >
              <ClipboardList className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest">Copy</span>
            </button>
            
            <button 
              onClick={() => {
                studioLog('HistoryTab', 'Downloading Lore Timeline...', 'info');
                const element = document.createElement("a");
                const file = new Blob([content], { type: 'text/markdown' });
                element.href = URL.createObjectURL(file);
                element.download = "Lore_Timeline.md";
                document.body.appendChild(element);
                element.click();
                studioLog('HistoryTab', 'Lore Timeline download initiated.', 'success');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 rounded-full transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-fuchsia-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">Download</span>
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <textarea
          ref={mainTextareaRef}
          className="world-textarea overflow-hidden"
          value={content || ''}
          onChange={(e) => {
            onContentChange(e.target.value);
            scheduleMainResize();
          }}
          onInput={scheduleMainResize}
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



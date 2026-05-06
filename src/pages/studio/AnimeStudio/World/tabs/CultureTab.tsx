import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Utensils, Heart, Sparkles, ClipboardList, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TableOfContents } from '../components/TableOfContents';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { worldStyles as s } from '../worldStyles/worldStyles';

interface CultureTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  prompt?: string;
  onPromptChange?: (p: string) => void;
}

export const CultureTab: React.FC<CultureTabProps> = ({
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

  const cultureItems = React.useMemo(() => {
    const findVal = (regex: RegExp, fallback: string) => {
      const match = content?.match(regex);
      return match ? match[1].trim() : fallback;
    };
    return [
      { label: 'Traditions', val: findVal(/(?:Tradition|Ritual):\s*(.*)/i, 'Neo-Matsuri'), icon: Heart, color: 'text-rose-400' },
      { label: 'Cuisine', val: findVal(/(?:Cuisine|Food):\s*(.*)/i, 'Synthetic Soul'), icon: Utensils, color: 'text-orange-400' },
      { label: 'Arts', val: findVal(/(?:Art|Music):\s*(.*)/i, 'Holographic Echo'), icon: Music, color: 'text-fuchsia-400' },
      { label: 'Identity', val: findVal(/(?:Identity|Social Role):\s*(.*)/i, 'Digital Nomad'), icon: Users, color: 'text-blue-400' },
    ];
  }, [content]);

  const customComponents = React.useMemo(() => ({
    h2: ({ node, ...props }: any) => {
      const text = React.Children.toArray(props.children)
        .map((child) => (typeof child === 'string' ? child : '')).join('');
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return <motion.h2 id={id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, ease: 'easeOut' }} {...props} />;
    },
    p: ({ node, ...props }: any) => (
      <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} {...props} />
    )
  }), []);

  return (
    <div className="world-container">
      <div className="world-header">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="world-badge bg-rose-500/10 border-rose-500/20">
              <Users className="w-3 h-3 text-rose-500" />
              <span className="world-badge-text text-rose-500">Societal Pulse</span>
            </div>
            <h1 className="world-header-title">
              CULTURAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-500 to-rose-400">ETHOS</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onGenerate && (
              <button 
                onClick={onGenerate}
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
                navigator.clipboard.writeText(content);
                alert('Culture Manifest copied!');
              }}
              className={s.actionButtonGhost}
            >
              <ClipboardList className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest">Copy</span>
            </button>
            
            <button 
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([content], { type: 'text/markdown' });
                element.href = URL.createObjectURL(file);
                element.download = "Culture_Manifest.md";
                document.body.appendChild(element);
                element.click();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-full transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Download</span>
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
          placeholder="Profile your world culture and societal norms here..."
        />
      ) : (
        <div className="world-content-area">
          <div className="world-main-column">
            <div className="world-prose" style={{ '--prose-accent-color': '#f43f5e' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className="world-sidebar space-y-8">
            <div className={s.sidebarCard}>
              <div className={s.sidebarGlow + " bg-rose-500/5 group-hover:bg-rose-500/10"} />
              <div className={s.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-rose-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-rose-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.sidebarPromptInput + " focus:border-rose-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the cultural synthesis with specific instructions..."
                  />
                ) : (
                  <div className={s.sidebarPromptBox}>
                    <p className={s.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.sidebarNote}>
                  Focus the AI on specific rituals, social norms, or cultural traditions unique to this society.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {cultureItems.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={s.statCard + " flex flex-col items-center text-center space-y-4 hover:bg-white/[0.02] border-l-2 border-l-rose-500/20"}
                >
                  <div className={s.statIconBox + " rounded-full " + item.color}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={s.statLabel + " block mb-1"}>{item.label}</span>
                    <p className={s.statValue}>{item.val}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-2">
              <TableOfContents content={content} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Building2, Castle, Ruler, Layers, Sparkles, ClipboardList, Download } from 'lucide-react';
import { TableOfContents } from '../components/TableOfContents';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { worldStyles as s } from '../worldStyles/worldStyles';

interface ArchitectureTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  prompt?: string;
  onPromptChange?: (p: string) => void;
}

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({
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

  const stats = React.useMemo(() => {
    const findVal = (regex: RegExp, fallback: string) => {
      const match = content?.match(regex);
      return match ? match[1].trim() : fallback;
    };

    return [
      { label: 'Settlement Style', icon: Castle, val: findVal(/(?:Settlement Style|Style):\s*(.*)/i, 'Gothic-Futurism') },
      { label: 'Building Material', icon: Layers, val: findVal(/(?:Building Material|Material):\s*(.*)/i, 'Obsidian / Neon') },
      { label: 'Scale Factor', icon: Ruler, val: findVal(/(?:Scale Factor|Scale):\s*(.*)/i, 'Mega-Metropolis') },
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
          placeholder="Define your world's architectural style and aesthetic design here..."
        />
      ) : (
        <div className="world-content-area">
          <div className="world-main-column">
            <div className="world-prose" style={{ '--prose-accent-color': '#f59e0b' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className="world-sidebar space-y-8">
            <div className={s.sidebarCard}>
              <div className={s.sidebarGlow + " bg-orange-500/5 group-hover:bg-orange-500/10"} />
              <div className={s.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-orange-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-orange-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.sidebarPromptInput + " focus:border-orange-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the architectural style with specific instructions..."
                  />
                ) : (
                  <div className={s.sidebarPromptBox}>
                    <p className={s.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.sidebarNote}>
                  Refine the visual aesthetic by defining key motifs, lighting moods, or cultural influences.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={s.statCard + " hover:border-orange-500/30"}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-[40px] pointer-events-none" />
                  <div className={s.statIconBox + " text-orange-400"}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className={s.statLabel}>{stat.label}</span>
                    <h3 className={s.statValue}>{stat.val}</h3>
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

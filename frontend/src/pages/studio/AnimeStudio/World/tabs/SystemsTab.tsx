import React from 'react';
import { motion } from 'framer-motion';
import { StudioEditor } from '../../components/StudioEditor';
import { Cpu, Zap, Activity, ShieldCheck, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TableOfContents } from '../components/TableOfContents';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { worldStyles as s } from '../worldStyles';

interface SystemsTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  prompt?: string;
  onPromptChange?: (p: string) => void;
}

export const SystemsTab: React.FC<SystemsTabProps> = ({
  isEditing,
  content,
  onContentChange,
  onGenerate,
  isGenerating,
  prompt,
  onPromptChange
}) => {
  const sectionContent = content;
  const { textareaRef: promptTextareaRef, scheduleResizeTextarea: schedulePromptResize } = useAutoResizeTextarea(prompt || '', isEditing);

  const systems = React.useMemo(() => {
    const findVal = (regex: RegExp, fallback: string) => {
      const match = content?.match(regex);
      return match ? match[1].trim() : fallback;
    };
    return [
      { title: 'Power System', desc: findVal(/(?:Power System|Power):\s*(.*)/i, 'Energy manipulation through cognitive overloading.'), icon: Zap, color: 'text-amber-400' },
      { title: 'Economy', desc: findVal(/(?:Economy|Currency):\s*(.*)/i, 'Credits & Karma: A dual-currency social contribution system.'), icon: Activity, color: 'text-blue-400' },
      { title: 'Governance', desc: findVal(/(?:Governance|Government):\s*(.*)/i, 'Algorithm Sovereignty by planetary AI core.'), icon: ShieldCheck, color: 'text-emerald-400' },
      { title: 'Social Strata', desc: findVal(/(?:Social Hierarchy|Social Strata):\s*(.*)/i, 'The Indexed vs The Ghost: System net accessibility.'), icon: Cpu, color: 'text-cyan-400' },
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
    <div className={s.content.container}>


      {isEditing ? (
        <StudioEditor
          content={content}
          onContentChange={onContentChange}
          isEditing={isEditing}
          placeholder="Define your world systems and mechanics here..."
        />
      ) : (
        <div className={s.content.contentArea}>
          <div className={s.content.mainColumn}>
            <div className={s.content.prose} style={{ '--prose-accent-color': '#10b981' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className={s.content.sidebar + " space-y-8"}>
            <div className={s.content.sidebarCard}>
              <div className={s.content.sidebarGlow + " bg-emerald-500/5 group-hover:bg-emerald-500/10"} />
              <div className={s.content.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.content.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-emerald-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-xs font-bold text-emerald-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.content.sidebarPromptInput + " focus:border-emerald-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the system mechanics with specific instructions..."
                  />
                ) : (
                  <div className={s.content.sidebarPromptBox}>
                    <p className={s.content.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.content.sidebarNote}>
                  Focus the AI on specific economic models, governance structures, or technological laws unique to this world.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {systems.map((sys, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={s.content.statCard + " hover:border-emerald-500/30"}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px] pointer-events-none" />
                  <div className={s.content.statIconBox + " " + sys.color}>
                    <sys.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest line-clamp-1">{sys.title}</h3>
                    <p className="text-xs font-medium text-zinc-500 leading-relaxed line-clamp-3">{sys.desc}</p>
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

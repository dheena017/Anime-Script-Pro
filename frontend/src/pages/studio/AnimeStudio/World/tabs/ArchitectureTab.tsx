import React from 'react';
import { motion } from 'framer-motion';
import { StudioEditor } from '../../components/StudioEditor';
import { Building2, Home, Factory, Landmark, Sparkles, Layout } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TableOfContents } from '../components/TableOfContents';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { worldStyles as s } from '../worldStyles';

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
  const { textareaRef: promptTextareaRef, scheduleResizeTextarea: schedulePromptResize } = useAutoResizeTextarea(prompt || '', isEditing);

  const structures = React.useMemo(() => {
    const findVal = (regex: RegExp, fallback: string) => {
      const match = content?.match(regex);
      return match ? match[1].trim() : fallback;
    };
    return [
      { label: 'Style', val: findVal(/(?:Style|Aesthetic):\s*(.*)/i, 'Brutalist Neofuturism'), icon: Landmark, color: 'text-orange-400' },
      { label: 'Materials', val: findVal(/(?:Materials|Elements):\s*(.*)/i, 'Nano-Concrete & Glass'), icon: Factory, color: 'text-zinc-400' },
      { label: 'Scale', val: findVal(/(?:Scale|Density):\s*(.*)/i, 'Vertical Megacities'), icon: Building2, color: 'text-blue-400' },
      { label: 'Common', val: findVal(/(?:Housing|Living):\s*(.*)/i, 'Modular Capsule Pods'), icon: Home, color: 'text-emerald-400' },
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
          placeholder="Define the architectural styles, materials, and urban planning of your world here..."
        />
      ) : (
        <div className={s.content.contentArea}>
          <div className={s.content.mainColumn}>
            <div className={s.content.prose} style={{ '--prose-accent-color': '#f97316' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className={s.content.sidebar + " space-y-8"}>
            <div className={s.content.sidebarCard}>
              <div className={s.content.sidebarGlow + " bg-orange-500/5 group-hover:bg-orange-500/10"} />
              <div className={s.content.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.content.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-orange-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-xs font-bold text-orange-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.content.sidebarPromptInput + " focus:border-orange-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the architectural synthesis with specific instructions..."
                  />
                ) : (
                  <div className={s.content.sidebarPromptBox}>
                    <p className={s.content.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.content.sidebarNote}>
                  Focus the AI on specific aesthetics, building materials, or urban planning principles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {structures.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={s.content.statCard + " flex items-center gap-5 border-r-2 border-r-orange-500/20"}
                >
                  <div className={s.content.statIconBox + " " + item.color}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={s.content.statLabel}>{item.label}</span>
                    <p className={s.content.statValue}>{item.val}</p>
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

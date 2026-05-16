import React from 'react';
import { motion } from 'framer-motion';
import { StudioEditor } from '../../components/StudioEditor';
import { Zap, Sparkles, Sword, Shield, Flame, Wind, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TableOfContents } from '../components/TableOfContents';
import { worldStyles as s } from '../worldStyles';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';

interface PowersTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  prompt?: string;
  onPromptChange?: (p: string) => void;
}

export const PowersTab: React.FC<PowersTabProps> = ({
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

  const powerStats = React.useMemo(() => {
    const findVal = (regex: RegExp, fallback: string) => {
      const match = content?.match(regex);
      return match ? match[1].trim() : fallback;
    };
    return [
      { label: 'Source', val: findVal(/(?:Source|Origin):\s*(.*)/i, 'Primal Aether'), icon: Activity, color: 'text-amber-400' },
      { label: 'Offense', val: findVal(/(?:Offense|Attack):\s*(.*)/i, 'S-Rank Destruction'), icon: Sword, color: 'text-red-400' },
      { label: 'Defense', val: findVal(/(?:Defense|Protection):\s*(.*)/i, 'Phase-Shift Barriers'), icon: Shield, color: 'text-blue-400' },
      { label: 'Rarity', val: findVal(/(?:Rarity|Tier):\s*(.*)/i, 'Legendary Inheritance'), icon: Flame, color: 'text-orange-400' },
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
          placeholder="Define your power system, abilities, and mechanics here..."
        />
      ) : (
        <div className={s.content.contentArea}>
          <div className={s.content.mainColumn}>
            <div className={s.content.prose} style={{ '--prose-accent-color': '#fbbf24' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className={s.content.sidebar + " space-y-8"}>
            <div className={s.content.sidebarCard}>
              <div className={s.content.sidebarGlow + " bg-amber-500/5 group-hover:bg-amber-500/10"} />
              <div className={s.content.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.content.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-amber-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-xs font-bold text-amber-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.content.sidebarPromptInput + " focus:border-amber-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the power synthesis with specific instructions..."
                  />
                ) : (
                  <div className={s.content.sidebarPromptBox}>
                    <p className={s.content.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.content.sidebarNote}>
                  Focus the AI on specific rules, energy sources, or unique limitations of the power system.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {powerStats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={s.content.statCard + " flex flex-col items-center text-center space-y-2"}
                >
                  <div className={cn(s.content.statIconBox, stat.color)}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className={s.content.statLabel}>{stat.label}</span>
                  <p className={s.content.statValue}>{stat.val}</p>
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

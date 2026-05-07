import React from 'react';
import { motion } from 'framer-motion';
import { StudioEditor } from '../../components/StudioEditor';
import { Zap, Shield, Flame, Activity, Sparkles, ClipboardList, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { studioLog, reportGeneration } from '@/lib/studio-logger';
import { TableOfContents } from '../components/TableOfContents';
import { worldStyles as s } from '../worldStyles/worldStyles';
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

  const stats = React.useMemo(() => [
    { title: 'Core Source', icon: Zap, color: 'text-amber-400', desc: 'The fundamental energy driving the world.' },
    { title: 'Mastery Level', icon: Activity, color: 'text-studio', desc: 'Progression from novice to legendary.' },
    { title: 'Hard Limits', icon: Shield, color: 'text-emerald-400', desc: 'Costs and physical tolls of usage.' },
    { title: 'Forbidden', icon: Flame, color: 'text-rose-400', desc: 'Taboo powers and corruption risks.' },
  ], []);

  return (
    <div className={s.container}>


      {isEditing ? (
        <StudioEditor
          content={content}
          onContentChange={onContentChange}
          isEditing={isEditing}
          placeholder="Define the laws of your magic/power system..."
        />
      ) : (
        <div className={s.contentArea}>
          <div className={s.mainColumn}>
            <div className={s.prose} style={{ '--prose-accent-color': '#fbbf24' } as React.CSSProperties}>
              <ReactMarkdown>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className={cn(s.sidebar, "space-y-8")}>
            <div className={s.sidebarCard}>
              <div className={s.sidebarGlow + " bg-amber-500/5 group-hover:bg-amber-500/10"} />
              <div className={s.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-amber-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-amber-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.sidebarPromptInput + " focus:border-amber-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      studioLog('PowersTab', `Refining Power System Seed. Length: ${val.length} chars.`, 'info');
                      onPromptChange?.(val);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the power mechanics with specific instructions..."
                  />
                ) : (
                  <div className={s.sidebarPromptBox}>
                    <p className={s.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.sidebarNote}>
                  Focus the AI on specific mechanics, limits, or energy types unique to this world.
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
                  className={s.statCard + " hover:border-amber-500/30"}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[40px] pointer-events-none" />
                  <div className={s.statIconBox + " " + stat.color}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest line-clamp-1">{stat.title}</h3>
                    <p className="text-[10px] font-medium text-zinc-500 leading-relaxed line-clamp-2">{stat.desc}</p>
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

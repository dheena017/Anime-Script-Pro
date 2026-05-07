import React from 'react';
import ReactMarkdown from 'react-markdown';
import { StudioEditor } from '../../components/StudioEditor';
import { Users, Flag, Sword, Landmark, Sparkles, ClipboardList, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { TableOfContents } from '../components/TableOfContents';
import { worldStyles as s } from '../worldStyles/worldStyles';
import { cn } from '@/lib/utils';
import remarkGfm from 'remark-gfm';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { reportGeneration } from '@/lib/studio-logger';

interface FactionsTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  prompt?: string;
  onPromptChange?: (p: string) => void;
}

export const FactionsTab: React.FC<FactionsTabProps> = ({
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
    { title: 'Alliances', icon: Landmark, color: 'text-blue-400', desc: 'Diplomatic treaties and hidden collaborations.' },
    { title: 'Territories', icon: Flag, color: 'text-studio', desc: 'Lands and resources controlled by factions.' },
    { title: 'Conflict', icon: Sword, color: 'text-rose-400', desc: 'Active wars and ideological friction points.' },
    { title: 'Leadership', icon: Users, color: 'text-emerald-400', desc: 'Hierarchies and governing philosophies.' },
  ], []);

  const handleGenerate = () => {
    if (onGenerate) {
      reportGeneration('WORLD', 'Faction Synthesis', 'request', 'anime');
      onGenerate();
    }
  };

  React.useEffect(() => {
    if (!isGenerating && content && content.length > 0) {
      // This is a bit naive but shows completion when generating finishes
      // In a real app we'd trigger this from the parent's success callback
    }
  }, [isGenerating, content]);

  return (
    <div className={s.container}>


      {isEditing ? (
        <StudioEditor
          content={content}
          onContentChange={onContentChange}
          isEditing={isEditing}
          placeholder="Design your world's political landscape..."
        />
      ) : (
        <div className={s.contentArea}>
          <div className={s.mainColumn}>
            <div className={s.prose} style={{ '--prose-accent-color': '#60a5fa' } as React.CSSProperties}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className={cn(s.sidebar, "space-y-8")}>
            <div className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 blur-[40px] pointer-events-none group-hover:bg-blue-500/10 transition-all duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-blue-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-blue-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] font-medium text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/30 transition-colors min-h-[100px] resize-none overflow-hidden"
                    value={prompt || ''}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the faction dynamics with specific instructions..."
                  />
                ) : (
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-zinc-500 leading-relaxed italic">
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed">
                  Refine the political landscape by defining key conflicts, leadership styles, or hidden agendas.
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
                  className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative group overflow-hidden hover:border-blue-500/30 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] pointer-events-none" />
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center ${stat.color}`}>
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


import React from 'react';
import { motion } from 'framer-motion';
import { StudioEditor } from '../../components/StudioEditor';
import { Map, MapPin, Compass, Globe, Sparkles, Navigation, ScrollText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TableOfContents } from '../components/TableOfContents';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { worldStyles as s } from '../worldStyles';

interface AtlasTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  prompt?: string;
  onPromptChange?: (p: string) => void;
}

export const AtlasTab: React.FC<AtlasTabProps> = ({
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

  const locations = React.useMemo(() => {
    const findLocs = (regex: RegExp) => {
      const matches = content?.matchAll(regex);
      return matches ? Array.from(matches).map(m => m[1].trim()).slice(0, 4) : [];
    };
    return findLocs(/(?:Location|Landmark|Region):\s*(.*)/gi);
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
          placeholder="Map out your world regions, landmarks, and geography here..."
        />
      ) : (
        <div className={s.content.contentArea}>
          <div className={s.content.mainColumn}>
            <div className={s.content.prose} style={{ '--prose-accent-color': '#22d3ee' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className={s.content.sidebar + " space-y-8"}>
            <div className={s.content.sidebarCard}>
              <div className={s.content.sidebarGlow + " bg-blue-500/5 group-hover:bg-blue-500/10"} />
              <div className={s.content.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.content.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-blue-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-xs font-bold text-blue-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.content.sidebarPromptInput + " focus:border-blue-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      onPromptChange?.(e.target.value);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the atlas synthesis with specific instructions..."
                  />
                ) : (
                  <div className={s.content.sidebarPromptBox}>
                    <p className={s.content.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.content.sidebarNote}>
                  Focus the AI on specific terrain types, climate anomalies, or strategic landmarks.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className={s.content.sidebarTitle}>
                <Navigation className="w-3 h-3" /> Key Strategic Points
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {locations.length > 0 ? locations.map((loc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-blue-500/30 transition-all">
                    <MapPin className="w-3 h-3 text-blue-500/50 group-hover:text-blue-400" />
                    <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-tight">{loc}</span>
                  </div>
                )) : (
                  <div className="p-4 bg-white/[0.01] border border-white/5 border-dashed rounded-xl text-center">
                    <p className="text-xs font-bold text-zinc-600 uppercase">Geographic data scanning...</p>
                  </div>
                )}
              </div>
            </div>

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

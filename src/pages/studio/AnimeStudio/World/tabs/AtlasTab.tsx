import React from 'react';
import { Map, Compass, Globe, Navigation, Sparkles, ClipboardList, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { studioLog, reportGeneration } from '@/lib/studio-logger';
import { TableOfContents } from '../components/TableOfContents';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';
import { worldStyles as s } from '../worldStyles/worldStyles';

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
  const { textareaRef: mainTextareaRef, scheduleResizeTextarea: scheduleMainResize } = useAutoResizeTextarea(content || '', isEditing);
  const { textareaRef: promptTextareaRef, scheduleResizeTextarea: schedulePromptResize } = useAutoResizeTextarea(prompt || '', isEditing);

  const stats = React.useMemo(() => {
    const findVal = (regex: RegExp, fallback: string) => {
      const match = content?.match(regex);
      return match ? match[1].trim() : fallback;
    };
    return [
      { label: 'Primary Continent', val: findVal(/(?:Primary Continent|Continent):\s*(.*)/i, 'Neo-Pangea'), icon: Compass },
      { label: 'Climate Profile', val: findVal(/(?:Climate Profile|Climate):\s*(.*)/i, 'Bioluminescent Tropical'), icon: Navigation },
      { label: 'Resource Density', val: findVal(/(?:Resource Density|Resources):\s*(.*)/i, 'High / Etheric'), icon: Map },
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
            <div className="world-badge bg-blue-500/10 border-blue-500/20">
              <Map className="w-3 h-3 text-blue-500" />
              <span className="world-badge-text text-blue-500">Geographic Cartographer</span>
            </div>
            <h1 className="world-header-title">
              REALM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400">CARTOGRAPHY</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onGenerate && (
              <button 
                onClick={() => {
                  reportGeneration('AtlasTab', 'Regional synthesis', 'request', 'anime');
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
                studioLog('AtlasTab', 'Copying Atlas Manifest to clipboard...', 'info');
                navigator.clipboard.writeText(content);
                studioLog('AtlasTab', 'Atlas Manifest copied successfully.', 'success');
                alert('Atlas Manifest copied!');
              }}
              className={s.actionButtonGhost}
            >
              <ClipboardList className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest">Copy</span>
            </button>
            
            <button 
              onClick={() => {
                studioLog('AtlasTab', 'Downloading Atlas Manifest...', 'info');
                const element = document.createElement("a");
                const file = new Blob([content], { type: 'text/markdown' });
                element.href = URL.createObjectURL(file);
                element.download = "Atlas_Manifest.md";
                document.body.appendChild(element);
                element.click();
                studioLog('AtlasTab', 'Atlas Manifest download initiated.', 'success');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-full transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Download</span>
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
          placeholder="Map out your world geography here..."
        />
      ) : (
        <div className="world-content-area">
          <div className="world-main-column">
            <div className="world-prose" style={{ '--prose-accent-color': '#3b82f6' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className="world-sidebar space-y-8">
            <div className={s.sidebarCard}>
              <div className={s.sidebarGlow + " bg-blue-500/5 group-hover:bg-blue-500/10"} />
              <div className={s.sidebarContent}>
                <div className="flex items-center justify-between">
                  <h4 className={s.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-blue-500" /> Core Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-blue-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    ref={promptTextareaRef}
                    className={s.sidebarPromptInput + " focus:border-blue-500/30"}
                    value={prompt || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      studioLog('AtlasTab', `Refining Atlas Seed. Length: ${val.length} chars.`, 'info');
                      onPromptChange?.(val);
                      schedulePromptResize();
                    }}
                    onInput={schedulePromptResize}
                    placeholder="Refine the geographic synthesis with specific instructions..."
                  />
                ) : (
                  <div className={s.sidebarPromptBox}>
                    <p className={s.sidebarPromptText}>
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className={s.sidebarNote}>
                  Focus the AI on specific biomes, landmark names, or environmental hazards unique to this world.
                </p>
              </div>
            </div>

            <div className="p-10 bg-[#050505] border border-white/5 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 blur-[100px] group-hover:bg-blue-500/10 transition-all duration-700" />
              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse">
                  <Globe className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">World Map Generation</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                  Creating your world's geography and regional boundaries based on your story.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {stats.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] flex items-center gap-6 group hover:border-blue-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                    <p className="text-sm font-black text-white uppercase tracking-tighter mt-1 line-clamp-1">{item.val}</p>
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

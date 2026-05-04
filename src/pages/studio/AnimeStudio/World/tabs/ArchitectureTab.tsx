import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Building2, Castle, Ruler, Layers, Sparkles, ClipboardList, Download, Zap } from 'lucide-react';
import { TableOfContents } from '../components/TableOfContents';

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
      <div className="world-header">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="world-badge bg-orange-500/10 border-orange-500/20">
              <Building2 className="w-3 h-3 text-orange-500" />
              <span className="world-badge-text text-orange-500">Structural Architect</span>
            </div>
            <h1 className="world-header-title">
              VISUAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400">STRUCTURES</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onGenerate && (
              <button 
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-full transition-all group disabled:opacity-50"
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
                alert('Architecture Manifest copied!');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
            >
              <ClipboardList className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest">Copy</span>
            </button>
            
            <button 
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([content], { type: 'text/markdown' });
                element.href = URL.createObjectURL(file);
                element.download = "Architecture_Manifest.md";
                document.body.appendChild(element);
                element.click();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-full transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Download</span>
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="world-textarea"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
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
            <div className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500/5 blur-[40px] pointer-events-none group-hover:bg-orange-500/10 transition-all duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-orange-500" /> Neural Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-orange-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] font-medium text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/30 transition-colors min-h-[100px] resize-none"
                    value={prompt || ''}
                    onChange={(e) => onPromptChange?.(e.target.value)}
                    placeholder="Refine the architectural style with specific instructions..."
                  />
                ) : (
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-zinc-500 leading-relaxed italic">
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed">
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
                  className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative group overflow-hidden hover:border-orange-500/30 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-[40px] pointer-events-none" />
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter line-clamp-1">{stat.val}</h3>
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

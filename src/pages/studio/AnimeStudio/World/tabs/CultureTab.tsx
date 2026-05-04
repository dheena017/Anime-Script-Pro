import React from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Utensils, Heart, Sparkles, ClipboardList, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TableOfContents } from '../components/TableOfContents';

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

  const cultureItems = React.useMemo(() => {
    const findVal = (regex: RegExp, fallback: string) => {
      const match = content?.match(regex);
      return match ? match[1].trim() : fallback;
    };
    return [
      { label: 'Traditions', val: findVal(/(?:Tradition|Ritual):\s*(.*)/i, 'Neo-Matsuri'), icon: Heart, color: 'text-rose-400' },
      { label: 'Cuisine', val: findVal(/(?:Cuisine|Food):\s*(.*)/i, 'Synthetic Soul'), icon: Utensils, color: 'text-orange-400' },
      { label: 'Arts', val: findVal(/(?:Art|Music):\s*(.*)/i, 'Holographic Echo'), icon: Music, color: 'text-fuchsia-400' },
      { label: 'Identity', val: findVal(/(?:Identity|Social Role):\s*(.*)/i, 'Neural Nomad'), icon: Users, color: 'text-blue-400' },
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
                alert('Culture Manifest copied!');
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
          className="world-textarea"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
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
            <div className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-rose-500/5 blur-[40px] pointer-events-none group-hover:bg-rose-500/10 transition-all duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-rose-500" /> Neural Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-rose-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] font-medium text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-rose-500/30 transition-colors min-h-[100px] resize-none"
                    value={prompt || ''}
                    onChange={(e) => onPromptChange?.(e.target.value)}
                    placeholder="Refine the cultural synthesis with specific instructions..."
                  />
                ) : (
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-zinc-500 leading-relaxed italic">
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed">
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
                  className="p-6 bg-[#050505] border border-white/5 rounded-3xl flex flex-col items-center text-center space-y-4 hover:bg-white/[0.02] transition-colors border-l-2 border-l-rose-500/20 group"
                >
                  <div className={`w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{item.label}</span>
                    <p className="text-sm font-black text-white uppercase tracking-tighter line-clamp-1">{item.val}</p>
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

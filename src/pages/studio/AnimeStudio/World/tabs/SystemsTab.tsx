import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, ShieldCheck, Sparkles, ClipboardList, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TableOfContents } from '../components/TableOfContents';

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

  const systems = React.useMemo(() => {
    const findVal = (regex: RegExp, fallback: string) => {
      const match = content?.match(regex);
      return match ? match[1].trim() : fallback;
    };
    return [
      { title: 'Power System', desc: findVal(/(?:Power System|Power):\s*(.*)/i, 'Neural-Arcana manipulation through cognitive overloading.'), icon: Zap, color: 'text-amber-400' },
      { title: 'Economy', desc: findVal(/(?:Economy|Currency):\s*(.*)/i, 'Credits & Karma: A dual-currency social contribution system.'), icon: Activity, color: 'text-blue-400' },
      { title: 'Governance', desc: findVal(/(?:Governance|Government):\s*(.*)/i, 'Algorithm Sovereignty by planetary AI core.'), icon: ShieldCheck, color: 'text-emerald-400' },
      { title: 'Social Strata', desc: findVal(/(?:Social Hierarchy|Social Strata):\s*(.*)/i, 'The Indexed vs The Ghost: Neural net accessibility.'), icon: Cpu, color: 'text-cyan-400' },
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
            <div className="world-badge bg-emerald-500/10 border-emerald-500/20">
              <Cpu className="w-3 h-3 text-emerald-500" />
              <span className="world-badge-text text-emerald-500">Mechanical Logic</span>
            </div>
            <h1 className="world-header-title">
              WORLD <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400">DYNAMICS</span>
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
                alert('Systems Manifest copied!');
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
                element.download = "Systems_Manifest.md";
                document.body.appendChild(element);
                element.click();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-full transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Download</span>
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="world-textarea"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Define your world systems and mechanics here..."
        />
      ) : (
        <div className="world-content-area">
          <div className="world-main-column">
            <div className="world-prose" style={{ '--prose-accent-color': '#10b981' } as React.CSSProperties}>
              <ReactMarkdown components={customComponents}>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className="world-sidebar space-y-8">
            <div className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-emerald-500" /> Neural Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-emerald-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] font-medium text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/30 transition-colors min-h-[100px] resize-none"
                    value={prompt || ''}
                    onChange={(e) => onPromptChange?.(e.target.value)}
                    placeholder="Refine the system mechanics with specific instructions..."
                  />
                ) : (
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-zinc-500 leading-relaxed italic">
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed">
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
                  className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative group overflow-hidden hover:border-emerald-500/30 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px] pointer-events-none" />
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center ${sys.color}`}>
                    <sys.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest line-clamp-1">{sys.title}</h3>
                    <p className="text-[10px] font-medium text-zinc-500 leading-relaxed line-clamp-3">{sys.desc}</p>
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

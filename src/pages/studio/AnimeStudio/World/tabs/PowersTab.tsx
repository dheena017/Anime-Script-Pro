import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Flame, Activity, Sparkles, ClipboardList, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TableOfContents } from '../components/TableOfContents';

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

  const stats = React.useMemo(() => [
    { title: 'Core Source', icon: Zap, color: 'text-amber-400', desc: 'The fundamental energy driving the world.' },
    { title: 'Mastery Level', icon: Activity, color: 'text-studio', desc: 'Progression from novice to legendary.' },
    { title: 'Hard Limits', icon: Shield, color: 'text-emerald-400', desc: 'Costs and physical tolls of usage.' },
    { title: 'Forbidden', icon: Flame, color: 'text-rose-400', desc: 'Taboo powers and corruption risks.' },
  ], []);

  return (
    <div className="world-container">
      <div className="world-header">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="world-badge bg-amber-500/10 border-amber-500/20">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="world-badge-text text-amber-500">Universal System</span>
            </div>
            <h1 className="world-header-title">
              POWER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400">MECHANICS</span>
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
                alert('Power System Manifest copied!');
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
                element.download = "Power_System_Manifest.md";
                document.body.appendChild(element);
                element.click();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-full transition-all group"
            >
              <Download className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Download</span>
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="world-textarea"
          value={content || ''}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Design your power system mechanics here..."
        />
      ) : (
        <div className="world-content-area">
          <div className="world-main-column">
            <div className="world-prose" style={{ '--prose-accent-color': '#fbbf24' } as React.CSSProperties}>
              <ReactMarkdown>{sectionContent}</ReactMarkdown>
            </div>
          </div>

          <div className="world-sidebar space-y-8">
            <div className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-amber-500/5 blur-[40px] pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Neural Seed
                  </h4>
                  {isEditing && <span className="text-[8px] font-bold text-amber-500/50 uppercase">Modular Prompt</span>}
                </div>
                
                {isEditing ? (
                  <textarea
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] font-medium text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/30 transition-colors min-h-[100px] resize-none"
                    value={prompt || ''}
                    onChange={(e) => onPromptChange?.(e.target.value)}
                    placeholder="Refine the power mechanics with specific instructions..."
                  />
                ) : (
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-zinc-500 leading-relaxed italic">
                      {prompt ? `"${prompt.substring(0, 120)}${prompt.length > 120 ? '...' : ''}"` : 'Using global project seed for synthesis.'}
                    </p>
                  </div>
                )}
                
                <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter leading-relaxed">
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
                  className="p-6 bg-[#050505] border border-white/5 rounded-[2rem] space-y-4 relative group overflow-hidden hover:border-amber-500/30 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[40px] pointer-events-none" />
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

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';

interface WorldOutputViewerProps {
  isEditing: boolean;
  content: string;
  prompt?: string;
  onContentChange: (val: string) => void;
}

export const WorldOutputViewer = React.memo(({ isEditing, content, prompt, onContentChange }: WorldOutputViewerProps) => {
  const { textareaRef, scheduleResizeTextarea } = useAutoResizeTextarea(content || '', isEditing);

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        className="world-textarea overflow-hidden"
        value={content || ''}
        onChange={(e) => {
          onContentChange(e.target.value);
          scheduleResizeTextarea();
        }}
        onInput={scheduleResizeTextarea}
        placeholder="Manually architect your world lore here..."
      />
    );
  }

  // Extract pure string from React nodes for ID generation
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && node.props && node.props.children) return extractText(node.props.children);
    return '';
  };

  // Custom markdown renderers to add animations and ID tags for TOC linking
  const customComponents = React.useMemo(() => ({
    h2: ({ node, ...props }: any) => {
      const text = extractText(props.children);
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return (
        <motion.h2 
          id={id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          {...props} 
        />
      );
    },
    p: ({ node, ...props }: any) => (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        {...props} 
      />
    )
  }), []);

  return (
    <div className="world-content-area">
      {/* Main Content Area */}
      <div className="world-main-column">
        <div className="world-prose">
          <ReactMarkdown components={customComponents}>{content}</ReactMarkdown>
        </div>
      </div>
      
      {/* Sidebar (Manifest + TOC) */}
      <div className="world-sidebar">
        {/* Lore Manifest */}
        <div className="p-6 bg-studio/5 border border-studio/10 rounded-[2rem] space-y-6">
          <h4 className="text-[10px] font-black text-studio uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3" /> Lore Manifest
          </h4>
          <div className="space-y-4">
            {[
              { label: "Geography", val: "Rendered" },
              { label: "Metaphysics", val: "Active" },
              { label: "Timeline", val: "Synced" },
              { label: "Sociology", val: "Archived" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</span>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{item.val}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-studio/10">
            <p className="text-[9px] text-zinc-600 font-medium leading-relaxed uppercase">
              World data is now locked as the "Source of Truth" for all subsequent Script and Beat generation.
            </p>
          </div>
        </div>

        {/* Core Seed */}
        {prompt && (
          <div className="p-6 bg-black/40 border border-white/5 rounded-[2rem] space-y-4">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Core Seed</h4>
            <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
              <p className="text-[9px] font-mono text-studio/70 break-all leading-relaxed">
                {prompt.substring(0, 150)}...
              </p>
            </div>
          </div>
        )}

        {/* Quick Navigation TOC */}
        <div className="pt-2">
          <TableOfContents content={content} />
        </div>
      </div>
    </div>
  );
});






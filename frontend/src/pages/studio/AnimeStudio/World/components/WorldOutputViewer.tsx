import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';

interface WorldOutputViewerProps {
  isEditing: boolean;
  content: string;
  prompt?: string;
  onContentChange: (val: string) => void;
}

export const WorldOutputViewer = React.memo(({ isEditing, content, onContentChange }: WorldOutputViewerProps) => {
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
    </div>
  );
});






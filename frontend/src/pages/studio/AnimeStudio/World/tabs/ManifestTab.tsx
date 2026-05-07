import React, { useMemo } from 'react';
import { FileText, Download, ClipboardList, Sparkles, Bold, Italic, Heading2, Code, List, Quote } from 'lucide-react';
import { StudioEditor } from '../components/StudioEditor';
import ReactMarkdown from 'react-markdown';
import { studioLog } from '@/lib/studio-logger';
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea';

interface ManifestTabProps {
  isEditing: boolean;
  content: string;
  onContentChange: (content: string) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export const ManifestTab: React.FC<ManifestTabProps> = ({
  isEditing,
  content,
  onContentChange,
  onGenerate,
  isGenerating
}) => {
  const { textareaRef, scheduleResizeTextarea } = useAutoResizeTextarea(content || '', isEditing);

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [content]);

  const charCount = content.length;
  const lineCount = content.split('\n').length;

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    onContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
      scheduleResizeTextarea();
    }, 0);
  };

  const downloadReport = () => {
    studioLog('ManifestTab', 'Exporting World Bible Full Report...', 'info');
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "World_Bible_Full_Report.md";
    document.body.appendChild(element);
    element.click();
    studioLog('ManifestTab', 'World Bible Full Report export initiated.', 'success');
  };

  const copyToClipboard = () => {
    studioLog('ManifestTab', 'Copying World Bible to clipboard...', 'info');
    navigator.clipboard.writeText(content);
    studioLog('ManifestTab', 'World Bible copied successfully.', 'success');
    alert('Full World Bible copied to clipboard!');
  };

  // Memoize markdown to prevent re-renders on scroll or state changes
  const MemoizedMarkdown = useMemo(() => (
    <ReactMarkdown>{content}</ReactMarkdown>
  ), [content]);

  return (
    <div className="world-container will-change-transform transform-gpu">


      {isEditing ? (
        <StudioEditor
          content={content}
          onContentChange={onContentChange}
          isEditing={isEditing}
          placeholder="Edit your comprehensive world bible here...

Use markdown formatting:
• **Bold** for emphasis
• _Italic_ for subtle text
• ## Headings for sections
• `Code` for technical terms
• - Lists for items
• > Quotes for important notes"
        />
      ) : (
        <div className="world-content-area relative">
          {/* Blueprint Background */}
          <div className="absolute inset-0 world-bible-blueprint pointer-events-none opacity-30 rounded-3xl" />
          
          {/* Content */}
          <div className="world-main-column relative z-10">
            <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 rounded-3xl p-8 lg:p-16 backdrop-blur-sm relative overflow-hidden group">
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-studio/0 via-studio/[0.02] to-studio/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
              
              <div className="world-prose max-w-none relative z-10">
                {MemoizedMarkdown}
              </div>

              {/* Terminal Footer */}
              <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-70 transition-opacity">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">End of Transmission</span>
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">World Builder v2.0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

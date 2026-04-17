import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Shield } from 'lucide-react';
import { StudioModulePanel } from '@/components/studio/StudioModulePanel';

interface ReferencePanelProps {
  title: string;
  subtitle: string;
  content: string;
}

export function ReferencePanel({ title, subtitle, content }: ReferencePanelProps) {
  return (
    <StudioModulePanel
      title={title}
      subtitle={subtitle}
      icon={<Shield className="w-5 h-5" />}
    >
      <div className="prose prose-invert prose-zinc max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </StudioModulePanel>
  );
}

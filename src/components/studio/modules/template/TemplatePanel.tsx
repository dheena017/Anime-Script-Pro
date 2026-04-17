import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Shield } from 'lucide-react';
import { StudioModulePanel } from '@/components/studio/core/StudioModulePanel';
import { templateMarkdown } from '@/data/studio/templateMarkdown';

export function TemplatePanel() {
  return (
    <StudioModulePanel
      title="Blueprint Terminal"
      subtitle="Standard V2.4"
      icon={<Shield className="w-5 h-5" />}
    >
      <div className="prose prose-invert prose-zinc max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{templateMarkdown}</ReactMarkdown>
      </div>
    </StudioModulePanel>
  );
}

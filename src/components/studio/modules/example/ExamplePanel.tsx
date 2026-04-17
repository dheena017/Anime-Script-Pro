import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Shield } from 'lucide-react';
import { StudioModulePanel } from '@/components/studio/core/StudioModulePanel';
import { exampleScript } from '@/data/studio/exampleScript';

export function ExamplePanel() {
  return (
    <StudioModulePanel
      title="Reference Archive"
      subtitle="Masterscript V1.0"
      icon={<Shield className="w-5 h-5" />}
    >
      <div className="prose prose-invert prose-zinc max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{exampleScript}</ReactMarkdown>
      </div>
    </StudioModulePanel>
  );
}

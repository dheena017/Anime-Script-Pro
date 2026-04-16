import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollText, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/page/PageShell';
import { StudioOutputPanel } from '@/components/studio/StudioOutputPanel';
import { templateMarkdown } from '@/data/studio/templateMarkdown';

export function TemplatePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionHeading
        title="Script Template"
        icon={<ScrollText className="w-5 h-5 text-red-500" />}
      />

      <StudioOutputPanel
        headingIcon={<Sparkles className="w-4 h-4" />}
        headingText="Industry Standard Structure"
        loading={false}
        loadingText=""
        hasContent={true}
        emptyIcon={<ScrollText className="w-12 h-12" />}
        emptyText=""
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{templateMarkdown}</ReactMarkdown>
      </StudioOutputPanel>
    </motion.div>
  );
}

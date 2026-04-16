import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/page/PageShell';
import { StudioOutputPanel } from '@/components/studio/StudioOutputPanel';
import { exampleScript } from '@/data/studio/exampleScript';

export function ExamplePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionHeading
        title="Example Script"
        icon={<Play className="w-5 h-5 text-red-500" />}
      />

      <StudioOutputPanel
        headingIcon={<Sparkles className="w-4 h-4" />}
        headingText="Reference Masterpiece"
        loading={false}
        loadingText=""
        hasContent={true}
        emptyIcon={<Play className="w-12 h-12" />}
        emptyText=""
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{exampleScript}</ReactMarkdown>
      </StudioOutputPanel>
    </motion.div>
  );
}

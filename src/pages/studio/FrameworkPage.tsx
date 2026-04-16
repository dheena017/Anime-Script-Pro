import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LayoutGrid, Sparkles, Wand2 } from 'lucide-react';
import { SectionHeading } from '@/components/page/PageShell';
import { StudioOutputPanel } from '@/components/studio/StudioOutputPanel';
import { frameworkMarkdown } from '@/data/studio/frameworkMarkdown';

export function FrameworkPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionHeading
        title="Production Framework"
        icon={<LayoutGrid className="w-5 h-5 text-red-500" />}
      />

      <StudioOutputPanel
        headingIcon={<Wand2 className="w-4 h-4" />}
        headingText="Scene-by-Scene Methodology"
        loading={false}
        loadingText=""
        hasContent={true}
        emptyIcon={<LayoutGrid className="w-12 h-12" />}
        emptyText=""
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{frameworkMarkdown}</ReactMarkdown>
      </StudioOutputPanel>
    </motion.div>
  );
}

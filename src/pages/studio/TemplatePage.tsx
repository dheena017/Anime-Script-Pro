import React from 'react';
import { ScrollText } from 'lucide-react';
import { TemplateTopBar } from '@/components/studio/modules/template/TemplateTopBar';
import { TemplatePanel } from '@/components/studio/modules/template/TemplatePanel';

export function TemplatePage() {
  return (
    <TemplateTopBar>
      <TemplatePanel />
    </TemplateTopBar>
  );
}

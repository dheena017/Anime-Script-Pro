import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { FrameworkTopBar } from '@/components/studio/modules/framework/FrameworkTopBar';
import { FrameworkPanel } from '@/components/studio/modules/framework/FrameworkPanel';

export function FrameworkPage() {
  return (
    <FrameworkTopBar>
      <FrameworkPanel />
    </FrameworkTopBar>
  );
}

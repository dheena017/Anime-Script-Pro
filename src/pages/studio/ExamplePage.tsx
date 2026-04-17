import React from 'react';
import { Play } from 'lucide-react';
import { ExampleTopBar } from '@/components/studio/modules/example/ExampleTopBar';
import { ExamplePanel } from '@/components/studio/modules/example/ExamplePanel';

export function ExamplePage() {
  return (
    <ExampleTopBar>
      <ExamplePanel />
    </ExampleTopBar>
  );
}

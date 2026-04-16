import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StudioOutputPanelProps {
  headingIcon: ReactNode;
  headingText: string;
  loading: boolean;
  loadingText: string;
  hasContent: boolean;
  emptyIcon: ReactNode;
  emptyText: string;
  children: ReactNode;
  heightClassName?: string;
}

export function StudioOutputPanel({
  headingIcon,
  headingText,
  loading,
  loadingText,
  hasContent,
  emptyIcon,
  emptyText,
  children,
  heightClassName = 'h-[600px]',
}: StudioOutputPanelProps) {
  return (
    <Card className="studio-panel">
      <div className="studio-panel-header p-4 flex items-center gap-2 text-red-500">
        {headingIcon}
        <span className="text-xs font-bold uppercase tracking-widest">{headingText}</span>
      </div>
      <ScrollArea className={`${heightClassName} w-full p-6`}>
        <div className="prose prose-invert prose-red max-w-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4" />
              <p>{loadingText}</p>
            </div>
          ) : hasContent ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
              <span className="mb-4 opacity-20">{emptyIcon}</span>
              <p>{emptyText}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}

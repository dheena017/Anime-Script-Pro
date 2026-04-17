import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { StudioOutputPanel } from '@/components/studio/StudioOutputPanel';

interface StudioPanelSectionProps {
  title: string;
  titleIcon: ReactNode;
  titleClassName?: string;
  actionIcon: ReactNode;
  actionLabel: string;
  actionLoadingLabel: string;
  isLoading: boolean;
  onAction: () => void;
  actionDisabled?: boolean;
  actionButtonClassName?: string;
  panelHeadingIcon: ReactNode;
  panelHeadingText: string;
  panelLoadingText: string;
  panelHasContent: boolean;
  panelEmptyIcon: ReactNode;
  panelEmptyText: string;
  panelHeightClassName?: string;
  children: ReactNode;
}

export function StudioPanelSection({
  title,
  titleIcon,
  titleClassName = 'text-xl font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2',
  actionIcon,
  actionLabel,
  actionLoadingLabel,
  isLoading,
  onAction,
  actionDisabled = false,
  actionButtonClassName = 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400',
  panelHeadingIcon,
  panelHeadingText,
  panelLoadingText,
  panelHasContent,
  panelEmptyIcon,
  panelEmptyText,
  panelHeightClassName,
  children,
}: StudioPanelSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={titleClassName}>
          {titleIcon}
          {title}
        </h3>
        <Button
          variant="outline"
          size="sm"
          className={actionButtonClassName}
          onClick={onAction}
          disabled={isLoading || actionDisabled}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-2" />
          ) : (
            <span className="mr-2">{actionIcon}</span>
          )}
          {isLoading ? actionLoadingLabel : actionLabel}
        </Button>
      </div>

      <StudioOutputPanel
        headingIcon={panelHeadingIcon}
        headingText={panelHeadingText}
        loading={isLoading}
        loadingText={panelLoadingText}
        hasContent={panelHasContent}
        emptyIcon={panelEmptyIcon}
        emptyText={panelEmptyText}
        heightClassName={panelHeightClassName}
      >
        {children}
      </StudioOutputPanel>
    </div>
  );
}

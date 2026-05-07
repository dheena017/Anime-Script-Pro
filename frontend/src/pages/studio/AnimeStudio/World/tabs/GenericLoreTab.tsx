import React from 'react';
import { WorldOutputViewer } from '../components/WorldOutputViewer';
import { LucideIcon } from 'lucide-react';
import { worldStyles as s } from '../worldStyles/worldStyles';

interface GenericLoreTabProps {
  isEditing: boolean;
  content: string;
  prompt?: string;
  onContentChange: (val: string) => void;
  icon: LucideIcon;
  label: string;
  accentColor?: string;
}

/**
 * GenericLoreTab
 * A reusable tab component that leverages WorldOutputViewer and TableOfContents
 * to render any lore category with a consistent, premium layout.
 */
export const GenericLoreTab: React.FC<GenericLoreTabProps> = ({
  isEditing,
  content,
  prompt,
  onContentChange,
  accentColor = '#06b6d4' // Default studio cyan
}) => {
  return (
    <div className={s.container}>
      {/* Shared Output Viewer */}
      <div style={{ '--prose-accent-color': accentColor } as React.CSSProperties}>
        <WorldOutputViewer
          isEditing={isEditing}
          content={content}
          prompt={prompt}
          onContentChange={onContentChange}
        />
      </div>
    </div>
  );
};

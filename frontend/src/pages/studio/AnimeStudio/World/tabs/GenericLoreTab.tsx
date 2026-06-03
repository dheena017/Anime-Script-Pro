import React from "react";
import { WorldOutputViewer } from "../components/WorldOutputViewer";
import { LucideIcon } from "lucide-react";
import { worldStyles as s } from "../worldStyles";

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
  icon: Icon,
  label,
  accentColor = "#06b6d4", // Default studio cyan
}) => {
  return (
    <div className={s.content.container}>
      {/* Dynamic Header */}
      <div className={s.content.header}>
        <div className="space-y-3">
          <div
            className={s.content.badge}
            style={{
              backgroundColor: `${accentColor}10`,
              borderColor: `${accentColor}20`,
            }}
          >
            <Icon
              className="w-3 h-3 child-path-fill"
              style={{ color: accentColor }}
            />
            <span
              className={s.content.badgeText}
              style={{ color: accentColor }}
            >
              {label} Domain
            </span>
          </div>
          <h1 className={s.content.headerTitle}>
            {label.toUpperCase()} <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${accentColor}, #ffffff, ${accentColor})`,
              }}
            >
              MODULE
            </span>
          </h1>
        </div>
      </div>

      {/* Shared Output Viewer */}
      <div
        style={{ "--prose-accent-color": accentColor } as React.CSSProperties}
      >
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

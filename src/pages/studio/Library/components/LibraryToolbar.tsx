import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sharedStyles as s } from '../../components/studio/shared/sharedStyles';

interface LibraryToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: any;
  };
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  sortBy?: string;
  onSortChange?: (val: string) => void;
}

export const LibraryToolbar: React.FC<LibraryToolbarProps> = ({
  searchTerm, onSearchChange, searchPlaceholder = "SEARCH WITHIN VAULT...",
  primaryAction, viewMode = 'grid', onViewModeChange, sortBy = 'Recently Modified', onSortChange
}) => {
  return (
    <div className={s.moduleToolbar}>
      <div className={s.toolbarLeft}>
        <div className={s.searchContainer}>
          <Search className={s.searchIcon} />
          <input type="text" placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className={s.searchInput} />
          <div className={s.searchHint}>Ctrl+K</div>
        </div>
      </div>

      <div className={s.toolbarCenter}>
        <button className={s.toolbarButton}>
          <SlidersHorizontal className="w-4 h-4" /><span>Advanced Filters</span>
        </button>
        <button className={s.toolbarButton} onClick={() => onSortChange && onSortChange(sortBy)}>
          <span>Sort: {sortBy}</span><ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className={s.toolbarRight}>
        <div className={s.viewToggleGroup}>
          <button onClick={() => onViewModeChange?.('grid')} className={cn(s.viewToggleBtn, viewMode === 'grid' ? s.viewToggleBtnActive : "text-zinc-600")}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => onViewModeChange?.('list')} className={cn(s.viewToggleBtn, viewMode === 'list' ? s.viewToggleBtnActive : "text-zinc-600")}><List className="w-4 h-4" /></button>
        </div>

        {primaryAction && (
          <button onClick={primaryAction.onClick} className={s.primaryActionBtn}>
            {primaryAction.icon ? <primaryAction.icon className="w-4 h-4" /> : <Plus className="w-4 h-4" />}<span>{primaryAction.label}</span>
          </button>
        )}
      </div>
    </div>
  );
};


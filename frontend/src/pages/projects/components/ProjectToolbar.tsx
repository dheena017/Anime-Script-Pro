import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { projectsStyles as s } from '../projectsStyles';

interface ProjectToolbarProps {
  tabs: { id: string; label: string; icon: any }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onNewProject: () => void;
}

export function ProjectToolbar({ tabs, activeTab, onTabChange, onNewProject }: ProjectToolbarProps) {
  return (
    <div className={s.toolbar}>
      <div className={s.toolbarTabs}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                s.tabButton,
                isActive ? s.tabButtonActive : s.tabButtonInactive
              )}
            >
              <Icon className={cn(
                s.tabIcon,
                isActive ? s.tabIconActive : s.tabIconInactive
              )} />
              <span className={s.tabLabel}>{tab.label}</span>
              {isActive && (
                <div className={s.tabIndicator} />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNewProject}
        className={s.primaryButton}
      >
        <div className={s.primaryButtonGlow} />
        <Plus className="w-5 h-5" />
        NEW PROTOCOL
      </button>
    </div>
  );
}

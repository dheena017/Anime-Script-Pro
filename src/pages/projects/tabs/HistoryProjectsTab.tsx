import { ProjectList } from '../components/ProjectList';

interface ProjectTabProps {
  projects: any[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onDelete: (id: number) => void;
  onOpen: (project: any) => void;
}

export function HistoryProjectsTab(props: ProjectTabProps) {
  const historyProjects = props.projects.filter(p => p.status === 'archived' || p.status === 'history');
  return <ProjectList {...props} projects={historyProjects} />;
}

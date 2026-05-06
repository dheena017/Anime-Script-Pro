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

export function CompletedProjectsTab(props: ProjectTabProps) {
  const completedProjects = props.projects.filter(p => p.status === 'completed');
  return <ProjectList {...props} projects={completedProjects} />;
}

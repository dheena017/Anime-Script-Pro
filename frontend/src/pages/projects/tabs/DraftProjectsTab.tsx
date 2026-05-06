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

export function DraftProjectsTab(props: ProjectTabProps) {
  const draftProjects = props.projects.filter(p => p.status === 'draft' || !p.status);
  return <ProjectList {...props} projects={draftProjects} />;
}

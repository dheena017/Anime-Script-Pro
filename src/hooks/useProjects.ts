import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/api/projects';

export function useProjects() {
  const { data: projects = [], isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });

  return { 
    projects, 
    loading: isLoading, 
    error: error ? (error as any).message : null,
    refetch
  };
}

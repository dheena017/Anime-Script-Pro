import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/api/projects';

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects()
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: number) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return { 
    projects, 
    loading: isLoading, 
    error: error ? (error as any).message : null,
    refetch,
    deleteProject: deleteMutation.mutateAsync
  };
}

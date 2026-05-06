import { apiRequest } from '@/lib/api-utils';

// Fallback user ID for development
const LOCAL_STRATEGIC_USER = "local-dev-architect-id";

export interface Project {
  vibe: string | undefined;
  id: number;
  user_id: string;
  title: string;
  content_type: string;
  genre?: string;
  art_style?: string;
  episode_length: string;
  description?: string;
  tone?: string;
  prompt?: string;
  status: string;
  model_used: string;
  prod_metadata: { [key: string]: any };
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const projectService = {
  async getUserId() {
    return LOCAL_STRATEGIC_USER;
  },

  async getProjects(): Promise<Project[]> {
    try {
      return await apiRequest<Project[]>('/api/projects', { label: 'Project List' });
    } catch (e) {
      console.error("Error fetching projects:", e);
      return [];
    }
  },

  async getProject(projectId: number): Promise<Project | null> {
    try {
      return await apiRequest<Project>(`/api/projects/${projectId}`, { label: `Project Details [ID:${projectId}]` });
    } catch (e) {
      console.error(`Error fetching project ${projectId}:`, e);
      return null;
    }
  },

  async createProject(projectData: Partial<Project>): Promise<Project | null> {
    try {
      return await apiRequest<Project>('/api/projects', {
        method: 'POST',
        label: 'Create Project',
        body: JSON.stringify(projectData)
      });
    } catch (e) {
      console.error("Error creating project:", e);
      return null;
    }
  },

  async updateProject(projectId: number, projectData: Partial<Project>): Promise<Project | null> {
    try {
      return await apiRequest<Project>(`/api/projects/${projectId}`, {
        method: 'PATCH',
        label: 'Update Project',
        body: JSON.stringify(projectData)
      });
    } catch (e) {
      console.error(`Error updating project ${projectId}:`, e);
      return null;
    }
  },

  async deleteProject(projectId: number): Promise<boolean> {
    try {
      const response = await apiRequest<any>(`/api/projects/${projectId}`, {
        method: 'DELETE',
        label: 'Delete Project'
      });
      return response.ok === true;
    } catch (e) {
      console.error(`Error deleting project ${projectId}:`, e);
      return false;
    }
  }
};





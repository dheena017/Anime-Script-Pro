import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-utils';
import * as LucideIcons from 'lucide-react';

export interface Template {
  id: number;
  name: string;
  label?: string; // Compatibility
  description: string;
  category: string;
  icon: string;
  thumbnail: string;
  prompt: string;
  color: string;
  border: string;
  bg: string;
  shadow: string;
  elements: string[];
  vibe: string;
  stats: {
    deployed: string;
    success: string;
    complexity: string;
  };
}

export function useTemplates() {
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const data = await apiRequest<Template[]>('/api/templates/');
      return data.map(t => ({
        ...t,
        label: t.name, // Ensure compatibility
      }));
    }
  });

  return { 
    templates, 
    loading: isLoading, 
    error: error ? (error as any).message : null 
  };
}

// Helper to get Icon component from string
export const getIconComponent = (iconName: string) => {
  return (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
};

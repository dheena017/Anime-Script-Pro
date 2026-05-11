import { apiRequest } from '@/lib/api-utils';

export interface Category {
  id: number;
  name: string;
  color?: string;
  created_at: string;
}

export interface ProductionTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  thumbnail?: string;
  prompt: string;
  color: string;
  border: string;
  bg: string;
  shadow: string;
  elements: string[];
  vibe: string;
  stats: any;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    return await apiRequest<Category[]>('/api/categories');
  } catch (error) {
    console.error("fetchCategories error:", error);
    return [];
  }
}

export async function fetchTemplates(): Promise<ProductionTemplate[]> {
  try {
    return await apiRequest<ProductionTemplate[]>('/api/templates');
  } catch (error) {
    console.error("fetchTemplates error:", error);
    return [];
  }
}





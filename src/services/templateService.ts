import { createClient } from "src1/supabase/client";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ProductionTemplate {
  id: string;
  category_id: string;
  category_name?: string;
  category_color?: string;
  label: string;
  slug: string;
  prompt_template: string;
  vibe: string;
  complexity: string;
  thumbnail_url: string;
  is_system: boolean;
  created_at: string;
}

const supabase = createClient();

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("fetchCategories error:", error);
    return [];
  }
}

export async function fetchTemplates(): Promise<ProductionTemplate[]> {
  try {
    const { data, error } = await supabase
      .from("production_templates")
      .select(`
        *,
        categories (
          name,
          color
        )
      `)
      .order("label");
    
    if (error) throw error;

    // Flatten the categories relationship for the UI
    return (data || []).map(t => ({
      ...t,
      category_name: (t.categories as any)?.name,
      category_color: (t.categories as any)?.color
    }));
  } catch (error) {
    console.error("fetchTemplates error:", error);
    return [];
  }
}

import { apiRequest } from '@/lib/api-utils';

export interface HelpCategory {
  id: number;
  slug: string;
  label: string;
  sub: string;
  icon: string;
  color: string;
  order: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category_slug: string;
  is_frequent: boolean;
  order: number;
}

export interface DocSection {
  id: number;
  slug: string;
  label: string;
  icon: string;
  order: number;
}

export interface DocArticle {
  id: number;
  section_slug: string;
  slug: string;
  title: string;
  content: string;
  protocol_id?: string;
  order: number;
  article_metadata: any;
}

export const supportService = {
  async getHelpCategories(): Promise<HelpCategory[]> {
    try {
      return await apiRequest<HelpCategory[]>('/api/help/categories');
    } catch (e) {
      console.error("Error fetching help categories:", e);
      return [];
    }
  },

  async getFAQs(frequentOnly = false): Promise<FAQ[]> {
    try {
      return await apiRequest<FAQ[]>(`/api/help/faqs?frequent_only=${frequentOnly}`);
    } catch (e) {
      console.error("Error fetching FAQs:", e);
      return [];
    }
  },

  async getDocSections(): Promise<DocSection[]> {
    try {
      return await apiRequest<DocSection[]>('/api/docs/sections');
    } catch (e) {
      console.error("Error fetching doc sections:", e);
      return [];
    }
  },

  async getDocArticles(sectionSlug?: string): Promise<DocArticle[]> {
    try {
      const url = sectionSlug ? `/api/docs/articles?section_slug=${sectionSlug}` : '/api/docs/articles';
      return await apiRequest<DocArticle[]>(url);
    } catch (e) {
      console.error("Error fetching doc articles:", e);
      return [];
    }
  },

  async searchHelp(query: string): Promise<{ faqs: FAQ[], docs: DocArticle[] }> {
    try {
      return await apiRequest<{ faqs: FAQ[], docs: DocArticle[] }>(`/api/help/search?query=${query}`);
    } catch (e) {
      console.error("Error searching help:", e);
      return { faqs: [], docs: [] };
    }
  }
};




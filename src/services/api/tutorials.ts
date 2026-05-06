import { apiRequest } from '@/lib/api-utils';

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  duration: string;
  level: string;
  category: string;
  thumbnail?: string;
  progress?: number;
}

const DEFAULT_TUTORIAL_THUMBNAIL = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=800';

const FALLBACK_TUTORIALS: Tutorial[] = [
  {
    id: 1,
    title: 'Getting Started with Story Creation',
    description: 'Learn how to structure prompts and creative beats for the production pipeline.',
    icon_name: DEFAULT_TUTORIAL_THUMBNAIL,
    duration: '15 min',
    level: 'Beginner',
    category: 'FOUNDATIONS',
    progress: 100,
    thumbnail: DEFAULT_TUTORIAL_THUMBNAIL,
  },
  {
    id: 2,
    title: 'Character Design & Development',
    description: 'Design characters with consistent visual, personality, and narrative traits.',
    icon_name: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    duration: '45 min',
    level: 'Advanced',
    category: 'CREATION',
    progress: 35,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: 'Professional Camera Techniques',
    description: 'Translate scripts into camera moves, shot design, and scene composition.',
    icon_name: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    duration: '30 min',
    level: 'Intermediate',
    category: 'VISUALS',
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    title: 'Community & Growth Systems',
    description: 'Build community engagement, creator visibility, and channel growth strategies.',
    icon_name: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    duration: '20 min',
    level: 'Intermediate',
    category: 'COMMUNITY',
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
  }
];

function normalizeTutorial(tutorial: Partial<Tutorial> & Record<string, unknown>): Tutorial {
  const id = typeof tutorial.id === 'number' ? tutorial.id : Number(tutorial.id) || 0;
  const title = typeof tutorial.title === 'string' && tutorial.title.trim() ? tutorial.title.trim() : 'Untitled Tutorial';
  const description = typeof tutorial.description === 'string' ? tutorial.description.trim() : '';
  const iconName = typeof tutorial.icon_name === 'string' && tutorial.icon_name.trim() ? tutorial.icon_name.trim() : DEFAULT_TUTORIAL_THUMBNAIL;
  const duration = typeof tutorial.duration === 'string' && tutorial.duration.trim() ? tutorial.duration.trim() : '0 min';
  const level = typeof tutorial.level === 'string' && tutorial.level.trim() ? tutorial.level.trim() : 'Beginner';
  const category = typeof tutorial.category === 'string' && tutorial.category.trim() ? tutorial.category.trim() : 'GENERAL';

  return {
    id,
    title,
    description,
    icon_name: iconName,
    duration,
    level,
    category,
    thumbnail: typeof tutorial.thumbnail === 'string' && tutorial.thumbnail.trim() ? tutorial.thumbnail.trim() : iconName,
    progress: typeof tutorial.progress === 'number' && Number.isFinite(tutorial.progress) ? tutorial.progress : 0,
  };
}

function normalizeTutorialResponse(data: unknown): Tutorial[] {
  if (!Array.isArray(data)) {
    return FALLBACK_TUTORIALS;
  }

  const normalized = data
    .filter(item => item && typeof item === 'object')
    .map(item => normalizeTutorial(item as Partial<Tutorial> & Record<string, unknown>));

  return normalized.length > 0 ? normalized : FALLBACK_TUTORIALS;
}

export const tutorialService = {
  async getTutorials(): Promise<Tutorial[]> {
    try {
      const data = await apiRequest<unknown>('/api/tutorials');
      return normalizeTutorialResponse(data);
    } catch (e) {
      console.error("Error fetching tutorials:", e);
      return FALLBACK_TUTORIALS;
    }
  },

  getFallbackTutorials(): Tutorial[] {
    return FALLBACK_TUTORIALS;
  },

  getTutorialById(id: number): Tutorial | undefined {
    return FALLBACK_TUTORIALS.find(tutorial => tutorial.id === id);
  },

  async seedTutorials(): Promise<{ status: string; message: string; count?: number }> {
    try {
      return await apiRequest('/api/tutorials/seed', { method: 'POST' });
    } catch (e) {
      console.error("Error seeding tutorials:", e);
      return {
        status: 'error',
        message: String(e),
        count: FALLBACK_TUTORIALS.length,
      };
    }
  }
};




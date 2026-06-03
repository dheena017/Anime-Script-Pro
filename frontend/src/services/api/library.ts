import { apiRequest } from '@/lib/api-utils';
import { fetchTemplates, ProductionTemplate } from './templates';
import { projectService, Project } from './projects';
import { settingsService, MediaAsset } from './settings';
import { characterApi, CharacterManifest } from './characters';
import { worldApi, WorldLore } from './world';
import { engineApi } from './engine';
import { logsApi, SystemLog } from './logs';

export interface ScriptRecord {
  id: number;
  title: string;
  content: string;
  project_id?: number | null;
  series_id?: number | null;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
}

export interface StoryboardRecord {
  id: number;
  script_id: number;
  image_url: string;
  description?: string | null;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface LibraryRecentItem {
  id: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  level?: string;
}

export interface LibraryOverviewData {
  projects: Project[];
  archivedProjects: Project[];
  scripts: ScriptRecord[];
  storyboards: StoryboardRecord[];
  templates: ProductionTemplate[];
  assets: MediaAsset[];
  favorites: MediaAsset[];
  logs: SystemLog[];
  telemetry: any[];
  worldLore: WorldLore | null;
  cast: CharacterManifest | null;
}

const getTextPreview = (value?: string | null, fallback = 'Untitled') => {
  if (!value) return fallback;
  return value.length > 120 ? `${value.slice(0, 117)}...` : value;
};

export const libraryApi = {
  fetchScripts: async (): Promise<ScriptRecord[]> => {
    try {
      return await apiRequest<ScriptRecord[]>('/api/scripts', { label: 'Get Scripts' });
    } catch (error) {
      console.error('Failed to load scripts:', error);
      return [];
    }
  },

  fetchStoryboards: async (): Promise<StoryboardRecord[]> => {
    try {
      return await apiRequest<StoryboardRecord[]>('/api/storyboards', { label: 'Get Storyboards' });
    } catch (error) {
      console.error('Failed to load storyboards:', error);
      return [];
    }
  },

  fetchRecentActivity: async (limit = 20): Promise<LibraryRecentItem[]> => {
    try {
      const [logs, telemetry] = await Promise.all([
        logsApi.getLogs(limit),
        engineApi.getRecentTelemetry(limit),
      ]);

      const logItems = logs.map((entry) => ({
        id: `log-${entry.id ?? entry.timestamp ?? Math.random()}`,
        title: entry.source,
        message: entry.message,
        source: entry.source,
        timestamp: entry.timestamp || new Date().toISOString(),
        level: entry.level,
      }));

      const telemetryItems = telemetry.map((entry: any, index: number) => ({
        id: `telemetry-${entry.id ?? index}`,
        title: entry.endpoint || 'Telemetry Event',
        message: getTextPreview(entry.request_summary || entry.error_message || entry.status || 'Telemetry recorded'),
        source: entry.model || 'engine',
        timestamp: entry.timestamp || entry.created_at || new Date().toISOString(),
        level: entry.status,
      }));

      return [...telemetryItems, ...logItems]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to load recent activity:', error);
      return [];
    }
  },

  fetchOverview: async (userId?: string): Promise<LibraryOverviewData> => {
    const [projects, archivedProjects, scripts, storyboards, templates, assets, favorites, logs, telemetry, worldLore, cast] = await Promise.all([
      projectService.getProjects(),
      projectService.getProjects(true),
      libraryApi.fetchScripts(),
      libraryApi.fetchStoryboards(),
      fetchTemplates(),
      settingsService.getAssets(),
      settingsService.getFavorites(),
      logsApi.getLogs(12),
      engineApi.getRecentTelemetry(12),
      userId ? worldApi.getLore(userId).catch(() => null) : Promise.resolve(null),
      userId ? characterApi.getCharacters(userId).catch(() => null) : Promise.resolve(null),
    ]);

    return {
      projects,
      archivedProjects,
      scripts,
      storyboards,
      templates,
      assets,
      favorites,
      logs,
      telemetry,
      worldLore,
      cast,
    };
  },
};
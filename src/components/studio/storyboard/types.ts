export interface Scene {
  id: string;
  originalIndex: number;
  section: string;
  narration: string;
  visuals: string;
  sound: string;
}

export type ViewMode = 'grid' | 'script' | 'present';

import type { AIModel } from '../aiModels';

export const MUSIC_MODELS: AIModel[] = [
  { id: 'suno-v4', name: 'Suno v4 (Neural Score)', category: 'tts', capabilities: ['tts'], description: 'Suno v4 high-fidelity music synthesis', isFree: true },
  { id: 'udio-v1.5', name: 'Udio 1.5 (Pro Score)', category: 'tts', capabilities: ['tts'], description: 'Udio 1.5 advanced stereophonic music engine', isFree: false },
  { id: 'stable-audio-2.0', name: 'Stable Audio 2.0', category: 'tts', capabilities: ['tts'], description: 'Stability AI direct instrumental score compiler', isFree: true },
  { id: 'musicgen-large', name: 'MusicGen Large (Meta)', category: 'tts', capabilities: ['tts'], description: 'Meta high-dimension vector music composer', isFree: true }
];

export default MUSIC_MODELS;

import type { AIModel } from '../aiModels';

export const VIDEO_MODELS: AIModel[] = [
  { id: 'veo-3-generate', name: 'Veo 3 Generate', category: 'video', capabilities: ['video-gen'], description: 'Veo video generation core', isFree: false },
  { id: 'veo-3-fast-generate', name: 'Veo 3 Fast Generate', category: 'video', capabilities: ['video-gen'], description: 'High-speed Veo video generator', isFree: true },
  { id: 'veo-3-lite-generate', name: 'Veo 3 Lite Generate', category: 'video', capabilities: ['video-gen'], description: 'Lite Veo compilation node', isFree: true },
];

export default VIDEO_MODELS;
import type { AIModel } from '../aiModels';

export const VIDEO_MODELS: AIModel[] = [
  { id: 'veo-3-generate', name: 'Veo 3 Generate', category: 'video', capabilities: ['video-gen'], description: 'Veo video generation core', isFree: false },
  { id: 'veo-3-fast-generate', name: 'Veo 3 Fast Generate', category: 'video', capabilities: ['video-gen'], description: 'High-speed Veo video generator', isFree: true },
  { id: 'veo-3-lite-generate', name: 'Veo 3 Lite Generate', category: 'video', capabilities: ['video-gen'], description: 'Lite Veo compilation node', isFree: true },
  { id: 'stable-video-diffusion', name: 'Stable Video Diffusion', category: 'video', capabilities: ['video-gen'], description: 'Open video diffusion baseline', isFree: true },
  { id: 'cogvideox', name: 'CogVideoX', category: 'video', capabilities: ['video-gen'], description: 'Open video generation model', isFree: true },
  { id: 'open-sora-plan', name: 'Open-Sora-Plan', category: 'video', capabilities: ['video-gen'], description: 'Open video generation planning model', isFree: true },
  { id: 'easyanimate', name: 'EasyAnimate', category: 'video', capabilities: ['video-gen'], description: 'Animated video generation pipeline', isFree: true },
  { id: 'animatediff', name: 'AnimateDiff', category: 'video', capabilities: ['video-gen'], description: 'Animation diffusion generator', isFree: true },
];

export default VIDEO_MODELS;
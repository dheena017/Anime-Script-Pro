// Re-export audio generation functions from the unified generator barrel.
// AudioTab.tsx and other consumers import { generateAudio } from here.
export { generateAudio } from './gemini';
export type { AudioRequest, AudioResponse } from '../generators/audioGenerator';

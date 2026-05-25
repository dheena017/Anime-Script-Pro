import { ALL_IMAGE_MODELS } from './aiModels/imageModels';
import { TEXT_MODELS } from './aiModels/textModels';
import { VIDEO_MODELS } from './aiModels/videoModels';
import { AGENT_MODELS } from './aiModels/agentModels';

export type AIModel = {
  id: string;
  name: string;
  category: 'text' | 'image' | 'multi' | 'video' | 'tts' | 'other';
  capabilities: string[]; // e.g. ['text-out','image-gen','video-gen','tts']
  description?: string;
  isFree?: boolean;
};

export const AI_MODELS: AIModel[] = [
  ...TEXT_MODELS,

  // --- Audio / TTS Models ---
  { id: 'gemini-2.5-flash-tts', name: 'Gemini 2.5 Flash TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 2.5 with TTS capabilities', isFree: true },
  { id: 'gemini-2.5-pro-tts', name: 'Gemini 2.5 Pro TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 2.5 Pro TTS capabilities', isFree: false },
  { id: 'gemini-3.1-flash-tts', name: 'Gemini 3.1 Flash TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'High-fidelity voice synthesis', isFree: true },
  { id: 'gemini-2.5-flash-native-audio', name: 'Gemini 2.5 Flash Native Audio Dialog', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Native live audio dialog feedback', isFree: true },
  { id: 'gemini-3-flash-live', name: 'Gemini 3 Flash Live', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 3 Live Real-Time voice API', isFree: true },

  ...ALL_IMAGE_MODELS.map((model) => ({
    id: model.id,
    name: model.name,
    category: 'image' as const,
    capabilities: ['image-gen'],
    description: model.desc,
    isFree: model.isFree,
  })),

  ...VIDEO_MODELS,

  // --- Other / Specialty Models ---
  { id: 'gemma-4-26b', name: 'Gemma 4 26B', category: 'other', capabilities: ['other'], description: 'Gemma open weights v4', isFree: true },
  { id: 'gemma-4-31b', name: 'Gemma 4 31B', category: 'other', capabilities: ['other'], description: 'Gemma open weights v4 advanced', isFree: true },
  { id: 'gemini-robotics-er-1.5', name: 'Gemini Robotics ER 1.5 Preview', category: 'other', capabilities: ['other'], description: 'Robotics physical command routing v1.5', isFree: true },
  { id: 'gemini-robotics-er-1.6', name: 'Gemini Robotics ER 1.6 Preview', category: 'other', capabilities: ['other'], description: 'Robotics physical command routing v1.6', isFree: true },
  { id: 'computer-use-preview', name: 'Computer Use Preview', category: 'other', capabilities: ['other'], description: 'Agentic desktop OS automation framework', isFree: false },
  { id: 'gemini-embedding-1', name: 'Gemini Embedding 1', category: 'other', capabilities: ['embeddings'], description: 'Standard high-dimension vector embedder', isFree: true },
  { id: 'gemini-embedding-2', name: 'Gemini Embedding 2', category: 'other', capabilities: ['embeddings'], description: 'Advanced vector embedder v2', isFree: true },

  // --- Agents ---
  ...AGENT_MODELS,
  { id: 'default', name: 'Default', category: 'text', capabilities: ['text-out'], description: 'Default system fallback model', isFree: true },
];

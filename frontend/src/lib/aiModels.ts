export type AIModel = {
  id: string;
  name: string;
  category: 'text' | 'image' | 'multi' | 'video' | 'tts' | 'other';
  capabilities: string[]; // e.g. ['text-out','image-gen','video-gen','tts']
  description?: string;
};

export const AI_MODELS: AIModel[] = [
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Lightweight Gemini text model (fast, high-throughput)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 2.5 Flash text model' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'text', capabilities: ['text-out'], description: 'Gemini 2.5 Pro text model' },
  { id: 'gemini-2-flash', name: 'Gemini 2 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 2 Flash' },
  { id: 'gemini-2-flash-lite', name: 'Gemini 2 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Gemini 2 Flash Lite' },
  { id: 'gemini-2.5-flash-tts', name: 'Gemini 2.5 Flash TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 2.5 with TTS' },
  { id: 'imagen-4-generate', name: 'Imagen 4 Generate', category: 'image', capabilities: ['image-gen'], description: 'Imagen 4 image generation model' },
  { id: 'imagen-4-ultra', name: 'Imagen 4 Ultra Generate', category: 'image', capabilities: ['image-gen'], description: 'Imagen 4 Ultra' },
  { id: 'imagen-4-fast', name: 'Imagen 4 Fast Generate', category: 'image', capabilities: ['image-gen'], description: 'Imagen 4 Fast' },
  { id: 'gemma-4-26b', name: 'Gemma 4 26B', category: 'other', capabilities: ['other'], description: 'Gemma 4 family' },
  { id: 'gemma-4-31b', name: 'Gemma 4 31B', category: 'other', capabilities: ['other'], description: 'Gemma 4 family' },
  { id: 'gemini-embedding-1', name: 'Gemini Embedding 1', category: 'other', capabilities: ['embeddings'], description: 'Embedding model' },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 3 Flash' },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', category: 'text', capabilities: ['text-out'], description: 'Gemini 3.1 Pro' },
  { id: 'nano-banana', name: 'Nano Banana (Preview)', category: 'image', capabilities: ['image-gen'], description: 'Preview image model' },
  { id: 'lyria-3-clip', name: 'Lyria 3 Clip', category: 'multi', capabilities: ['image-gen','multi'], description: 'Lyria 3 Clip' },
  { id: 'veo-3-generate', name: 'Veo 3 Generate', category: 'multi', capabilities: ['video-gen','image-gen'], description: 'Veo video generation' },
  { id: 'gemini-3.1-flash-tts', name: 'Gemini 3.1 Flash TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'TTS-capable Gemini' },
  { id: 'gemini-robotics-er-1.6', name: 'Gemini Robotics ER 1.6', category: 'other', capabilities: ['other'], description: 'Robotics model' },
  { id: 'gemini-embedding-2', name: 'Gemini Embedding 2', category: 'other', capabilities: ['embeddings'], description: 'Embedding model v2' },
  { id: 'default', name: 'Default', category: 'text', capabilities: ['text-out'], description: 'Default model' },
];

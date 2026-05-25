export type AIModel = {
  id: string;
  name: string;
  category: 'text' | 'image' | 'multi' | 'video' | 'tts' | 'other';
  capabilities: string[]; // e.g. ['text-out','image-gen','video-gen','tts']
  description?: string;
  isFree?: boolean;
};

export const AI_MODELS: AIModel[] = [
  // --- Google Gemini Text Models ---
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Lightweight Gemini text model (fast, high-throughput)', isFree: true },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 2.5 Flash text model', isFree: true },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'text', capabilities: ['text-out'], description: 'Gemini 2.5 Pro text model', isFree: false },
  { id: 'gemini-2-flash', name: 'Gemini 2 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 2 Flash text core', isFree: true },
  { id: 'gemini-2-flash-lite', name: 'Gemini 2 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Gemini 2 Flash Lite text core', isFree: true },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 3 Flash standard', isFree: true },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 3.5 Flash preview', isFree: true },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', category: 'text', capabilities: ['text-out'], description: 'Gemini 3.1 Pro advanced reasoning', isFree: false },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Gemini 2.5 Flash Lite core', isFree: true },
  
  // --- OpenAI Text Models ---
  { id: 'gpt-4o', name: 'OpenAI GPT-4o', category: 'text', capabilities: ['text-out'], description: 'Flagship high-intelligence multimodal model', isFree: false },
  { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o Mini', category: 'text', capabilities: ['text-out'], description: 'Fast, lightweight, and cost-effective OpenAI model', isFree: true },
  { id: 'gpt-4-turbo', name: 'OpenAI GPT-4 Turbo', category: 'text', capabilities: ['text-out'], description: 'Legacy OpenAI flagship agent model', isFree: false },
  { id: 'o1-preview', name: 'OpenAI o1 Preview', category: 'text', capabilities: ['text-out'], description: 'Advanced reasoning and complex logic model', isFree: false },
  { id: 'o1-mini', name: 'OpenAI o1 Mini', category: 'text', capabilities: ['text-out'], description: 'Lightweight reasoning-focused model', isFree: false },

  // --- Audio / TTS Models ---
  { id: 'gemini-2.5-flash-tts', name: 'Gemini 2.5 Flash TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 2.5 with TTS capabilities', isFree: true },
  { id: 'gemini-2.5-pro-tts', name: 'Gemini 2.5 Pro TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 2.5 Pro TTS capabilities', isFree: false },
  { id: 'gemini-3.1-flash-tts', name: 'Gemini 3.1 Flash TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'High-fidelity voice synthesis', isFree: true },
  { id: 'gemini-2.5-flash-native-audio', name: 'Gemini 2.5 Flash Native Audio Dialog', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Native live audio dialog feedback', isFree: true },
  { id: 'gemini-3-flash-live', name: 'Gemini 3 Flash Live', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 3 Live Real-Time voice API', isFree: true },

  // --- Google AI Studio Image Models ---
  { id: 'gemini-3.1-flash-image-preview', name: 'Nano Banana 2', category: 'image', capabilities: ['image-gen'], description: 'Google Studio default with 4K resolution output support', isFree: true },
  { id: 'gemini-2.5-flash-image', name: 'Nano Banana', category: 'image', capabilities: ['image-gen'], description: 'Low-latency, high-volume Creative Flash workhorse', isFree: true },
  { id: 'gemini-3-pro-image-preview', name: 'Nano Banana Pro', category: 'image', capabilities: ['image-gen'], description: 'Studio Premium native model for complex details', isFree: false },

  // --- Google Professional Vertex / Reasoning Image Models ---
  { id: 'imagen-4-ultra', name: 'Imagen 4 Ultra', category: 'image', capabilities: ['image-gen'], description: 'Professional Vertex AI face, micro-detail, and product visualizer', isFree: false },
  { id: 'imagen-4-fast', name: 'Imagen 4 Fast', category: 'image', capabilities: ['image-gen'], description: 'Production-ready Vertex high-speed image generator', isFree: false },
  { id: 'gemini-3-pro-image', name: 'Gemini 3 Pro Image', category: 'image', capabilities: ['image-gen'], description: 'Flagship reasoning-enhanced consistency visual compiler', isFree: false },

  // --- Open-Weight Image Models ---
  { id: 'flux-1-schnell', name: 'FLUX.1 (Schnell)', category: 'image', capabilities: ['image-gen'], description: 'Open-weight flagship optimized for high-speed, few-step generation', isFree: true },
  { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL (SDXL)', category: 'image', capabilities: ['image-gen'], description: 'Open-source workhorse with massive fine-tune ecosystem', isFree: true },
  { id: 'stable-diffusion-3.5', name: 'Stable Diffusion 3.5', category: 'image', capabilities: ['image-gen'], description: 'Stability AI flagship with premium typography & prompts', isFree: true },

  // --- Free API Services ---
  { id: 'hugging-face-inference', name: 'Hugging Face Inference API', category: 'image', capabilities: ['image-gen'], description: 'Generous free access to thousands of custom models', isFree: true },
  { id: 'deepai', name: 'DeepAI API', category: 'image', capabilities: ['image-gen'], description: 'Straightforward REST API with solid free-tier capabilities', isFree: true },
  { id: 'together-ai-replicate', name: 'Together AI / Replicate Proxy', category: 'image', capabilities: ['image-gen'], description: 'API platform routing to top open-source nodes', isFree: false },

  // --- Web-Based Generators ---
  { id: 'leonardo-ai', name: 'Leonardo.ai Portal', category: 'image', capabilities: ['image-gen'], description: 'Professional layout with daily free tokens & LoRA support', isFree: true },
  { id: 'civitai', name: 'Civitai Hub', category: 'image', capabilities: ['image-gen'], description: 'Active community hub for browsing, testing, and custom models', isFree: true },

  // --- Premium Heavyweights (Paid) ---
  { id: 'flux-2-pro', name: 'FLUX.2 Pro (Black Forest Labs)', category: 'image', capabilities: ['image-gen'], description: 'Gold standard photorealism and solved anatomy/hands', isFree: false },
  { id: 'gpt-image-1.5', name: 'GPT Image 1.5 (OpenAI)', category: 'image', capabilities: ['image-gen'], description: 'OpenAI flagship upgrade with elite layout composition', isFree: false },

  // --- Specialized & Niche Leaders (Paid) ---
  { id: 'recraft-v4', name: 'Recraft V4 (SVG & Raster)', category: 'image', capabilities: ['image-gen'], description: 'Stellar vector graphic (SVG) and raster brand designer', isFree: false },
  { id: 'ideogram-3.0', name: 'Ideogram 3.0 (Typography King)', category: 'image', capabilities: ['image-gen'], description: 'Undisputed champion of long-form, built-in legible text', isFree: false },
  { id: 'midjourney-v7', name: 'Midjourney v7 (Cinematic Art)', category: 'image', capabilities: ['image-gen'], description: 'Elite cinematic concept art and high aesthetic outputs', isFree: false },

  // --- Aggregator APIs (Paid) ---
  { id: 'fal-ai', name: 'FAL.AI Routing API', category: 'image', capabilities: ['image-gen'], description: 'Ultra cost-effective, high-speed open-source endpoint router', isFree: false },
  { id: 'replicate', name: 'Replicate API Platform', category: 'image', capabilities: ['image-gen'], description: 'Host and execute custom-trained models dynamically', isFree: false },

  // --- Video Models ---
  { id: 'veo-3-generate', name: 'Veo 3 Generate', category: 'video', capabilities: ['video-gen'], description: 'Veo video generation core', isFree: false },
  { id: 'veo-3-fast-generate', name: 'Veo 3 Fast Generate', category: 'video', capabilities: ['video-gen'], description: 'High-speed Veo video generator', isFree: true },
  { id: 'veo-3-lite-generate', name: 'Veo 3 Lite Generate', category: 'video', capabilities: ['video-gen'], description: 'Lite Veo compilation node', isFree: true },

  // --- Other / Specialty Models ---
  { id: 'gemma-4-26b', name: 'Gemma 4 26B', category: 'other', capabilities: ['other'], description: 'Gemma open weights v4', isFree: true },
  { id: 'gemma-4-31b', name: 'Gemma 4 31B', category: 'other', capabilities: ['other'], description: 'Gemma open weights v4 advanced', isFree: true },
  { id: 'gemini-robotics-er-1.5', name: 'Gemini Robotics ER 1.5 Preview', category: 'other', capabilities: ['other'], description: 'Robotics physical command routing v1.5', isFree: true },
  { id: 'gemini-robotics-er-1.6', name: 'Gemini Robotics ER 1.6 Preview', category: 'other', capabilities: ['other'], description: 'Robotics physical command routing v1.6', isFree: true },
  { id: 'computer-use-preview', name: 'Computer Use Preview', category: 'other', capabilities: ['other'], description: 'Agentic desktop OS automation framework', isFree: false },
  { id: 'gemini-embedding-1', name: 'Gemini Embedding 1', category: 'other', capabilities: ['embeddings'], description: 'Standard high-dimension vector embedder', isFree: true },
  { id: 'gemini-embedding-2', name: 'Gemini Embedding 2', category: 'other', capabilities: ['embeddings'], description: 'Advanced vector embedder v2', isFree: true },

  // --- Agents ---
  { id: 'antigravity', name: 'Antigravity', category: 'other', capabilities: ['other'], description: 'Antigravity Agentic Intelligence core', isFree: true },
  { id: 'deep-research-pro', name: 'Deep Research Pro Preview', category: 'other', capabilities: ['other'], description: 'Multi-threaded deep analysis and crawling proxy', isFree: false },
  { id: 'default', name: 'Default', category: 'text', capabilities: ['text-out'], description: 'Default system fallback model', isFree: true },
];

export type ImageModelOption = {
  id: string;
  name: string;
  desc: string;
  price: string;
  isFree: boolean;
};

export const GOOGLE_STUDIO_IMAGE_MODELS: ImageModelOption[] = [
  { id: 'gemini-3.1-flash-image-preview', name: 'Nano Banana 2', desc: '4K resolution default. High-fidelity & prints.', price: '~$0.045', isFree: true },
  { id: 'gemini-2.5-flash-image', name: 'Nano Banana', desc: 'Creative Flash workhorse. Ultra speed batching.', price: '~$0.039', isFree: true },
  { id: 'gemini-3-pro-image-preview', name: 'Nano Banana Pro', desc: 'Reasoning native model. Elite prompt understanding.', price: '~$0.134', isFree: false },
];

export const GOOGLE_VERTEX_IMAGE_MODELS: ImageModelOption[] = [
  { id: 'imagen-4-ultra', name: 'Imagen 4 Ultra', desc: 'Flagship commercial faces, micro-details & products.', price: 'Vertex AI Pro', isFree: false },
  { id: 'imagen-4-fast', name: 'Imagen 4 Fast', desc: 'Cost-efficient large scale Vertex production.', price: '~$0.02', isFree: false },
  { id: 'gemini-3-pro-image', name: 'Gemini 3 Pro Image', desc: 'Reasoning, text rendering & references consistency.', price: 'Vertex Flagship', isFree: false },
];

export const OPEN_WEIGHT_IMAGE_MODELS: ImageModelOption[] = [
  { id: 'flux-1-schnell', name: 'FLUX.1 Schnell', desc: 'Elite open-weights. 4-step ultra high speed renders.', price: 'Free / Local', isFree: true },
  { id: 'stable-diffusion-xl', name: 'SDXL v1.0', desc: 'Open-source workhorse. Massive custom ecosystem.', price: 'Free / Local', isFree: true },
  { id: 'stable-diffusion-3.5', name: 'Stable Diffusion 3.5', desc: 'Flagsip text-in-image rendering & composition.', price: 'Free / Local', isFree: true },
  { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', desc: 'Open diffusion foundation model for free mode.', price: 'Free / Local', isFree: true },
  { id: 'stable-diffusion-3-medium', name: 'Stable Diffusion 3 Medium', desc: 'Balanced SD3 variant for high-quality renders.', price: 'Free / Local', isFree: true },
  { id: 'auraflow', name: 'AuraFlow', desc: 'Open image model with strong prompt fidelity.', price: 'Free / Local', isFree: true },
  { id: 'hunyuan-dit', name: 'Hunyuan-DiT', desc: 'Tencent Hunyuan diffusion transformer model.', price: 'Free / Local', isFree: true },
  { id: 'kolors', name: 'Kolors', desc: 'Free artistic image generation model.', price: 'Free / Local', isFree: true },
  { id: 'kandinsky-3', name: 'Kandinsky 3', desc: 'Creative image synthesis model with strong style control.', price: 'Free / Local', isFree: true },
  { id: 'pixart-sigma', name: 'PixArt-Sigma', desc: 'Text-to-image model optimized for semantic alignment.', price: 'Free / Local', isFree: true },
  { id: 'tripo-sr', name: 'TripoSR', desc: 'Single-image 3D reconstruction model.', price: 'Free / Local', isFree: true },
  { id: 'sv3d', name: 'SV3D', desc: 'Stable video / 3D view synthesis model.', price: 'Free / Local', isFree: true },
  { id: 'unique3d', name: 'Unique3D', desc: '3D asset generation model for free mode.', price: 'Free / Local', isFree: true },
  { id: 'instantmesh', name: 'InstantMesh', desc: 'Fast mesh generation from images.', price: 'Free / Local', isFree: true },
];

export const FREE_API_IMAGE_MODELS: ImageModelOption[] = [
  { id: 'hugging-face-inference', name: 'Hugging Face API', desc: 'Access 1000s of custom fine-tunes & models.', price: 'Generous Free', isFree: true },
  { id: 'deepai', name: 'DeepAI REST API', desc: 'Fast, straightforward developers integration API.', price: 'Generous Free', isFree: true },
  { id: 'together-ai-replicate', name: 'Together & Replicate Proxy', desc: 'Routing open-source API endpoints.', price: 'Pay per use', isFree: false },
];

export const WEB_IMAGE_MODELS: ImageModelOption[] = [
  { id: 'leonardo-ai', name: 'Leonardo.ai Portal', desc: 'Professional dashboard, daily tokens & LoRA layers.', price: 'Daily Tokens', isFree: true },
  { id: 'civitai', name: 'Civitai Hub', desc: 'Community model playground and LoRA catalog.', price: 'Free Tokens', isFree: true },
];

export const PREMIUM_IMAGE_MODELS: ImageModelOption[] = [
  { id: 'flux-2-pro', name: 'FLUX.2 Pro', desc: 'Gold standard details, lightning, solved anatomy/hands.', price: '~$0.05/img', isFree: false },
  { id: 'gpt-image-1.5', name: 'GPT Image 1.5', desc: 'OpenAI elite upgrade. Prompts reasoning & composition.', price: '~$0.04/img', isFree: false },
];

export const NICHE_IMAGE_MODELS: ImageModelOption[] = [
  { id: 'recraft-v4', name: 'Recraft V4', desc: 'Only paid API generating native, editable Vector SVG files.', price: '~$0.04 - $0.08', isFree: false },
  { id: 'ideogram-3.0', name: 'Ideogram 3.0', desc: 'Undisputed typographic king for posters, text & labels.', price: '~$0.03/img', isFree: false },
  { id: 'midjourney-v7', name: 'Midjourney v7', desc: 'Gold standard cinematic visual styling and anime frames.', price: 'Subscription', isFree: false },
];

export const AGGREGATOR_IMAGE_MODELS: ImageModelOption[] = [
  { id: 'fal-ai', name: 'FAL.AI Routing API', desc: 'Fastest cost-effective routing endpoints for open models.', price: 'API Proxy', isFree: false },
  { id: 'replicate', name: 'Replicate API', desc: 'Run thousand of custom trained models on demand.', price: 'API Proxy', isFree: false },
];

export const IMAGE_MODEL_GROUPS = {
  googleStudio: GOOGLE_STUDIO_IMAGE_MODELS,
  googleVertex: GOOGLE_VERTEX_IMAGE_MODELS,
  openWeights: OPEN_WEIGHT_IMAGE_MODELS,
  freeApi: FREE_API_IMAGE_MODELS,
  web: WEB_IMAGE_MODELS,
  premium: PREMIUM_IMAGE_MODELS,
  niche: NICHE_IMAGE_MODELS,
  aggregators: AGGREGATOR_IMAGE_MODELS,
};

export const ALL_IMAGE_MODELS: ImageModelOption[] = [
  ...GOOGLE_STUDIO_IMAGE_MODELS,
  ...GOOGLE_VERTEX_IMAGE_MODELS,
  ...OPEN_WEIGHT_IMAGE_MODELS,
  ...FREE_API_IMAGE_MODELS,
  ...WEB_IMAGE_MODELS,
  ...PREMIUM_IMAGE_MODELS,
  ...NICHE_IMAGE_MODELS,
  ...AGGREGATOR_IMAGE_MODELS,
];
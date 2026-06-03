import type { AIModel } from '../aiModels';

export const TEXT_MODELS: AIModel[] = [
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'High-throughput, lowest latency, massive daily quota', isFree: true },
  { id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', category: 'text', capabilities: ['text-out'], description: 'Very fast & capable — highly recommended', isFree: true },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', category: 'text', capabilities: ['text-out'], description: 'Advanced flash model for quick reasoning', isFree: true },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'text', capabilities: ['text-out'], description: 'Fast & capable model', isFree: true },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Lightweight, high-throughput, low-latency', isFree: true },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'text', capabilities: ['text-out'], description: 'Most capable Gemini model for complex reasoning', isFree: false },
  { id: 'gemma-4-26b', name: 'Gemma 4 26B', category: 'text', capabilities: ['text-out'], description: 'High-performance open weights model, massive daily quota', isFree: true },
  { id: 'gemma-4-31b', name: 'Gemma 4 31B', category: 'text', capabilities: ['text-out'], description: 'Advanced reasoning open weights model, massive daily quota', isFree: true },
  { id: 'gemma-3-27b', name: 'Gemma 3 27B', category: 'text', capabilities: ['text-out'], description: 'Open source fallback model', isFree: true },
  { id: 'deepseek-ai/DeepSeek-V4-Pro:novita', name: 'DeepSeek V4 Pro (Hugging Face Router)', category: 'text', capabilities: ['text-out'], description: 'OpenAI-compatible Hugging Face router model for DeepSeek V4 Pro', isFree: true },
  { id: 'gpt-4o', name: 'OpenAI GPT-4o', category: 'text', capabilities: ['text-out'], description: 'Flagship high-intelligence multimodal model', isFree: false },
  { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o Mini', category: 'text', capabilities: ['text-out'], description: 'Fast, lightweight, and cost-effective OpenAI model', isFree: true },
  { id: 'o1-preview', name: 'OpenAI o1 Preview', category: 'text', capabilities: ['text-out'], description: 'Advanced reasoning and complex logic model', isFree: false },
  { id: 'o1-mini', name: 'OpenAI o1 Mini', category: 'text', capabilities: ['text-out'], description: 'Lightweight reasoning-focused model', isFree: false },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 (Meta)', category: 'text', capabilities: ['text-out'], description: 'Meta Llama 3.1 lightweight free-tier model', isFree: true },
];

export default TEXT_MODELS;
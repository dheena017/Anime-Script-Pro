import type { AIModel } from '../aiModels';

export const TEXT_MODELS: AIModel[] = [
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Lightweight Gemini text model (fast, high-throughput)', isFree: true },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 2.5 Flash text model', isFree: true },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'text', capabilities: ['text-out'], description: 'Gemini 2.5 Pro text model', isFree: false },
  { id: 'gemini-2-flash', name: 'Gemini 2 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 2 Flash text core', isFree: true },
  { id: 'gemini-2-flash-lite', name: 'Gemini 2 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Gemini 2 Flash Lite text core', isFree: true },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 3 Flash standard', isFree: true },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', category: 'text', capabilities: ['text-out'], description: 'Gemini 3.5 Flash preview', isFree: true },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', category: 'text', capabilities: ['text-out'], description: 'Gemini 3.1 Pro advanced reasoning', isFree: false },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', category: 'text', capabilities: ['text-out'], description: 'Gemini 2.5 Flash Lite core', isFree: true },
  { id: 'gpt-4o', name: 'OpenAI GPT-4o', category: 'text', capabilities: ['text-out'], description: 'Flagship high-intelligence multimodal model', isFree: false },
  { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o Mini', category: 'text', capabilities: ['text-out'], description: 'Fast, lightweight, and cost-effective OpenAI model', isFree: true },
  { id: 'gpt-4-turbo', name: 'OpenAI GPT-4 Turbo', category: 'text', capabilities: ['text-out'], description: 'Legacy OpenAI flagship agent model', isFree: false },
  { id: 'o1-preview', name: 'OpenAI o1 Preview', category: 'text', capabilities: ['text-out'], description: 'Advanced reasoning and complex logic model', isFree: false },
  { id: 'o1-mini', name: 'OpenAI o1 Mini', category: 'text', capabilities: ['text-out'], description: 'Lightweight reasoning-focused model', isFree: false },
];

export default TEXT_MODELS;
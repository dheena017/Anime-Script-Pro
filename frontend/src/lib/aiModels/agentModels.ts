import type { AIModel } from '../aiModels';

export type AgentModel = AIModel;

export const AGENT_MODELS: AgentModel[] = [
  {
    id: 'antigravity',
    name: 'Antigravity',
    category: 'other',
    capabilities: ['other'],
    description: 'Antigravity Agentic Intelligence core',
    isFree: true
  },
  {
    id: 'deep-research-pro',
    name: 'Deep Research Pro Preview',
    category: 'other',
    capabilities: ['other'],
    description: 'Multi-threaded deep analysis and crawling proxy',
    isFree: false
  }
];

export default AGENT_MODELS;

import { ProtocolDetailView } from '../components/ProtocolDetailView';
import { ScrollText } from 'lucide-react';
import { 
  SCRIPT_GENERATION_PROMPT, 
  SCRIPT_CONTINUATION_PROMPT, 
  SCRIPT_REWRITE_TENSION_PROMPT 
} from '@/services/prompts';

export default function ScriptArchitect() {
  const prompts = [
    {
      id: 'gen',
      name: 'Script Generation',
      description: 'The master directive for synthesizing multi-scene production scripts with 11-column cinematic depth.',
      content: SCRIPT_GENERATION_PROMPT,
      version: '2.4.0'
    },
    {
      id: 'cont',
      name: 'AI Continuation',
      description: 'Extends existing narrative threads while maintaining quantum continuity and scene intensity.',
      content: SCRIPT_CONTINUATION_PROMPT,
      version: '1.2.1'
    },
    {
      id: 'tens',
      name: 'Tension Refiner',
      description: 'Algorithmic rewriting protocol focused on maximizing psychological friction and sensory urgency.',
      content: SCRIPT_REWRITE_TENSION_PROMPT,
      version: '1.0.5'
    }
  ];

  return (
    <ProtocolDetailView 
      title="Script Architect"
      icon={ScrollText}
      description="These directives govern the core narrative synthesis, dialogue pacing, and cinematic structure of the production manifest."
      prompts={prompts}
      color="studio"
    />
  );
}




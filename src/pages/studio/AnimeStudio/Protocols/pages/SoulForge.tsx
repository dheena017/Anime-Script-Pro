import { ProtocolDetailView } from '../components/ProtocolDetailView';
import { UserPlus } from 'lucide-react';
import { 
  CHARACTER_GENERATION_PROMPT, 
  CHARACTER_RELATIONSHIP_PROMPT 
} from '@/services/prompts';

export default function SoulForge() {
  const prompts = [
    {
      id: 'char',
      name: 'Character Design Studio',
      description: 'Create detailed character profiles with personality traits, visual characteristics, and relationships with other characters.',
      content: CHARACTER_GENERATION_PROMPT,
      version: '2.0.0'
    },
    {
      id: 'rel',
      name: 'Interpersonal Dynamics',
      description: 'Maps the web of social friction, hidden alliances, and ideological rivalries within the cast.',
      content: CHARACTER_RELATIONSHIP_PROMPT,
      version: '1.5.0'
    }
  ];

  return (
    <ProtocolDetailView 
      title="Soul Forge"
      icon={UserPlus}
      description="The biological and psychological blueprints for every entity inhabiting the production space."
      prompts={prompts}
      color="fuchsia-400"
    />
  );
}




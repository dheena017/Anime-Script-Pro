import { Sword, Globe, Zap, Ghost, Brain } from 'lucide-react';

export const QUICK_TEMPLATES = [
  {
    id: 'shonen',
    label: 'Shonen Battle',
    icon: Sword,
    prompt: 'A high-stakes tournament where fighters use elemental powers to determine the next emperor.',
    color: 'text-orange-500'
  },
  {
    id: 'isekai',
    label: 'Dark Isekai',
    icon: Globe,
    prompt: 'A programmer is reborn in a cruel fantasy world as a minor villain destined to be defeated.',
    color: 'text-purple-500'
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    icon: Zap,
    prompt: 'A street racer in a neon-lit megacity uncovering a corporate conspiracy involving digital souls.',
    color: 'text-cyan-500'
  },
  {
    id: 'slice',
    label: 'Slice of Life',
    icon: Ghost,
    prompt: 'A group of high school students starting an occult research club in a genuinely haunted school.',
    color: 'text-green-500'
  },
  {
    id: 'psych',
    label: 'Psychological',
    icon: Brain,
    prompt: 'A detective who can enter the dreams of suspects to find the truth behind a series of impossible crimes.',
    color: 'text-blue-500'
  },
];

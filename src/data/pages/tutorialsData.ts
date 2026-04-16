import {
  Sparkles,
  Cpu,
  Search,
  Layout,
  History,
  ImageIcon,
} from 'lucide-react';

export const tutorials = [
  {
    title: 'Getting Started: Your First Script',
    description: 'Learn how to use the AI Generator to create a professional 5-minute anime recap script.',
    icon: Sparkles,
    duration: '3 min',
    level: 'Beginner',
    category: 'Basics'
  },
  {
    title: 'Mastering Multi-Model AI',
    description: 'Understand the differences between Gemini, GPT-4o, and Claude for different writing styles.',
    icon: Cpu,
    duration: '5 min',
    level: 'Intermediate',
    category: 'AI Strategy'
  },
  {
    title: 'YouTube SEO Optimization',
    description: 'How to use the SEO tool to generate titles, descriptions, and tags that rank.',
    icon: Search,
    duration: '4 min',
    level: 'Beginner',
    category: 'Growth'
  },
  {
    title: 'Visual Storyboarding',
    description: 'Using the storyboard mode to plan your motion comic or video visuals.',
    icon: Layout,
    duration: '6 min',
    level: 'Advanced',
    category: 'Production'
  },
  {
    title: 'Cloud Library Management',
    description: 'Organizing your scripts, manual editing, and version control in the cloud.',
    icon: History,
    duration: '2 min',
    level: 'Beginner',
    category: 'Workflow'
  },
  {
    title: 'AI Image Prompt Engineering',
    description: 'Generating high-quality prompts for Midjourney or Stable Diffusion from your scripts.',
    icon: ImageIcon,
    duration: '5 min',
    level: 'Intermediate',
    category: 'Creative'
  }
];

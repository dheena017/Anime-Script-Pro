import React from 'react';
import { 
  BookOpen, 
  Play, 
  Sparkles, 
  Cpu, 
  History, 
  Search, 
  ImageIcon, 
  Layout,
  ChevronRight,
  Youtube,
  ScrollText,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';

const tutorials = [
  {
    title: "Getting Started: Your First Script",
    description: "Learn how to use the AI Generator to create a professional 5-minute anime recap script.",
    icon: Sparkles,
    duration: "3 min",
    level: "Beginner",
    category: "Basics"
  },
  {
    title: "Mastering Multi-Model AI",
    description: "Understand the differences between Gemini, GPT-4o, and Claude for different writing styles.",
    icon: Cpu,
    duration: "5 min",
    level: "Intermediate",
    category: "AI Strategy"
  },
  {
    title: "YouTube SEO Optimization",
    description: "How to use the SEO tool to generate titles, descriptions, and tags that rank.",
    icon: Search,
    duration: "4 min",
    level: "Beginner",
    category: "Growth"
  },
  {
    title: "Visual Storyboarding",
    description: "Using the storyboard mode to plan your motion comic or video visuals.",
    icon: Layout,
    duration: "6 min",
    level: "Advanced",
    category: "Production"
  },
  {
    title: "Cloud Library Management",
    description: "Organizing your scripts, manual editing, and version control in the cloud.",
    icon: History,
    duration: "2 min",
    level: "Beginner",
    category: "Workflow"
  },
  {
    title: "AI Image Prompt Engineering",
    description: "Generating high-quality prompts for Midjourney or Stable Diffusion from your scripts.",
    icon: ImageIcon,
    duration: "5 min",
    level: "Intermediate",
    category: "Creative"
  }
];

export function TutorialsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-red-600" />
          LEARNING CENTER
        </h1>
        <p className="text-zinc-500 text-lg max-w-2xl">
          Master the art of anime content creation with our comprehensive guides and tutorials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial, idx) => (
          <motion.div
            key={tutorial.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-500/30 transition-all group cursor-pointer h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                    <tutorial.icon className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-2 py-1 bg-zinc-800/50 rounded">
                    {tutorial.category}
                  </span>
                </div>
                <CardTitle className="text-lg group-hover:text-red-500 transition-colors">{tutorial.title}</CardTitle>
                <CardDescription className="text-sm text-zinc-500 leading-relaxed">
                  {tutorial.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800/50">
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {tutorial.duration}
                  </span>
                  <span>•</span>
                  <span>{tutorial.level}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-transparent p-0">
                  Start <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        <Card className="bg-gradient-to-br from-red-900/20 to-zinc-900 border-red-900/30 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Youtube className="w-32 h-32" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold">Watch Video Guides</CardTitle>
            <CardDescription className="text-zinc-300">
              Prefer visual learning? Check out our YouTube channel for step-by-step walkthroughs.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button className="bg-red-600 hover:bg-red-700">
              <Play className="w-4 h-4 mr-2 fill-white" />
              Visit YouTube Channel
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ScrollText className="w-32 h-32" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold">Documentation</CardTitle>
            <CardDescription className="text-zinc-300">
              Deep dive into the technical details and advanced prompt engineering techniques.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button variant="outline" className="border-zinc-700 bg-zinc-800/50">
              Read Docs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  BookOpen, 
  Play, 
  Youtube, 
  ScrollText,
  Rocket,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PageShell } from '@/components/page/PageShell';
import { tutorials } from '@/data/pages/tutorialsData';

// New Components
import { TutorialHero } from '@/components/tutorials/TutorialHero';
import { TutorialCard } from '@/components/tutorials/TutorialCard';

export function TutorialsPage() {
  return (
    <PageShell className="space-y-20 pb-20">
      <TutorialHero />

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Learning Paths</p>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white italic">Curated Courses</h2>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span className="text-red-500">All Modules</span>
            <span>Unlocks</span>
            <span>Certifications</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial, idx) => (
            <TutorialCard 
              key={tutorial.title}
              tutorial={tutorial}
              index={idx}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <Card className="bg-zinc-900 border-zinc-800 p-8 overflow-hidden relative group rounded-[32px]">
          <div className="absolute -top-12 -right-12 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 select-none">
            <Youtube className="w-64 h-64 text-red-600" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-6 max-w-md">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/20">
              <Youtube className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-black tracking-tight uppercase">Mastery via Video</CardTitle>
              <CardDescription className="text-zinc-500 text-sm italic font-medium leading-relaxed">
                Prefer visual learning? Check out our official production channel for step-by-step walkthroughs of advanced features.
              </CardDescription>
            </div>
            <Button className="bg-white text-black hover:bg-zinc-200 h-12 px-8 font-black uppercase tracking-widest text-[10px] rounded-xl">
              Launch Production Channel
              <Play className="w-3.5 h-3.5 ml-2 fill-current" />
            </Button>
          </div>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 p-8 overflow-hidden relative group rounded-[32px]">
          <div className="absolute -top-12 -right-12 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 select-none">
            <ScrollText className="w-64 h-64 text-blue-600" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-6 max-w-md">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/20">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl font-black tracking-tight uppercase">Technical Docs</CardTitle>
              <CardDescription className="text-zinc-500 text-sm italic font-medium leading-relaxed">
                Deep dive into the architectural details, prompt engineering standards, and visual continuity algorithms.
              </CardDescription>
            </div>
            <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 backdrop-blur-md h-12 px-8 font-black uppercase tracking-widest text-[10px] rounded-xl text-white">
              Read Developer Specs
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="py-20 rounded-[40px] bg-red-600 text-center flex flex-col items-center gap-6 shadow-2xl shadow-red-600/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)]" />
        <h2 className="relative z-10 text-4xl font-black uppercase tracking-tighter text-white">Ready for Certification?</h2>
        <p className="relative z-10 text-red-200 text-sm font-bold uppercase tracking-widest max-w-sm">
          Complete all shonen-path modules to earn your verified creator badge.
        </p>
        <Button className="relative z-10 bg-white text-red-600 hover:bg-zinc-100 h-12 px-10 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl">
          Take Skill Assessment
        </Button>
      </div>
    </PageShell>
  );
}

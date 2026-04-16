import React from 'react';
import { 
  Clock, 
  ChevronRight, 
  PlayCircle,
  BarChart,
  Layers,
  Award
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

interface TutorialCardProps {
  tutorial: any;
  index: number;
}

export function TutorialCard({ tutorial, index }: TutorialCardProps) {
  const Icon = tutorial.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="bg-zinc-900/40 border-zinc-800/60 hover:border-red-500/30 transition-all duration-500 h-full flex flex-col overflow-hidden backdrop-blur-sm relative">
        {/* Progress Decoration */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-zinc-800">
           <div className={`h-full bg-red-600 transition-all duration-1000 ${index === 0 ? 'w-[45%]' : 'w-0'}`} />
        </div>

        <CardHeader className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-2xl ${index % 2 === 0 ? 'bg-red-600/10 text-red-500' : 'bg-blue-600/10 text-blue-500'} border border-white/5 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-zinc-950/50 border-zinc-800 text-[8px] font-black uppercase tracking-widest px-2 h-5">
                {tutorial.level || 'Intermediate'}
              </Badge>
              {index === 0 && (
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{tutorial.category}</p>
            <CardTitle className="text-xl font-black tracking-tight group-hover:text-red-500 transition-colors uppercase leading-tight">
              {tutorial.title}
            </CardTitle>
            <CardDescription className="text-sm font-medium italic text-zinc-500 leading-relaxed pr-4 pt-2">
              "{tutorial.description}"
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 mt-auto pt-4 flex flex-col gap-6">
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 py-4 border-y border-zinc-800/30">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {tutorial.duration}
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {index + 2} Chapters
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-amber-500">
              <Award className="w-3.5 h-3.5 fill-amber-500/10" />
              +50 XP
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-1.5 opacity-50">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-5 h-5 rounded-full border border-zinc-950 bg-zinc-800" />
               ))}
            </div>
            <Button 
              className="bg-transparent hover:bg-red-600/5 text-red-500 font-black uppercase tracking-widest text-[10px] h-9 px-4 group/btn border border-red-500/20"
            >
              Start Section
              <ChevronRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

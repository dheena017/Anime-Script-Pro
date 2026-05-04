import { tutorialService } from '@/services/api/tutorials';
import { Play, CheckCircle2, Clock, BarChart } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

const fallbackLessons = [
  {
    id: 1,
    title: "Introduction to AI Scripting",
    duration: "15 min",
    level: "Beginner",
    progress: 100,
    thumbnail: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=800",
    category: "BASICS"
  },
  {
    id: 2,
    title: "Character Style & Details",
    duration: "45 min",
    level: "Advanced",
    progress: 35,
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    category: "CHARACTERS"
  },
  {
    id: 3,
    title: "Camera Angles & Movement",
    duration: "30 min",
    level: "Intermediate",
    progress: 0,
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
    category: "VISUALS"
  },
  {
    id: 4,
    title: "Sharing & Community",
    duration: "20 min",
    level: "Intermediate",
    progress: 0,
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    category: "COMMUNITY"
  }
];

export const TutorialsPanel: React.FC = () => {
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadTutorials = async () => {
      try {
        const data = await tutorialService.getTutorials();
        if (data && data.length > 0) {
          // Map backend data to UI format
          setLessons(data.map(t => ({
            ...t,
            progress: 0, // In a real app, this would come from a progress service
            thumbnail: t.icon_name || "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=800"
          })));
        } else {
          setLessons(fallbackLessons);
        }
      } catch (error) {
        console.error("Failed to load tutorials:", error);
        setLessons(fallbackLessons);
      } finally {
        setIsLoading(false);
      }
    };
    loadTutorials();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] animate-pulse">Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {lessons.map((lesson, idx) => (
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="group relative bg-zinc-950 border border-white/5 rounded-[3rem] overflow-hidden hover:border-amber-500/30 transition-all cursor-pointer"
        >
          {/* THUMBNAIL */}
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={lesson.thumbnail.startsWith('http') ? lesson.thumbnail : `https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=800`} 
              alt={lesson.title}
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
            
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1 bg-amber-500 text-black text-[7px] font-black tracking-[0.2em] rounded-full">
                {lesson.category}
              </span>
            </div>

            {lesson.progress > 0 && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${lesson.progress}%` }}
                  className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                />
              </div>
            )}

            <button className="absolute inset-0 m-auto w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 border border-white/20">
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{lesson.title}</h3>
              {lesson.progress === 100 && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
            </div>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">{lesson.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <BarChart className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">{lesson.level}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};




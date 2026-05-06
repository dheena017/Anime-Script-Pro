import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
  onPlay: (id: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ id, title, description, duration, isCompleted, onPlay }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="p-4 border border-white/10 rounded-xl bg-black/40 hover:bg-black/60 transition-colors cursor-pointer group" onClick={() => onPlay(id)}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-white/90 group-hover:text-blue-400 transition-colors">{title}</h3>
        {isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <PlayCircle className="w-5 h-5 text-white/40 group-hover:text-blue-400" />}
      </div>
      <p className="text-sm text-white/60 mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center text-xs text-white/40 font-mono">
        <Clock className="w-3.5 h-3.5 mr-1" />
        {duration}
      </div>
    </motion.div>
  );
};

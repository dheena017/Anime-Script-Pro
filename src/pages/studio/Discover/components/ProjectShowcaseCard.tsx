import React from 'react';
import { motion } from 'framer-motion';
import { Star, Eye } from 'lucide-react';

interface ProjectShowcaseCardProps {
  title: string;
  author?: string;
  genre?: string;
  category?: string;
  likes: number;
  views: number;
}

export const ProjectShowcaseCard: React.FC<ProjectShowcaseCardProps> = ({ title, author, genre, category, likes, views }) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 cursor-pointer group">
      <div className="aspect-video bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 relative">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] text-white font-medium uppercase tracking-wider">
          {genre || category || 'Untagged'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white/90 mb-1 truncate">{title}</h3>
        <p className="text-xs text-white/50 mb-4">by @{author || 'Anonymous'}</p>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" /> {likes}</div>
          <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {views}</div>
        </div>
      </div>
    </motion.div>
  );
};

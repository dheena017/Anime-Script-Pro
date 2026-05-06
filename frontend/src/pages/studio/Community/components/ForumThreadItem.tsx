import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';

interface ForumThreadItemProps {
  title: string;
  author: string;
  replies: number;
  votes: number;
  time: string;
}

export const ForumThreadItem: React.FC<ForumThreadItemProps> = ({ title, author, replies, votes, time }) => {
  return (
    <motion.div whileHover={{ x: 4 }} className="flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer">
      <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-lg min-w-[50px]">
        <ArrowUp className="w-4 h-4 text-white/50 mb-1 hover:text-orange-400" />
        <span className="text-sm font-bold text-white/80">{votes}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-medium text-white/90 mb-1">{title}</h3>
        <div className="text-xs text-white/40">Posted by <span className="text-orange-400/80">@{author}</span> • {time}</div>
      </div>
      <div className="flex items-center gap-2 text-white/50">
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{replies}</span>
      </div>
    </motion.div>
  );
};

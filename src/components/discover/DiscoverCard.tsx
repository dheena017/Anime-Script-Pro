import React from 'react';
import { Play, Star, Clock, User, MessageCircle, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

interface DiscoverCardProps {
  script: any;
}

export function DiscoverCard({ script }: DiscoverCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Card className="bg-zinc-900/40 border-zinc-800/60 hover:border-red-500/30 transition-all duration-500 overflow-hidden h-full flex flex-col backdrop-blur-md shadow-2xl">
        {/* Cover Image */}
        <div className="aspect-[16/10] bg-zinc-950 relative overflow-hidden">
          <img 
            src={script.image || `https://picsum.photos/seed/${script.id}/600/400`} 
            alt={script.title}
            className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          
          {/* Floating Actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
            <Button size="sm" className="rounded-full bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 font-black uppercase text-[10px] tracking-widest h-10 px-6">
              <Play className="w-3.5 h-3.5 mr-2 fill-current" />
              Quick View
            </Button>
          </div>

          <div className="absolute bottom-3 left-3 flex gap-2">
            {script.tags?.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="outline" className="bg-zinc-950/80 border-zinc-800 text-[8px] font-black uppercase tracking-widest h-4 px-1.5 backdrop-blur-md">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="absolute top-3 right-3">
             <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/5 text-[9px] font-mono font-bold text-white">
               {script.duration || '5:00'}
             </div>
          </div>
        </div>

        <CardHeader className="p-5 pb-2">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 italic text-[10px] text-zinc-500 font-medium">
                 <User className="w-3 h-3" />
                 by {script.author || 'Anonymous'}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                {script.rating || '4.9'}
              </div>
           </div>
           <CardTitle className="text-base font-black tracking-tight group-hover:text-red-500 transition-colors uppercase line-clamp-1">
             {script.title || 'Untitled Epic'}
           </CardTitle>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between">
          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed font-medium mb-6">
            "A visionary dive into the world of {script.tone || 'modern'} anime, featuring revolutionary dialogue and scene work."
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
                   <Clock className="w-3 h-3" />
                   {script.views || '1.2k'}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600">
                   <MessageCircle className="w-3 h-3" />
                   {script.comments || '42'}
                </div>
             </div>
             <button className="text-zinc-700 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
             </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { MapPin, Users, Heart, Target } from 'lucide-react';

export const PlanningGuide: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <Card className="bg-black/40 backdrop-blur-xl border-white/5 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-studio/5 blur-[100px] rounded-full pointer-events-none" />
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
          <span className="w-8 h-[1px] bg-studio"></span>
          Step-by-Step Scene Planning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-studio font-black tracking-widest uppercase text-[10px]">
              <MapPin className="w-4 h-4 text-studio" /> Setting
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Define the environment, time of day, and atmosphere. How does the location reflect the scene's tone?
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Users className="w-4 h-4" /> Characters
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Who is present? What are their current states, motivations, and power dynamics in this specific moment?
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold">
              <Heart className="w-4 h-4" /> Mood
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Establish the emotional tone. Is it tense, melancholic, energetic, or mysterious? Use lighting and color to convey this.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400 font-semibold">
              <Target className="w-4 h-4" /> Outcomes
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              What changes by the end? Note any information revealed, character growth, or plot advancement.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
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
      <Card className="planning-guide-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-studio/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <h3 className="planning-guide-title">
          <div className="w-12 h-[2px] bg-gradient-to-r from-studio to-transparent rounded-full" />
          Strategic Directive
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 group/item">
            <div className="planning-guide-item-title text-studio">
              <div className="p-2 bg-studio/10 rounded-xl border border-studio/20 group-hover/item:border-studio/40 transition-colors">
                <MapPin className="w-4 h-4 text-studio" />
              </div>
              Atmosphere
            </div>
            <p className="planning-guide-item-desc">
              Define the environment, time of day, and atmosphere. How does the location reflect the scene's tone?
            </p>
          </div>
          <div className="space-y-4 group/item">
            <div className="planning-guide-item-title text-blue-400">
              <div className="p-2 bg-blue-400/10 rounded-xl border border-blue-400/20 group-hover/item:border-blue-400/40 transition-colors">
                <Users className="w-4 h-4" />
              </div>
              Manifest
            </div>
            <p className="planning-guide-item-desc">
              Who is present? What are their current states, motivations, and power dynamics in this specific moment?
            </p>
          </div>
          <div className="space-y-4 group/item">
            <div className="planning-guide-item-title text-fuchsia-400">
              <div className="p-2 bg-fuchsia-400/10 rounded-xl border border-fuchsia-400/20 group-hover/item:border-fuchsia-400/40 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
              Resonance
            </div>
            <p className="planning-guide-item-desc">
              Establish the emotional tone. Is it tense, melancholic, or mysterious? Use lighting to convey this.
            </p>
          </div>
          <div className="space-y-4 group/item">
            <div className="planning-guide-item-title text-emerald-400">
              <div className="p-2 bg-emerald-400/10 rounded-xl border border-emerald-400/20 group-hover/item:border-emerald-400/40 transition-colors">
                <Target className="w-4 h-4" />
              </div>
              Objective
            </div>
            <p className="planning-guide-item-desc">
              What changes by the end? Note any information revealed, character growth, or plot advancement.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};





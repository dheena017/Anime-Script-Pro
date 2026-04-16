import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { motion } from 'motion/react';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-zinc-950/40 border-zinc-800/80 backdrop-blur-xl overflow-hidden rounded-[32px] shadow-2xl">
        <CardHeader className="p-8 pb-4 border-b border-zinc-900/50">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight uppercase group-hover:text-red-500 transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="text-zinc-500 font-medium italic">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SettingItem({ label, description, children }: { label: string, description: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-2">
      <div className="space-y-1 max-w-md">
        <h4 className="text-sm font-black text-white uppercase tracking-tight">{label}</h4>
        <p className="text-[11px] font-medium text-zinc-500 leading-relaxed italic pr-4">
          "{description}"
        </p>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
}

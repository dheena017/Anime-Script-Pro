import React from 'react';
import { FileText, Clock, BarChart3, Star, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";

interface LibraryStatsProps {
  scripts: any[];
}

export function LibraryStats({ scripts }: LibraryStatsProps) {
  const totalScripts = scripts.length;
  const totalWords = scripts.reduce((acc, s) => acc + (s.script?.split(/\s+/).length || 0), 0);
  const favoriteScripts = scripts.filter(s => s.isFavorite).length;
  const recentScripts = scripts.filter(s => {
    const createdAt = s.createdAt?.toDate?.() || new Date(s.createdAt);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return createdAt > oneWeekAgo;
  }).length;

  const stats = [
    { label: "Total Scripts", value: totalScripts, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Total Words", value: totalWords.toLocaleString(), icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Favorites", value: favoriteScripts, icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Weekly Growth", value: recentScripts > 0 ? `+${recentScripts}` : "0", icon: Zap, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-zinc-900/40 border-zinc-800/50 p-5 flex items-center gap-4 hover:bg-zinc-900/60 transition-colors group">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border border-white/5 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 mb-0.5">{stat.label}</p>
              <p className="text-2xl font-bold font-mono tracking-tight">{stat.value}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

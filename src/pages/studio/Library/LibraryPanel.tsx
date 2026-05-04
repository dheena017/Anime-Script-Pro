import React from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  FileText, 
  Film, 
  Users, 
  MoreVertical, 
  Clock, 
  ArrowUpRight,
  Shield,
  Zap,
  Loader2,
  Plus
} from 'lucide-react';

import { useTemplates } from '@/hooks/useTemplates';
import { useProjects } from '@/hooks/useProjects';

// Simple native relative time helper
const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

export const LibraryPanel: React.FC = () => {
  const { templates, loading: templatesLoading } = useTemplates();
  const { projects, loading: projectsLoading } = useProjects();
  
  if (projectsLoading || templatesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-[#bd4a4a] animate-spin" />
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Accessing Vault Archives...</p>
      </div>
    );
  }

  // Helper to map content_type to style
  const getProjectStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'script':
        return { icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" };
      case 'asset':
      case 'assets':
      case 'character':
        return { icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" };
      case 'lore':
      case 'world':
        return { icon: Folder, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" };
      case 'visual':
      case 'visuals':
      case 'storyboard':
        return { icon: Film, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" };
      default:
        return { icon: Shield, color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20" };
    }
  };

  const libraryItems = projects.map(project => {
    const style = getProjectStyle(project.content_type);
    return {
      id: project.id,
      title: project.title,
      type: project.content_type,
      date: timeAgo(new Date(project.updated_at)),
      items: project.prod_metadata?.object_count || 0,
      color: style.color,
      bg: style.bg,
      border: style.border,
      icon: style.icon,
      progress: project.status === 'completed' ? 100 : (project.prod_metadata?.progress || 0),
      status: project.status
    };
  });

  // Add system templates as a virtual item if they exist
  if (templates.length > 0) {
    libraryItems.push({
      id: 9999,
      title: "Global Templates",
      type: "System",
      date: "System Sync",
      items: templates.length,
      color: "text-zinc-400",
      bg: "bg-zinc-400/10",
      border: "border-zinc-400/20",
      icon: Shield,
      progress: 100,
      status: "Active"
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {libraryItems.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="group relative bg-zinc-950/50 backdrop-blur-sm border border-white/5 rounded-[3rem] p-8 hover:border-[#bd4a4a]/30 hover:bg-zinc-900/40 transition-all duration-500 cursor-pointer overflow-hidden"
        >
          {/* Background Glow */}
          <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${item.color.replace('text', 'bg')}`} />

          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className={`p-4 ${item.bg} rounded-2xl border ${item.border} group-hover:scale-110 transition-transform duration-500`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white transition-colors">
                {item.status}
              </span>
              <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-black text-white uppercase tracking-tighter group-hover:text-[#bd4a4a] transition-colors line-clamp-1">{item.title}</h3>
                <ArrowUpRight className="w-4 h-4 text-zinc-800 group-hover:text-[#bd4a4a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{item.type} Archive</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                <span className="text-zinc-500">Resource Sync</span>
                <span className="text-white">{item.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${item.color.replace('text', 'bg')}`} 
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-zinc-700" />
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{item.date}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-800 ring-1 ring-white/5 overflow-hidden group-hover:ring-[#bd4a4a]/30 transition-all">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id * i}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="h-4 w-px bg-white/5" />
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-zinc-800 group-hover:text-amber-500 transition-colors" />
                <span className="text-[9px] font-black text-zinc-500">{item.items}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Empty Slot / New */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="group relative border-2 border-dashed border-zinc-900/50 rounded-[3rem] flex flex-col items-center justify-center p-12 hover:border-[#bd4a4a]/30 hover:bg-[#bd4a4a]/5 transition-all duration-500 cursor-pointer"
      >
        <div className="w-16 h-16 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#bd4a4a]/40 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
          <Plus className="w-6 h-6 text-zinc-700 group-hover:text-[#bd4a4a]" />
        </div>
        <div className="text-center">
          <p className="text-xs font-black text-white uppercase tracking-widest mb-2">New Repository</p>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest max-w-[140px] mx-auto leading-relaxed">
            Create a new encrypted asset container
          </p>
        </div>
        
        {/* Decorative corner element */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-4 h-4 text-[#bd4a4a]" />
        </div>
      </motion.div>
    </div>
  );
};







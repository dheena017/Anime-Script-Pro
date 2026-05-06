import { motion, AnimatePresence } from 'framer-motion';
import { projectsStyles as s } from '../projectsStyles';
import { cn } from '@/lib/utils';
import { 
  FolderGit2, 
  Search, 
  Trash2, 
  Eye, 
  Calendar, 
  Activity, 
  Box,
  Layout as LayoutGrid,
  List
} from 'lucide-react';

interface ProjectListProps {
  projects: any[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onDelete: (id: number) => void;
  onOpen: (project: any) => void;
}

export function ProjectList({ 
  projects, 
  loading, 
  searchTerm, 
  onSearchChange,
  viewMode,
  onViewModeChange,
  onDelete,
  onOpen
}: ProjectListProps) {
  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={s.projectListContainer}>
      <div className={s.projectListHeader}>
        <div className={s.projectSearchBox}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="FILTER PROJECTS..."
            className={s.projectSearchInput}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className={s.projectViewToggle}>
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              s.projectViewButton,
              viewMode === 'grid' ? s.projectViewButtonActive : s.projectViewButtonInactive
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              s.projectViewButton,
              viewMode === 'list' ? s.projectViewButtonActive : s.projectViewButtonInactive
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className={s.projectLoading}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className={s.projectLoadingSkele} />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={s.emptyState}
          >
            <Box className={s.emptyStateIcon} />
            <p className={s.emptyStateText}>No matching blueprints found</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={cn(
              viewMode === 'grid' 
                ? s.projectGrid
                : s.projectListView
            )}
          >
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                viewMode={viewMode}
                onDelete={onDelete}
                onOpen={onOpen}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project, viewMode, onDelete, onOpen }: { 
  project: any; 
  viewMode: 'grid' | 'list';
  onDelete: (id: number) => void;
  onOpen: (p: any) => void;
}) {
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="group flex items-center gap-6 bg-[#0a0a0b] border border-white/5 p-4 rounded-xl hover:border-studio/30 transition-all"
      >
        <div className="w-12 h-12 rounded-lg bg-studio/10 flex items-center justify-center shrink-0 border border-studio/20 group-hover:bg-studio transition-colors">
          <FolderGit2 className="w-6 h-6 text-studio group-hover:text-black transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest truncate group-hover:text-studio transition-colors">
            {project.title}
          </h3>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider truncate">
            {project.description || 'NO DESCRIPTION'}
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            <span>ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => onOpen(project)}
            className="p-2.5 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-studio hover:text-black transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(project.id)}
            className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-[#0a0a0b] border border-white/5 rounded-2xl p-6 hover:border-studio/40 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4">
        <div className="w-10 h-10 rounded-xl bg-studio/10 border border-studio/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
           <FolderGit2 className="w-5 h-5 text-studio" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1 pr-10">
          <h3 className="text-lg font-black text-zinc-100 uppercase italic tracking-tighter truncate group-hover:text-studio transition-colors">
            {project.title}
          </h3>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest line-clamp-1 italic">
            {project.description || 'NO DESCRIPTION'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
          <div className="space-y-1">
             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter block">STATUS</span>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-studio animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest text-studio">STABLE</span>
             </div>
          </div>
          <div className="space-y-1">
             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter block">LAST UPDATED</span>
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {new Date(project.created_at).toLocaleDateString()}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
           <button 
             onClick={() => onOpen(project)}
             className="flex-1 flex items-center justify-center gap-2 bg-studio text-black py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-95"
           >
             <Eye className="w-3.5 h-3.5" />
             INITIALIZE STUDIO
           </button>
           <button 
             onClick={() => onDelete(project.id)}
             className="w-11 h-11 flex items-center justify-center bg-red-500/5 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
           >
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}

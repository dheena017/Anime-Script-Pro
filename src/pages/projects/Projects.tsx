import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Search,
  Plus,
  Trash2,
  ArrowRight,
  ChevronRight,
  Cpu,
  Calendar,
  Eye,
  Activity,
  CheckCircle2,
  Box,
  Layout as LayoutGrid,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { apiRequest } from '@/lib/api-utils';
import { StudioLoading } from '@/pages/studio/components/studio/StudioLoading';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = ['All Blueprints', 'draft', 'active', 'completed'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Blueprints');
  const location = useLocation();
  const [showCreatedMsg, setShowCreatedMsg] = useState(false);
  const navigate = useNavigate();

  const { setCurrentProject, refreshAppData } = useApp();

  // Show success banner when arriving from project creation
  useEffect(() => {
    if (location.state && (location.state as any).newlyCreated) {
      setShowCreatedMsg(true);
      const timer = setTimeout(() => setShowCreatedMsg(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<any[]>('/api/projects');
      if (data) setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Purge this production blueprint from the archive?')) return;
    try {
      await apiRequest(`/api/projects/${id}`, { method: 'DELETE' });
      setCurrentProject(null);
      await refreshAppData();
      fetchProjects();
    } catch (err) {
      console.error('Deletion failed:', err);
    }
  };

  const selectProject = (project: any) => {
    setCurrentProject(project);
    navigate('/anime');
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Blueprints' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-12 px-6 relative overflow-hidden selection:bg-studio/30">
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[180px] rounded-full pointer-events-none" />

      {/* 1. TRANSMISSION ALERT */}
      <AnimatePresence>
        {showCreatedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 bg-studio text-black px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(6,182,212,0.3)] z-[100] flex items-center gap-4 font-black uppercase tracking-widest text-[11px]"
          >
            <CheckCircle2 className="w-5 h-5" />
            Transmission Confirmed: Blueprint Initialized
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">

        {/* 2. ARCHIVE HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-studio/5 border border-studio/20 rounded-full flex items-center gap-2">
                <Activity className="w-3 h-3 text-studio animate-pulse" />
                <span className="text-[9px] font-black text-studio uppercase tracking-[0.3em]">Universal Production Archive</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
              Blueprint <span className="text-studio">Archive.</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed">
              Manage and switch between your production projects. Synchronized across all your devices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="hidden xl:flex items-center gap-8 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-[2rem]">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Total Archives</span>
                <span className="text-xs font-black text-white italic">{projects.length} Nodes</span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Global Status</span>
                <span className="text-xs font-black text-emerald-500 italic uppercase">Optimal</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/projects/new')}
              className="flex items-center gap-3 px-10 py-5 bg-studio text-black rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:scale-105 transition-all shadow-[0_20px_50px_rgba(6,182,212,0.3)] active:scale-95"
            >
              <Plus className="w-5 h-5" /> NEW BLUEPRINT
            </button>
          </div>
        </div>

        {/* 3. INTELLIGENCE FILTER MATRIX */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-studio/30 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative flex items-center bg-[#0a0a0b] border border-white/5 rounded-2xl px-6 py-4 focus-within:border-studio/30 transition-all">
                <Search className="w-5 h-5 text-zinc-600" />
                <input
                  type="text"
                  placeholder="SEARCH PRODUCTION ARCHIVES..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-white w-full px-4 placeholder:text-zinc-800"
                />
                <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] rounded-lg border border-white/5">
                  <LayoutGrid className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Grid Mode</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full md:w-auto">
              {STATUS_FILTERS.map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all duration-500 whitespace-nowrap",
                    selectedStatus === status ? "bg-studio text-black border-studio shadow-[0_10px_30px_rgba(6,182,212,0.3)]" : "bg-white/[0.02] border-white/5 text-zinc-600 hover:text-white hover:border-white/20"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. BLUEPRINT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="col-span-full py-20">
                <StudioLoading fullPage={false} message="Loading your projects..." submessage="Fetching your latest work..." />
              </div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-40 text-center space-y-6 bg-[#0a0a0b] rounded-[4rem] border border-dashed border-white/5"
              >
                <Box className="w-20 h-20 text-zinc-900 mx-auto animate-pulse" />
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">No Blueprints Manifest</h2>
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Initialize a new production to populate the archive.</p>
                </div>
              </motion.div>
            ) : (
              filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-[#0a0a0b] border border-white/5 rounded-[3rem] p-10 hover:border-studio/30 transition-all cursor-pointer relative overflow-hidden shadow-2xl"
                  onClick={() => selectProject(project)}
                >
                  {/* Status Indicator */}
                  <div className="absolute top-0 right-0 p-10">
                    <div className={cn(
                      "w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                      project.status === 'active' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" :
                        project.status === 'draft' ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-zinc-700"
                    )} />
                  </div>

                  <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-studio group-hover:text-black transition-all duration-700 group-hover:-rotate-6">
                      <FolderGit2 className="w-8 h-8 text-zinc-600 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
                        className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-white transition-colors border border-white/5"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                        className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-red-500 transition-colors border border-white/5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">HASH: #ASP-{project.id}-BLUEPRINT</span>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-studio transition-colors line-clamp-1">{project.title}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <Calendar className="w-3.5 h-3.5 text-studio" />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-zinc-700 uppercase">Initialized</span>
                          <span className="text-[9px] font-black text-zinc-500 tabular-nums">{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <Activity className="w-3.5 h-3.5 text-fuchsia-500" />
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-zinc-700 uppercase">Last Sync</span>
                          <span className="text-[9px] font-black text-zinc-500 tabular-nums">{new Date(project.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-studio/5 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-studio" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Synthesis Model</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{project.model_used || 'Flash-AI-2.0'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-white transition-colors">
                      Open Blueprint <ArrowRight className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-studio group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* 5. ARCHIVE FOOTER */}
        <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Production Hash: #VPA-8842-ARCHIVE</span>
            </div>
            <div className="w-px h-4 bg-white/5 hidden md:block" />
            <span>Sovereign Storage Protocol Active</span>
          </div>
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-studio rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              <span>Studio Tokyo Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
              <span>Studio LA Hub</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Database,
  Layers,
  History,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { apiRequest } from '@/lib/api-utils';
import { ProjectToolbar } from './components/ProjectToolbar';
import { AllProjectsTab } from './tabs/AllProjectsTab';
import { DraftProjectsTab } from './tabs/DraftProjectsTab';
import { ActiveProjectsTab } from './tabs/ActiveProjectsTab';
import { CompletedProjectsTab } from './tabs/CompletedProjectsTab';
import { HistoryProjectsTab } from './tabs/HistoryProjectsTab';

type ProjectTab = 'all' | 'draft' | 'active' | 'completed' | 'history';

const tabs: { id: ProjectTab; label: string; icon: any }[] = [
  { id: 'all', label: 'All Blueprints', icon: Database },
  { id: 'draft', label: 'Draft Protocols', icon: Layers },
  { id: 'active', label: 'Live Operations', icon: Activity },
  { id: 'completed', label: 'Final Archives', icon: CheckCircle2 },
  { id: 'history', label: 'Version History', icon: History },
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromUrl = () => {
    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as ProjectTab) : 'all';
  };

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ProjectTab>(getTabFromUrl());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { setCurrentProject, refreshAppData } = useApp();

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
    if (location.pathname === '/projects') {
      navigate('/projects/all', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (id: string) => {
    setActiveTab(id as ProjectTab);
    navigate(`/projects/${id}`);
  };

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
      setProjects(projects.filter(p => p.id !== id));
      refreshAppData();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleOpenProject = (project: any) => {
    setCurrentProject(project);
    navigate(`/projects/${project.id}/engine`);
  };

  const renderTabContent = () => {
    const commonProps = {
      projects,
      loading,
      searchTerm,
      onSearchChange: setSearchTerm,
      viewMode,
      onViewModeChange: setViewMode,
      onDelete: handleDelete,
      onOpen: handleOpenProject,
    };

    switch (activeTab) {
      case 'all':
        return <AllProjectsTab {...commonProps} />;
      case 'draft':
        return <DraftProjectsTab {...commonProps} />;
      case 'active':
        return <ActiveProjectsTab {...commonProps} />;
      case 'completed':
        return <CompletedProjectsTab {...commonProps} />;
      case 'history':
        return <HistoryProjectsTab {...commonProps} />;
      default:
        return <AllProjectsTab {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-[2px] bg-studio" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-studio">Central Command</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
                Project <span className="text-studio">Nexus.</span>
              </h1>
              <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-[0.2em] max-w-xl">
                Systematic management of multi-dimensional narrative blueprints and architectural assets.
              </p>
            </div>

            <div className="flex items-center gap-12 pb-2">
               <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block">Active Nodes</span>
                  <span className="text-3xl font-black text-white uppercase italic trekking-widest tabular-nums">{projects.length}</span>
               </div>
               <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block">Sync Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-black text-zinc-300 uppercase tracking-[0.2em]">OPERATIONAL</span>
                  </div>
               </div>
            </div>
          </div>
        </header>

        <ProjectToolbar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewProject={() => navigate('/projects/new')}
        />

        {renderTabContent()}
      </div>
    </div>
  );
}
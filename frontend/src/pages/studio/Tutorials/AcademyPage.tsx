import { useState, useEffect, startTransition } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { studioLog, reportTabChange } from '@/lib/dev-console-logs';
import {
  GraduationCap,
  BookOpen,
  Zap,
  Play,
  Terminal, 
  Activity, 
  ShieldCheck, 
  Award,
  Clock,
  ChevronRight
} from 'lucide-react';
import { TutorialsLayout } from './TutorialsLayout';
import { tutorialService, Tutorial } from '@/services/api/tutorials';

type AcademyTab = 'all' | 'essentials' | 'advanced' | 'ai' | 'workflow';

const tabs: { id: AcademyTab; label: string; icon: any }[] = [
  { id: 'all', label: 'All Guides', icon: BookOpen },
  { id: 'essentials', label: 'Core Essentials', icon: GraduationCap },
  { id: 'advanced', label: 'Production Mastery', icon: Zap },
  { id: 'ai', label: 'Neural Protocols', icon: Play },
  { id: 'workflow', label: 'Systems & Logic', icon: Terminal },
];

export default function AcademyPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getTabFromUrl = () => {
    const queryTab = searchParams.get('tab');
    if (tabs.find(t => t.id === queryTab)) return queryTab as AcademyTab;

    const path = location.pathname.split('/').pop();
    return tabs.find(t => t.id === path) ? (path as AcademyTab) : 'all';
  };

  const [activeTab, setActiveTab] = useState<AcademyTab>(getTabFromUrl());
  const [searchTerm, setSearchTerm] = useState('');
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    studioLog('Academy', 'Academy Foundry Interface active.', 'system');
  }, []);

  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      reportTabChange('Academy', tab, 'system');
      setActiveTab(tab);
    }
  }, [location.pathname, searchParams, activeTab]);

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setActiveTab(id as AcademyTab);
      setSearchParams({ tab: id });
    });
  };

  const fetchAcademyContent = async () => {
    setLoading(true);
    try {
      const data = await tutorialService.getTutorials();
      setTutorials(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademyContent();
  }, [activeTab]);

  const stats = [
    { label: "Completion", value: "64%", icon: Activity, color: "text-blue-500" },
    { label: "Rank", value: "Vanguard", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Credits", value: "4,200 XP", icon: Zap, color: "text-amber-500" },
  ];

  const bottomMetrics = (
    <>
      <div className="header-bottom-item">
        <Award className="header-bottom-icon text-amber-500" />
        <div className="header-bottom-text">
          <p className="header-bottom-label">Certifications</p>
          <p className="header-bottom-value">3 Active Mastery Tracks</p>
        </div>
      </div>
      <div className="header-bottom-item">
        <Clock className="header-bottom-icon" />
        <div className="header-bottom-text">
          <p className="header-bottom-label">Time Spent</p>
          <p className="header-bottom-value">124 Hours of Synthesis</p>
        </div>
      </div>
    </>
  );

  return (
    <TutorialsLayout
      title="ACADEMY FOUNDRY"
      subtitle="MASTER THE ARCHITECTURAL PROTOCOLS OF NEURAL PRODUCTION"
      brandIcon={GraduationCap}
      stats={stats}
      bottomMetrics={bottomMetrics}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      primaryAction={{
        label: "REQUEST CUSTOM GUIDE",
        onClick: () => console.log("Request"),
        icon: ChevronRight
      }}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className="studio-card-grid">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="aspect-video bg-zinc-900/50 rounded-[3rem] animate-pulse border border-white/5" />
          ))
        ) : (
          tutorials.map((tut) => (
            <div key={tut.id} className="studio-card group">
              <div className="absolute inset-0 bg-zinc-900/40 z-0">
                <img src={tut.thumbnail || `https://images.unsplash.com/photo-1635332305011-82550186173a?auto=format&fit=crop&q=80&w=800`} alt={tut.title} className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700" />
              </div>
              <div className="studio-card-glow" />
              <div className="card-header-row">
                <div className="card-icon-box">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="card-status-badge">
                  {tut.category}
                </div>
              </div>
              <div className="card-title-section">
                <h3 className="card-title">{tut.title}</h3>
                <p className="card-subtitle">{tut.duration} // {tut.level}</p>
              </div>
              <div className="card-progress-section">
                <div className="progress-header">
                  <span>Syllabus Progress</span>
                  <span>{tut.progress || 0}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${tut.progress || 0}%` }} />
                </div>
              </div>
              <div className="card-footer">
                 <div className="footer-item">
                    <Award className="footer-icon text-amber-500" />
                    <span className="footer-text">Mastery Tier</span>
                 </div>
                 <button className="text-xs font-black uppercase text-[#bd4a4a] hover:text-white transition-colors">Initialize Guide</button>
              </div>
            </div>
          ))
        )}
      </div>
    </TutorialsLayout>
  );
}

import React from 'react';
import { Search, Copy, Download, Maximize, Minimize, FileText, Image, Tag, Globe, TrendingUp, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { seoStyles as s } from '../seoStyles';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface SEOToolbarProps {
  status: 'active' | 'draft' | 'empty';
  activeTab?: string;
  session?: string;
  episode?: string;
  content?: string | null;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  onGenerateActive?: () => void;
  isGeneratingActive?: boolean;
}

export const SEOToolbar: React.FC<SEOToolbarProps> = ({
  status,
  activeTab = 'keywords',
  content = null,
  isEditing = false,
  onEditingChange,
  onGenerateActive,
  isGeneratingActive = false,
}) => {
  const { isFullscreen, showNotification } = useApp();

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      showNotification?.('SEO asset content copied to clipboard!', 'success');
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'keywords': return Search;
      case 'description': return FileText;
      case 'alt': return Image;
      case 'tags': return Tag;
      case 'distribution': return Globe;
      case 'growth': return TrendingUp;
      default: return Search;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case 'keywords': return { title: 'Keyword Atlas', desc: 'Title suggestions and primary search discovery keywords' };
      case 'description': return { title: 'Conversion Description', desc: 'High-conversion episodic narrative overview' };
      case 'alt': return { title: 'Visual Alt-Captions', desc: 'Accessibility-ready image metadata specifications' };
      case 'tags': return { title: 'Tag Cluster Manifest', desc: 'Optimized tags list for search indexing and discovery' };
      case 'distribution': return { title: 'Multi-Channel Blueprint', desc: 'Episodic publishing guidelines and amplification plan' };
      case 'growth': return { title: 'Strategic Growth Blueprints', desc: 'Audience retention checkpoints and tactical recommendations' };
      default: return { title: 'SEO Nexus Control', desc: 'Unified metadata & search discovery optimizer' };
    }
  };

  const getTabMetrics = () => {
    if (!content) return null;
    switch (activeTab) {
      case 'keywords': {
        try {
          const data = JSON.parse(content);
          const count = (data.primary_keywords?.length || 0) + (data.secondary_keywords?.length || 0);
          return { label: 'density', value: `${count} Keywords`, status: 'optimal' };
        } catch (e) {
          return null;
        }
      }
      case 'description': {
        const len = content.length;
        return { label: 'scale', value: `${len} / 5000 chars`, status: len <= 5000 ? 'optimal' : 'warning' };
      }
      case 'alt': {
        const len = content.length;
        return { label: 'scale', value: `${len} / 250 chars`, status: len <= 250 ? 'optimal' : 'warning' };
      }
      case 'tags': {
        const count = content.split(',').map(t => t.trim()).filter(t => t.length > 0).length;
        return { label: 'count', value: `${count} Tags`, status: count <= 25 ? 'optimal' : 'warning' };
      }
      case 'distribution': {
        const words = content.split(/\s+/).filter(w => w.length > 0).length;
        return { label: 'playbook', value: `${words} Words`, status: 'optimal' };
      }
      case 'growth': {
        const words = content.split(/\s+/).filter(w => w.length > 0).length;
        return { label: 'tactical', value: `${words} Words`, status: 'optimal' };
      }
      default:
        return null;
    }
  };

  const TabIcon = getTabIcon();
  const tabLabel = getTabLabel();
  const metrics = getTabMetrics();

  return (
    <TooltipProvider>
      <div className={s.toolbar.container}>
        <div className={s.toolbar.header}>
          {/* Identity */}
          <div className={s.toolbar.statusBox}>
            <div className={s.toolbar.statusIcon}>
              <TabIcon className={cn("w-5 h-5 transition-all duration-500", status === 'active' ? s.toolbar.statusActive : s.toolbar.statusInactive)} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className={s.toolbar.statusTitle}>
                  {tabLabel.title} {status === 'active' ? 'Indexed' : 'Standby'}
                </span>
                {metrics && (
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border",
                    metrics.status === 'optimal' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  )}>
                    {metrics.label}: {metrics.value}
                  </span>
                )}
              </div>
              <span className={s.toolbar.statusSubtitle}>
                {tabLabel.desc}
              </span>
            </div>
          </div>

          <div className={s.toolbar.actionGroup}>
            <div className={s.toolbar.btnGroup}>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                    disabled={!content}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">Copy Asset Content</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                    disabled={!content}
                    onClick={() => showNotification?.('This feature is currently in development.', 'info')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">Export Data</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={toggleFullscreen}
                    size="icon"
                    variant="ghost"
                    className={s.toolbar.iconButton}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-black uppercase tracking-widest text-xs">{isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, Bell, Loader2, Trash2 } from 'lucide-react';

interface NotificationItemProps {
  id: string | number;
  type: 'info' | 'warning' | 'success' | 'alert' | 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  title: string;
  message: string;
  time: string; // Dynamic ISO string or absolute time fallback
  read: boolean;
  onRead: (id: any) => void;
  onDelete?: (id: any) => void;
  loading?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ id, type, title, message, time, read, onRead, onDelete, loading }) => {
  const getIcon = () => {
    if (loading) return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />;
    const t = type.toLowerCase();
    if (t === 'success') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (t === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    if (t === 'alert') return <Bell className="w-4 h-4 text-rose-400 animate-pulse" />;
    return <Info className="w-4 h-4 text-cyan-400" />;
  };

  const formatRelativeTime = (timeValue: string) => {
    if (!timeValue) return '';
    // If it is pre-formatted, return as is
    if (timeValue.includes(':') && !timeValue.includes('-') && !timeValue.includes('T')) {
      return timeValue;
    }
    try {
      const now = new Date();
      const date = new Date(timeValue);
      const diffMs = now.getTime() - date.getTime();
      if (isNaN(diffMs)) return timeValue;

      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return timeValue;
    }
  };

  const getStyles = () => {
    const t = type.toLowerCase();
    if (read) return {
      bg: 'bg-zinc-950/40 hover:bg-zinc-900/20 border-l border-zinc-900/60 opacity-50 hover:opacity-80',
      accent: 'text-zinc-600'
    };

    if (t === 'success') return {
      bg: 'bg-emerald-950/10 hover:bg-emerald-950/20 border-l-2 border-emerald-500/60 shadow-[inset_3px_0_10px_rgba(16,185,129,0.02)]',
      accent: 'text-emerald-400'
    };
    if (t === 'warning') return {
      bg: 'bg-amber-950/10 hover:bg-amber-950/20 border-l-2 border-amber-500/60 shadow-[inset_3px_0_10px_rgba(245,158,11,0.02)]',
      accent: 'text-amber-400'
    };
    if (t === 'alert') return {
      bg: 'bg-rose-950/10 hover:bg-rose-950/20 border-l-2 border-rose-500/60 shadow-[inset_3px_0_10px_rgba(244,63,94,0.02)]',
      accent: 'text-rose-400'
    };
    return { // info / system
      bg: 'bg-cyan-950/10 hover:bg-cyan-950/20 border-l-2 border-cyan-500/60 shadow-[inset_3px_0_10px_rgba(6,182,212,0.02)]',
      accent: 'text-cyan-400'
    };
  };

  const styles = getStyles();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 3 }}
      onClick={() => !loading && onRead(id)}
      className={`group p-[15px] border-b border-zinc-900/50 transition-all cursor-pointer flex gap-3.5 items-start relative overflow-hidden ${styles.bg} ${loading ? 'opacity-40 pointer-events-none' : ''}`}
    >
      <div className="mt-0.5 shrink-0">{getIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5 gap-2">
          <h4 className={`text-[11px] font-black uppercase tracking-wider truncate ${read ? 'text-zinc-500' : 'text-zinc-200'}`}>
            {title}
          </h4>
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 shrink-0 select-none">
            {formatRelativeTime(time)}
          </span>
        </div>
        <p className="text-[10px] font-medium text-zinc-500 leading-relaxed break-words">
          {message}
        </p>
      </div>

      <div className="flex items-center gap-2 self-center shrink-0">
        {!read && !loading && (
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse" />
        )}
        
        {onDelete && !loading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="p-1.5 rounded-lg border border-transparent hover:border-red-950/40 hover:bg-red-500/10 text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Purge alert from deck"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
        
        {loading && (
          <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
        )}
      </div>
    </motion.div>
  );
};

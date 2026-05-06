import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

interface NotificationItemProps {
  id: string | number;
  type: 'info' | 'warning' | 'success' | 'alert' | 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  title: string;
  message: string;
  time: string;
  read: boolean;
  onRead: (id: any) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ id, type, title, message, time, read, onRead }) => {
  const getIcon = () => {
    const t = type.toLowerCase();
    if (t === 'info') return <Info className="w-5 h-5 text-blue-400" />;
    if (t === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    if (t === 'success') return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    if (t === 'alert') return <Bell className="w-5 h-5 text-red-400" />;
    return <Info className="w-5 h-5 text-zinc-400" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      onClick={() => onRead(id)}
      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-4 ${read ? 'opacity-60' : 'bg-indigo-500/5'}`}
    >
      <div className="mt-1">{getIcon()}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-sm font-semibold ${read ? 'text-white/70' : 'text-white'}`}>{title}</h4>
          <span className="text-xs text-white/40">{time}</span>
        </div>
        <p className="text-sm text-white/60">{message}</p>
      </div>
      {!read && <div className="w-2 h-2 rounded-full bg-indigo-500 self-center" />}
    </motion.div>
  );
};

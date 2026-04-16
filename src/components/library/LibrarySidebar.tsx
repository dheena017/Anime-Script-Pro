import React from 'react';
import { 
  Plus, 
  Folder, 
  Star, 
  Clock, 
  Archive, 
  Hash, 
  MoreHorizontal,
  LayoutGrid,
  Zap,
  HardDrive
} from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';

interface SidebarItemProps {
  icon: any;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}

function SidebarItem({ icon: Icon, label, count, active, onClick, color }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${
        active 
          ? 'bg-red-600/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-600/5' 
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'} ${color}`} />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded-md ${
          active ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-500'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

export function LibrarySidebar({ currentFilter, onFilterChange }: { currentFilter: string, onFilterChange: (f: string) => void }) {
  const navItems = [
    { id: 'all', icon: LayoutGrid, label: 'All Productions', count: 12 },
    { id: 'favorites', icon: Star, label: 'Favorites', count: 3, color: 'group-hover:text-amber-500' },
    { id: 'recents', icon: Clock, label: 'Recent Work', count: 5 },
    { id: 'archived', icon: Archive, label: 'Archive', count: 0 },
  ];

  const collections = [
    { label: 'Cyberpunk 2077', count: 4 },
    { label: 'Shonen Series', count: 8 },
    { label: 'Indie Shorts', count: 2 },
  ];

  return (
    <div className="w-64 flex-shrink-0 flex flex-col gap-8">
      {/* Primary Actions */}
      <div className="space-y-2">
        <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Library Navigation</p>
        <div className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              count={item.count}
              active={currentFilter === item.id}
              onClick={() => onFilterChange(item.id)}
              color={item.color}
            />
          ))}
        </div>
      </div>

      {/* Collections */}
      <div className="space-y-2">
        <div className="px-3 flex items-center justify-between mb-4">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Collections</p>
          <Button variant="ghost" size="icon" className="h-4 w-4 text-zinc-600 hover:text-white">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="space-y-1">
          {collections.map((col) => (
            <button
              key={col.label}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Folder className="w-4 h-4 text-zinc-700 group-hover:text-blue-500" />
                <span className="text-[11px] font-bold truncate">{col.label}</span>
              </div>
              <span className="text-[9px] text-zinc-700 group-hover:text-zinc-400 font-mono">{col.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Popular Tags</p>
        <div className="flex flex-wrap gap-2 px-3">
          {['Action', 'Drama', 'Sci-Fi', 'Romance', 'Epic'].map(tag => (
            <Badge 
              key={tag}
              variant="outline" 
              className="bg-zinc-900/50 border-zinc-800 text-[9px] font-bold uppercase tracking-tighter hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Storage Indicator */}
      <div className="mt-auto px-4 py-6 border-t border-zinc-800 bg-zinc-900/20 rounded-b-3xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-3 h-3 text-zinc-600" />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Storage</span>
          </div>
          <span className="text-[9px] font-mono text-zinc-400">1.2GB / 10GB</span>
        </div>
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '12%' }}
            className="h-full bg-red-600" 
          />
        </div>
        <p className="mt-2 text-[8px] text-zinc-600 font-medium">Free plan includes 10GB storage.</p>
        <Button variant="link" className="h-auto p-0 text-[9px] text-red-500 font-black uppercase tracking-widest mt-2 hover:no-underline opacity-70 hover:opacity-100 transition-opacity">
          Upgrade Pro
        </Button>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  FileText, 
  Film, 
  Users, 
  Star, 
  Clock, 
  Archive,
  BookOpen,
  Layout
} from 'lucide-react';

interface LibraryLayoutProps {
  header: React.ReactNode;
  toolbar: React.ReactNode;
  content: React.ReactNode;
}

const navItems = [
  { icon: Layout, label: 'Overview', active: true },
  { icon: FileText, label: 'Scripts' },
  { icon: Users, label: 'Characters' },
  { icon: Film, label: 'Storyboards' },
  { icon: BookOpen, label: 'World Lore' },
  { icon: Folder, label: 'Asset Packs' },
  { icon: Star, label: 'Favorites', separator: true },
  { icon: Clock, label: 'Recent' },
  { icon: Archive, label: 'Archived' },
];

export const LibraryLayout: React.FC<LibraryLayoutProps> = ({ header, toolbar, content }) => {
  return (
    <div className="max-w-[1700px] mx-auto px-6">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block sticky top-24 h-fit">
          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                {item.separator && <div className="my-6 border-t border-white/5" />}
                <motion.button
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    item.active 
                    ? 'bg-[#bd4a4a] text-white shadow-[0_0_20px_rgba(189,74,74,0.2)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-zinc-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {item.label}
                  </span>
                </motion.button>
              </React.Fragment>
            ))}
          </nav>

          <div className="mt-12 p-6 bg-gradient-to-br from-[#bd4a4a]/10 to-transparent border border-[#bd4a4a]/20 rounded-[2.5rem]">
            <p className="text-[9px] font-black text-[#bd4a4a] uppercase tracking-widest mb-2">Storage Usage</p>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[65%] bg-[#bd4a4a] rounded-full" />
            </div>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
              8.4 GB of 12 GB USED
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 pb-20">
          {header}
          {toolbar}
          <div className="relative">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};





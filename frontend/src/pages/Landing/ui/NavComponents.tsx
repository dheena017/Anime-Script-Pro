import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  label: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  children,
  isOpen,
  isActive,
  onClick,
}) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-6 py-2 rounded-full transition-all relative group h-10",
          isActive ? "text-white" : "text-zinc-500 hover:text-white"
        )}
      >
        {/* Active Pill Animation */}
        {isActive && (
          <motion.div 
            layoutId="nav-pill"
            className="absolute inset-0 bg-white/[0.03] border border-white/5 rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{label}</span>
        
        {children && (
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform duration-500 relative z-10",
              isOpen ? "rotate-180 text-studio" : "text-zinc-700"
            )}
          />
        )}
      </button>

      {children && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="absolute left-0 mt-4 w-72 bg-[#0a0a0b]/90 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.8)] z-[110]"
            >
              {/* Dropdown Pointer */}
              <div className="absolute -top-1.5 left-10 w-3 h-3 bg-[#0a0a0b] border-t border-l border-white/5 rotate-45" />
              <div className="relative space-y-1">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

interface DropdownLinkProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export const DropdownLink: React.FC<DropdownLinkProps> = ({
  icon: Icon,
  title,
  description,
  href,
  badge
}) => (
  <a
    href={href}
    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all group no-underline relative overflow-hidden"
  >
    {/* Hover Accent */}
    <div className="absolute inset-0 bg-studio/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-studio group-hover:border-studio group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all relative z-10 shrink-0">
      <Icon className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" />
    </div>
    
    <div className="flex flex-col gap-1 relative z-10">
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-white uppercase tracking-tight group-hover:text-studio transition-colors">
          {title}
        </span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-studio/10 border border-studio/20 text-studio text-[8px] font-black uppercase tracking-widest">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] text-zinc-600 font-medium leading-tight group-hover:text-zinc-400 transition-colors uppercase tracking-tight">
        {description}
      </span>
    </div>
  </a>
);



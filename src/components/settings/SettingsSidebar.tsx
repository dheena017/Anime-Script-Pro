import React from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Cpu, 
  Database, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

export function SettingsSidebar({ activeTab, onTabChange, onSignOut }: SettingsSidebarProps) {
  const menuItems = [
    { id: 'profile', icon: User, label: 'CREATOR PROFILE' },
    { id: 'security', icon: Shield, label: 'STUDIO SECURITY' },
    { id: 'notifications', icon: Bell, label: 'PRODUCTION ALERTS' },
    { id: 'ai', icon: Cpu, label: 'AI CONFIGURATION' },
    { id: 'data', icon: Database, label: 'CLOUD STORAGE' },
    { id: 'billing', icon: CreditCard, label: 'SUBSCRIPTION' },
  ];

  return (
    <div className="space-y-10">
      <div className="px-2">
         <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500">
               <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.1em]">SYSTEM SETTINGS</h3>
         </div>
         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-11">v2.4.0 Production Build</p>
      </div>

      <div className="space-y-1.5">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 5 }}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-red-600 text-white shadow-xl shadow-red-600/10 border border-red-500/50' 
                : 'bg-transparent text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'opacity-100 rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
          </motion.button>
        ))}
      </div>

      <div className="pt-10 px-2 space-y-4">
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center">
                 <Settings className="w-4 h-4 text-red-500" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-white uppercase tracking-widest">PRO MEMBER</p>
                 <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Expires in 24 days</p>
              </div>
           </div>
           <Button className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest">
              Manage Billing
           </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start h-12 rounded-2xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-4" />
          Logout Terminal
        </Button>
      </div>
    </div>
  );
}

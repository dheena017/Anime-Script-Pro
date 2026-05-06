import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Moon, Bell, ShieldCheck, Mail, Cpu } from 'lucide-react';
import { Switch } from '../../components/ui/switch';

interface ProfileSettingsProps {
   aspectRatio: string;
   setAspectRatio: (val: string) => void;
   theme: 'dark' | 'light';
   toggleTheme: (val: 'dark' | 'light') => void;
   emailAlerts: { upscale: boolean; generation: boolean; security: boolean; };
   setEmailAlerts: (val: any) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
   aspectRatio, setAspectRatio, theme, toggleTheme, emailAlerts, setEmailAlerts
}) => {
   return (
      <motion.div key="conf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-5xl mx-auto space-y-8 md:space-y-12 pt-4 md:pt-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-8 md:space-y-10">
               <h4 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Layout className="w-4 h-4 text-[#bd4a4a]" /> Workspace Geometry</h4>
               <div className="flex gap-3 md:gap-4">
                  {['16:9', '9:16', '1:1'].map((ratio) => (
                     <div key={ratio} onClick={() => setAspectRatio(ratio)} className={`flex-1 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all cursor-pointer text-center ${aspectRatio === ratio ? 'bg-[#bd4a4a]/10 border-[#bd4a4a] text-white shadow-xl' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                        <p className="text-[10px] md:text-xs font-black tracking-widest">{ratio}</p>
                     </div>
                  ))}
               </div>

               <h4 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Moon className="w-4 h-4 text-[#bd4a4a]" /> Visual Mode</h4>
               <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button onClick={() => toggleTheme('dark')} className={`flex-1 flex items-center justify-center gap-3 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all ${theme === 'dark' ? 'bg-[#bd4a4a]/10 border-[#bd4a4a] text-white' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                     <Moon className="w-4 h-4" /> <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Midnight</span>
                  </button>
                  <button onClick={() => toggleTheme('light')} className={`flex-1 flex items-center justify-center gap-3 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all ${theme === 'light' ? 'bg-zinc-200 border-zinc-300 text-black shadow-lg' : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}>
                     <Moon className="w-4 h-4 text-zinc-400" /> <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Daylight</span>
                  </button>
               </div>
            </div>

            <div className="space-y-8 md:space-y-10">
               <h4 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Bell className="w-4 h-4 text-[#bd4a4a]" /> Protocols</h4>
               <div className="space-y-3 md:space-y-4">
                  {[
                     { id: 'upscale', label: 'Upscale Completion', desc: 'Notify when high-fidelity materialization is finished.', icon: ShieldCheck },
                     { id: 'generation', label: 'Production Loop', desc: 'Daily summary of autonomous material synthesis.', icon: Mail },
                     { id: 'security', label: 'Vault Access', desc: 'Security alerts for neural identity access.', icon: Cpu },
                  ].map((item) => (
                     <div key={item.id} className="p-6 bg-zinc-950 border border-white/5 rounded-[2rem] flex items-center justify-between hover:border-white/10 transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-10 h-10 rounded-xl bg-[#bd4a4a]/10 flex items-center justify-center text-[#bd4a4a]">
                              <item.icon className="w-4 h-4" />
                           </div>
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</p>
                              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{item.desc}</p>
                           </div>
                        </div>
                        <Switch
                           checked={(emailAlerts as any)[item.id]}
                           onCheckedChange={(val: any) => setEmailAlerts({ ...emailAlerts, [item.id]: val })}
                        />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </motion.div>
   );
};




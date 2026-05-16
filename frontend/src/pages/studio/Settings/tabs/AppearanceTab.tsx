import React, { useState } from 'react';
import { Palette, Moon, Sun, Monitor, Contrast, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

export const AppearanceTab: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('#bd4a4a');

  const accents = [
    { name: 'Alpha Crimson', color: '#bd4a4a' },
    { name: 'Neon Cobalt', color: '#3b82f6' },
    { name: 'Cyber Emerald', color: '#10b981' },
    { name: 'Solar Amber', color: '#f59e0b' },
    { name: 'Void Purple', color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8">
      <Card className="settings-card border-none rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/5">
          <CardTitle className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Palette className="w-6 h-6 text-[#bd4a4a]" /> Visual Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-12">
          {/* Theme Selector */}
          <div className="space-y-6">
            <label className="settings-label">Interface Mode</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'dark', label: 'Dark Protocol', icon: Moon, desc: 'Optimized for neural efficiency' },
                { id: 'light', label: 'Light Phase', icon: Sun, desc: 'High visibility daylight mode' },
                { id: 'system', label: 'System Sync', icon: Monitor, desc: 'Match OS environment state' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-4 p-8 rounded-3xl border transition-all group",
                    theme === item.id 
                      ? "bg-[#bd4a4a]/10 border-[#bd4a4a]/40 text-white" 
                      : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10"
                  )}
                >
                  <item.icon className={cn("w-6 h-6", theme === item.id ? "text-[#bd4a4a]" : "text-zinc-700 group-hover:text-zinc-500")} />
                  <div className="text-center">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-1">{item.label}</h4>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-6">
            <label className="settings-label">Neural Accent Color</label>
            <div className="flex flex-wrap gap-4">
              {accents.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setAccent(item.color)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all min-w-[120px]",
                    accent === item.color 
                      ? "bg-zinc-900 border-white/20 scale-105" 
                      : "bg-zinc-950 border-transparent hover:border-white/5"
                  )}
                >
                  <div 
                    className="w-10 h-10 rounded-xl shadow-lg shadow-black/50 relative overflow-hidden" 
                    style={{ backgroundColor: item.color }}
                  >
                    {accent === item.color && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-500">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <label className="settings-label">Visual Accessibility</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Contrast className="w-5 h-5 text-zinc-600" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">High Contrast Mode</span>
                </div>
                <div className="w-10 h-5 bg-zinc-800 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-600 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Eye className="w-5 h-5 text-zinc-600" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">Reduced Motion</span>
                </div>
                <div className="w-10 h-5 bg-zinc-800 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-zinc-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceTab;

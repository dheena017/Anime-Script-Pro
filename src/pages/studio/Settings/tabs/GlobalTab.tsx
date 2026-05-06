import React, { useState } from 'react';
import { Globe, Globe2, Network, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export const GlobalTab: React.FC = () => {
  const [region, setRegion] = useState('US-EAST-1');
  const [language, setLanguage] = useState('English (Neural)');

  return (
    <div className="space-y-8">
      <Card className="settings-card border-none rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/5">
          <CardTitle className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#bd4a4a]" /> Network Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="settings-label">Primary Region Node</label>
              <div className="grid grid-cols-1 gap-3">
                {['US-EAST-1', 'EU-WEST-2', 'ASIA-SOUTH-1', 'GLOBAL-CDN'].map(node => (
                  <button
                    key={node}
                    onClick={() => setRegion(node)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      region === node 
                        ? "bg-[#bd4a4a]/10 border-[#bd4a4a]/40 text-white" 
                        : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Network className={cn("w-4 h-4", region === node ? "text-[#bd4a4a]" : "text-zinc-700")} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{node}</span>
                    </div>
                    {region === node && <div className="w-1.5 h-1.5 rounded-full bg-[#bd4a4a] shadow-[0_0_10px_#bd4a4a]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="settings-label">Interface Language</label>
              <div className="grid grid-cols-1 gap-3">
                {['English (Neural)', 'Japanese (Neo-Tokyo)', 'Simplified Binary', 'Universal Esperanto'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      language === lang 
                        ? "bg-[#bd4a4a]/10 border-[#bd4a4a]/40 text-white" 
                        : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Languages className={cn("w-4 h-4", language === lang ? "text-[#bd4a4a]" : "text-zinc-700")} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{lang}</span>
                    </div>
                    {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-[#bd4a4a] shadow-[0_0_10px_#bd4a4a]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe2 className="w-5 h-5 text-zinc-600" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Auto-Detect Region</p>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Automatically sync with the nearest neural node</p>
              </div>
            </div>
            <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-[#bd4a4a] hover:bg-[#bd4a4a]/10">Configure CDN</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalTab;

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield } from 'lucide-react';

interface StudioModulePanelProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  scrollClassName?: string;
  height?: string;
}

export function StudioModulePanel({
  title,
  subtitle,
  icon = <Shield className="w-5 h-5" />,
  actions,
  children,
  scrollClassName = 'p-10',
  height = 'h-[750px]'
}: StudioModulePanelProps) {
  return (
    <Card className="studio-panel shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
      <div className="studio-panel-header p-8 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 shadow-inner">
            {icon}
          </div>
          <div>
            <h2 className="text-[12px] font-black uppercase tracking-tight text-white">{title}</h2>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-0.5">{subtitle}</p>
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      
      <ScrollArea className={`${height} w-full ${scrollClassName}`}>
        {children}
      </ScrollArea>
    </Card>
  );
}

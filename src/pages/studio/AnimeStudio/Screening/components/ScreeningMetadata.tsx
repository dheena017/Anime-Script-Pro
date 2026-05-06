import React from 'react';
import { Tv, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScreeningMetadataProps {
  isRendering: boolean;
  videoUrl: string | null;
}

export const ScreeningMetadata: React.FC<ScreeningMetadataProps> = ({
  isRendering,
  videoUrl
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#050505] border-zinc-800 p-6 rounded-2xl relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Tv className="w-12 h-12 text-studio" />
          </div>
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">System Health</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs text-white font-bold tracking-tight">Sync Reliability</span>
              <span className="text-studio text-xs font-black">99.8%</span>
            </div>
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-studio w-[99.8%] shadow-studio" />
            </div>
          </div>
        </Card>
        <Card className="md:col-span-2 bg-[#050505] border-zinc-800 p-6 rounded-2xl">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Phase 4 Automation Status</h4>
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-black text-white">SEO READY</span>
              <span className="text-[9px] text-green-500 font-black uppercase">Active</span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-black text-white">STORYBOARD BUNDLE</span>
              <span className={cn("text-[9px] font-black uppercase", videoUrl ? "text-green-500" : "text-yellow-500")}>
                {videoUrl ? "PACKAGED" : "Packaging..."}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-black text-white">NEURAL VIDEO</span>
              <span className={cn("text-[9px] font-black uppercase", videoUrl ? "text-green-500" : "text-zinc-600")}>
                {videoUrl ? "DELIVERED" : "Pending"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-12 border-t border-zinc-800/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="space-y-4">
              <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">System Metadata</h5>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-600 font-bold">BITRATE</span>
                    <span className="text-zinc-400 font-mono">15.4 Mbps</span>
                 </div>
                 <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-600 font-bold">CODEC</span>
                    <span className="text-zinc-400 font-mono">H.265 / HEVC</span>
                 </div>
                 <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-600 font-bold">RESOLUTION</span>
                    <span className="text-zinc-400 font-mono">3840 x 2160</span>
                 </div>
              </div>
           </div>
           <div className="space-y-4">
              <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Audio Manifest</h5>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-600 font-bold">CHANNELS</span>
                    <span className="text-zinc-400 font-mono">5.1 Surround</span>
                 </div>
                 <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-600 font-bold">VOICEOVER</span>
                    <span className="text-zinc-400 font-mono">Synced</span>
                 </div>
                 <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-600 font-bold">OST SYNC</span>
                    <span className="text-studio font-black">Active</span>
                 </div>
              </div>
           </div>
           <div className={cn(
             "md:col-span-2 p-6 bg-studio/5 border border-studio/10 rounded-[2rem] flex items-center justify-between transition-all duration-700",
             isRendering && "opacity-50 grayscale"
           )}>
              <div className="space-y-2">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                   Master Production Bible
                   {isRendering && <Loader2 className="w-3 h-3 animate-spin text-studio" />}
                 </h4>
                 <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-relaxed">
                    {isRendering 
                      ? "Verifying cross-module data integrity and Lore consistency..." 
                      : "All character profiles, story parameters, and world-building data have been successfully packaged."}
                 </p>
              </div>
              <Button variant="outline" disabled={isRendering} className="border-studio/30 text-studio hover:bg-studio/10 uppercase tracking-widest text-[9px] font-black px-6 rounded-xl">
                 Review Bible
              </Button>
           </div>
        </div>
      </div>
    </>
  );
};




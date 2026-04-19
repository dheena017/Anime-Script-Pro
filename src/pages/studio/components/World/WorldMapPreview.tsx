import React from 'react';
import { Map, Layers, Maximize2, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const WorldMapPreview: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <Map className="w-4 h-4 text-emerald-500" />
          Cartographic Projection
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-emerald-500">
            <Layers className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-emerald-500">
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Card className="aspect-video bg-[#050505] border-zinc-800 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Mock Map Lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
           <div className="w-full h-[1px] bg-emerald-500/20" />
           <div className="h-full w-[1px] bg-emerald-500/20" />
        </div>

        {/* Mock Point */}
        <div className="absolute top-[30%] left-[40%] group-hover:scale-125 transition-transform">
           <div className="relative">
              <MapPin className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
           </div>
           <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-black/80 border border-emerald-500/30 rounded text-[7px] font-black uppercase text-emerald-400">
              The Citadel
           </div>
        </div>

        <div className="absolute bottom-4 right-4 text-[7px] font-mono text-zinc-600 uppercase tracking-widest bg-black/60 px-2 py-1 rounded">
           Grid: 42.1N 88.4W
        </div>
      </Card>
    </div>
  );
};

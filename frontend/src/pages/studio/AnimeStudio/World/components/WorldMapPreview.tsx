import React from 'react';
import { Map, Layers, Maximize2, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { worldStyles as s } from '../worldStyles';

export const WorldMapPreview: React.FC = () => {
  return (
    <div className="map-preview-container">
      <div className="map-preview-header">
        <h3 className="map-preview-title">
          <Map className="w-4 h-4 text-emerald-500" />
          Cartographic Projection
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className={cn(s.actionIconButtonSmall, "hover:text-emerald-500") }>
            <Layers className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className={cn(s.actionIconButtonSmall, "hover:text-emerald-500") }>
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Card className="map-preview-card">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Mock Map Lines */}
        <div className="map-preview-grid">
           <div className="w-full h-[1px] bg-emerald-500/20" />
           <div className="h-full w-[1px] bg-emerald-500/20" />
        </div>

        {/* Mock Point */}
        <div className="map-preview-point">
           <div className="relative">
              <MapPin className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
           </div>
           <div className="map-preview-label">
              The Citadel
           </div>
        </div>

        <div className="map-preview-coords">
           Grid: 42.1N 88.4W
        </div>
      </Card>
    </div>
  );
};





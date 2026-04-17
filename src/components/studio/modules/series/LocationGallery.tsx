import React from 'react';
import { Camera, MapPin, Search, Wand2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocationEntry } from '../bibleUtils';

interface LocationGalleryProps {
  locations: LocationEntry[];
  onGenerate: (loc: LocationEntry) => void;
  isGenerating?: Record<string, boolean>;
}

export function LocationGallery({ locations, onGenerate, isGenerating = {} }: LocationGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {locations.map((loc) => (
        <Card key={loc.id} className="bg-zinc-950/60 border-zinc-900 rounded-[32px] overflow-hidden group hover:border-zinc-800 transition-all">
          <div className="relative h-48 bg-zinc-900 overflow-hidden">
             {loc.imageUrl ? (
               <img src={loc.imageUrl} alt={loc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Camera className="w-10 h-10 text-zinc-800 mb-2" />
                  <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">Neural Scan Required</p>
               </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-zinc-400">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{loc.name}</span>
                   </div>
                   <code className="block text-[8px] text-zinc-600 font-mono tracking-tighter">{loc.seed}</code>
                </div>
                <Button
                   size="sm"
                   className="h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white border-white/5 backdrop-blur-md px-3 text-[9px] font-black uppercase tracking-widest"
                   onClick={() => onGenerate(loc)}
                   disabled={isGenerating[loc.id]}
                >
                   {isGenerating[loc.id] ? 'SCANNING...' : <Wand2 className="w-3 h-3" />}
                </Button>
             </div>
          </div>
          <div className="p-5 space-y-3">
             <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed line-clamp-2">
                {loc.description}
             </p>
             <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Environment Asset</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 rounded-md text-zinc-700 hover:text-red-500">
                   <Download className="w-3.5 h-3.5" />
                </Button>
             </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { motion } from 'framer-motion';
import { Eye, Download, Share2, Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ThemeTabProps {
  searchTerm: string;
}

const themeAssets = [
  {
    id: '1',
    name: 'Neo-Tokyo Midnight',
    category: 'Color Palette',
    preview: 'https://images.unsplash.com/photo-1542641728-6ca359b085f4?q=80&w=300&h=200&auto=format&fit=crop',
    colors: ['#0a0a0f', '#12121a', '#bd4a4a', '#3b82f6', '#10b981'],
    updated: '2 hours ago'
  },
  {
    id: '2',
    name: 'Studio Ghibli Inspired',
    category: 'Texture Pack',
    preview: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300&h=200&auto=format&fit=crop',
    colors: ['#87ceeb', '#228b22', '#f5f5dc', '#d2691e', '#8b4513'],
    updated: '1 day ago'
  },
  {
    id: '3',
    name: 'Cybernetic Core Styles',
    category: 'UI Components',
    preview: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=300&h=200&auto=format&fit=crop',
    colors: ['#000000', '#1a1a1a', '#00ff00', '#ff00ff', '#00ffff'],
    updated: '3 days ago'
  },
  {
    id: '4',
    name: 'Retro VHS Aesthetic',
    category: 'Post-Process',
    preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=200&auto=format&fit=crop',
    colors: ['#301934', '#4b0082', '#ff69b4', '#00ffff', '#ffffff'],
    updated: '5 days ago'
  }
];

export default function ThemeTab({ searchTerm }: ThemeTabProps) {
  const filteredAssets = themeAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Header (If needed specific to tab) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="bg-zinc-900 border-white/5 text-[10px] font-black tracking-widest uppercase">
            <Filter className="w-3 h-3 mr-2" />
            Filter
          </Button>
        </div>
        <Button className="bg-[#bd4a4a] hover:bg-[#a33f3f] text-white text-[10px] font-black tracking-widest uppercase px-6">
          <Plus className="w-3 h-3 mr-2" />
          Register Theme Asset
        </Button>
      </div>

      {/* Theme Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAssets.map((asset, i) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-zinc-950 border-white/5 overflow-hidden group hover:border-[#bd4a4a]/40 transition-all duration-500">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={asset.preview} 
                  alt={asset.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                {/* Visual Category Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-md">
                   <p className="text-[8px] font-black text-[#bd4a4a] tracking-widest uppercase">{asset.category}</p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                   <Button variant="ghost" size="icon" className="text-white hover:text-[#bd4a4a]">
                     <Eye className="w-5 h-5" />
                   </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-sm font-black text-white group-hover:text-[#bd4a4a] transition-colors mb-2">{asset.name}</h3>
                <div className="flex gap-1.5 mt-3">
                  {asset.colors.map((color, ci) => (
                    <div 
                      key={ci} 
                      className="w-4 h-4 rounded-full border border-black ring-1 ring-white/10" 
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Update: {asset.updated}</span>
                <div className="flex gap-2">
                  <Download className="w-3 h-3 text-zinc-500 hover:text-white cursor-pointer" />
                  <Share2 className="w-3 h-3 text-zinc-500 hover:text-white cursor-pointer" />
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

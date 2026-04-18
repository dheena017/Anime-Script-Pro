import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Search, 
  Filter, 
  Play, 
  Star, 
  Clock,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = ["All", "Shonen", "Isekai", "Cyberpunk", "Horror", "Romance", "Mecha"];

const featuredScripts = [
  { 
    id: 1, 
    title: "Neon Soul: Protocol Zero", 
    author: "CyberGhost", 
    rating: 4.9, 
    views: "12k", 
    duration: "4:30",
    tags: ["Cyberpunk", "Action"],
    image: "https://picsum.photos/seed/anime1/800/450"
  },
  { 
    id: 2, 
    title: "The Librarian of Lost Spells", 
    author: "MageWriter", 
    rating: 4.7, 
    views: "8.5k", 
    duration: "5:15",
    tags: ["Fantasy", "Mystery"],
    image: "https://picsum.photos/seed/anime2/800/450"
  },
  { 
    id: 3, 
    title: "High School Exorcist Club", 
    author: "SpiritHunter", 
    rating: 4.8, 
    views: "15k", 
    duration: "3:45",
    tags: ["Horror", "Comedy"],
    image: "https://picsum.photos/seed/anime3/800/450"
  }
];

export function DiscoverPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
          <Compass className="w-10 h-10 text-red-600" />
          DISCOVER
        </h1>
        <p className="text-zinc-500 text-lg">Find your next inspiration from the community's best scripts.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search scripts, authors, or genres..." 
            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-red-500/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <Badge 
              key={cat} 
              variant="outline" 
              className="cursor-pointer hover:bg-zinc-800 border-zinc-800 text-zinc-400 whitespace-nowrap"
            >
              {cat}
            </Badge>
          ))}
        </div>
        <Button variant="outline" className="border-zinc-800 bg-zinc-900/50">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Featured Recaps
          </h2>
          <Button variant="link" className="text-red-500">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredScripts.map((script) => (
            <motion.div
              key={script.id}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden cursor-pointer hover:border-red-500/30 transition-all">
                <div className="aspect-video bg-zinc-950 relative">
                  <img 
                    src={script.image} 
                    alt={script.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                      <Play className="w-6 h-6 fill-white text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] font-mono text-white">
                    {script.duration}
                  </div>
                </div>
                <CardHeader className="p-4">
                  <div className="flex gap-2 mb-2">
                    {script.tags.map(tag => (
                      <span key={tag} className="text-[8px] font-bold uppercase tracking-widest bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-base line-clamp-1">{script.title}</CardTitle>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-zinc-500">by {script.author}</span>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {script.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {script.views}
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

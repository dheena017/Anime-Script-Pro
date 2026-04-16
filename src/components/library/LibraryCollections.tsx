import React from 'react';
import { 
  Folder, 
  MoreVertical, 
  Users, 
  Lock, 
  FileStack,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

interface CollectionCardProps {
  name: string;
  itemCount: number;
  lastEdited: string;
  isPrivate?: boolean;
  collaborators?: number;
}

function CollectionCard({ name, itemCount, lastEdited, isPrivate, collaborators }: CollectionCardProps) {
  return (
    <Card className="group relative bg-zinc-900/30 border-zinc-800/50 hover:border-red-500/30 transition-all p-5 backdrop-blur-sm overflow-hidden flex flex-col gap-4 min-w-[280px]">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Folder className="w-6 h-6 text-red-500 fill-red-500/10" />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1 group-hover:text-red-500 transition-colors">
          {name}
        </h4>
        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <FileStack className="w-3 h-3" />
            {itemCount} Scripts
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <span>Edited {lastEdited}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
        <div className="flex -space-x-2">
          {[1, 2].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-800" />
          ))}
          {collaborators && collaborators > 2 && (
            <div className="w-6 h-6 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-500">
              +{collaborators - 2}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isPrivate ? (
            <Lock className="w-3 h-3 text-zinc-600" />
          ) : (
            <Users className="w-3 h-3 text-blue-500" />
          )}
          <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Card>
  );
}

export function LibraryCollections() {
  const collections = [
    { name: 'Cyberpunk Red', itemCount: 12, lastEdited: '2h ago', collaborators: 4 },
    { name: 'Daily Shorts', itemCount: 45, lastEdited: '5d ago', isPrivate: true },
    { name: 'Season 2 Concept', itemCount: 8, lastEdited: 'Oct 12', collaborators: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500">
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.1em]">Active Collections</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Organize your productions into folders</p>
          </div>
        </div>
        <Button variant="outline" className="border-zinc-800 bg-zinc-950/50 h-9 px-4 text-[10px] font-black uppercase tracking-widest">
          <Plus className="w-3.5 h-3.5 mr-2" />
          New Collection
        </Button>
      </div>

      <div className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide">
        {collections.map((col, i) => (
          <motion.div
            key={col.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <CollectionCard {...col} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

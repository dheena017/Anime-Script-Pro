import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Copy, Download, Trash2 } from 'lucide-react';
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { settingsService } from '@/services/api/settings';
import { useAuth } from '@/hooks/useAuth';

interface FavoriteItem {
  id: string;
  title: string;
  type: string;
  preview?: string;
  created_at?: string;
  rating?: number;
}

interface FavoritesTabProps {
  searchTerm: string;
  viewMode: 'grid' | 'list';
  sortBy: string;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({ searchTerm, viewMode, sortBy: initialSortBy }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy] = useState<'recent' | 'oldest' | 'rating'>(initialSortBy as any || 'recent');

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getFavorites();
      setFavorites(data.map(f => ({
        id: f.id,
        title: (f as any).title || f.url.split('/').pop() || 'Untitled Favorite',
        type: f.asset_type.toLowerCase(),
        preview: f.thumbnail_url || (f.asset_type === 'IMAGE' ? f.url : undefined),
        created_at: f.created_at,
        rating: (f as any).rating || 5
      })));
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  const types = ['image', 'video', 'script', 'character'];
  let filteredFavorites = favorites.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || f.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Sort
  if (sortBy === 'recent') {
    filteredFavorites = [...filteredFavorites].sort((a, b) =>
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  } else if (sortBy === 'oldest') {
    filteredFavorites = [...filteredFavorites].sort((a, b) =>
      new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    );
  } else if (sortBy === 'rating') {
    filteredFavorites = [...filteredFavorites].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const removeFavorite = async (id: string) => {
    const success = await settingsService.toggleFavorite(id);
    if (success) {
      setFavorites(favorites.filter(f => f.id !== id));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'script': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'character': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'image': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'video': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'script': return '📝';
      case 'character': return '👤';
      case 'image': return '🎨';
      case 'video': return '🎬';
      default: return '✨';
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="w-10 h-10 border-4 border-[#bd4a4a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Retrieving Starred Items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Type Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedType('all')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition",
            selectedType === 'all'
              ? "bg-[#bd4a4a] text-white"
              : "bg-zinc-900 border border-zinc-900 text-zinc-400 hover:border-[#bd4a4a]/30"
          )}
        >
          All ({favorites.length})
        </button>
        {types.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition capitalize",
              selectedType === type
                ? "bg-[#bd4a4a] text-white"
                : "bg-zinc-900 border border-zinc-900 text-zinc-400 hover:border-[#bd4a4a]/30"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Favorites Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-zinc-950 border-[#bd4a4a]/30 hover:border-[#bd4a4a]/60 transition-all group overflow-hidden">
                  {item.preview ? (
                    <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                      <img
                        src={item.preview}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center text-6xl">
                      {getTypeIcon(item.type)}
                    </div>
                  )}

                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-black text-white uppercase tracking-[0.2em] flex-1 line-clamp-2">
                          {item.title}
                        </CardTitle>
                        <Heart className="w-5 h-5 text-[#bd4a4a] fill-[#bd4a4a] shrink-0" />
                      </div>
                      <span className={cn(
                        "inline-block px-3 py-1 border rounded text-[8px] font-bold uppercase tracking-widest capitalize",
                        getTypeColor(item.type)
                      )}>
                        {item.type}
                      </span>
                    </div>

                    {item.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < (item.rating ?? 0) ? "fill-[#bd4a4a] text-[#bd4a4a]" : "text-zinc-700"
                            )}
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-[8px] text-zinc-600">
                      {item.created_at ? `Saved ${new Date(item.created_at).toLocaleDateString()}` : 'Recently saved'}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 p-2 hover:bg-[#bd4a4a]/10 text-zinc-500 hover:text-white border border-transparent hover:border-[#bd4a4a]/30 rounded transition flex items-center justify-center gap-1 text-[8px] font-bold uppercase tracking-widest">
                        <Copy className="w-3 h-3" /> Use
                      </button>
                      <button className="flex-1 p-2 hover:bg-[#bd4a4a]/10 text-zinc-500 hover:text-white border border-transparent hover:border-[#bd4a4a]/30 rounded transition flex items-center justify-center gap-1 text-[8px] font-bold uppercase tracking-widest">
                        <Download className="w-3 h-3" /> Get
                      </button>
                      <button
                        onClick={() => removeFavorite(item.id)}
                        className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 border border-transparent hover:border-red-500/30 rounded transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-zinc-900 border-dashed rounded-2xl">
              <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4 opacity-50" />
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                {searchTerm ? 'No favorites match your search' : 'No favorites added yet'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FavoritesTab;

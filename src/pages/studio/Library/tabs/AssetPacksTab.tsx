import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Plus, Download, Trash2, Heart, Eye, Copy } from 'lucide-react';
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { settingsService, MediaAsset } from '@/services/api/settings';
import { useAuth } from '@/hooks/useAuth';

interface AssetPacksTabProps {
  searchTerm?: string;
  viewMode?: 'grid' | 'list';
  sortBy?: string;
}

export const AssetPacksTab: React.FC<AssetPacksTabProps> = ({ searchTerm = '', viewMode = 'grid' }) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getAssets(selectedType === 'all' ? undefined : selectedType.toUpperCase());
      setAssets(data);
    } catch (error) {
      console.error("Failed to load assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [user?.id, selectedType]);

  const assetTypes = ['image', 'audio', 'video', 'document'];
  const filteredAssets = assets.filter(a => {
    const title = (a as any).title || a.url.split('/').pop() || 'Untitled Asset';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const toggleFavorite = async (id: string) => {
    const success = await settingsService.toggleFavorite(id);
    if (success) {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      setFavorites(newFavorites);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'audio': return '🎵';
      case 'video': return '🎬';
      case 'document': return '📄';
      default: return '🖼️';
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="w-10 h-10 border-4 border-[#bd4a4a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Inventory Sync Active...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Asset Type Filter */}
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
          All ({assets.length})
        </button>
        {assetTypes.map(type => (
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

      {/* Assets Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset, idx) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-zinc-950 border-zinc-900 hover:border-[#bd4a4a]/30 transition-all overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedAsset(asset)}>
                  <div className="relative aspect-square bg-zinc-900 overflow-hidden">
                    {asset.thumbnail_url || (asset.asset_type === 'IMAGE' && asset.url) ? (
                      <img src={asset.thumbnail_url || asset.url} alt="Asset" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-6xl">
                        {getAssetIcon(asset.asset_type)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 bg-[#bd4a4a]/20 hover:bg-[#bd4a4a]/40 border border-[#bd4a4a]/40 rounded-lg transition">
                        <Eye className="w-5 h-5 text-white" />
                      </button>
                      <button className="p-3 bg-[#bd4a4a]/20 hover:bg-[#bd4a4a]/40 border border-[#bd4a4a]/40 rounded-lg transition">
                        <Copy className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.id); }}
                        className="p-3 bg-[#bd4a4a]/20 hover:bg-[#bd4a4a]/40 border border-[#bd4a4a]/40 rounded-lg transition"
                      >
                        <Heart className={cn("w-5 h-5 transition", favorites.has(asset.id) ? "fill-white text-white" : "text-white")} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#bd4a4a]/20 border border-[#bd4a4a]/40 rounded text-[8px] font-black text-[#bd4a4a] uppercase tracking-widest">
                      {asset.asset_type}
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <CardTitle className="text-xs font-black text-white uppercase tracking-[0.2em] line-clamp-1">
                      {(asset as any).title || asset.url.split('/').pop() || 'Untitled Asset'}
                    </CardTitle>
                    <div className="text-[8px] text-zinc-600 flex justify-between">
                      <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-zinc-900 border-dashed rounded-2xl">
              <Film className="w-12 h-12 text-zinc-700 mx-auto mb-4 opacity-50" />
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                {searchTerm ? 'No assets match your search' : 'No assets uploaded yet'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {selectedAsset && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedAsset(null)}
        >
          <Card className="bg-zinc-950 border-[#bd4a4a]/30 rounded-3xl max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <CardHeader className="p-8 border-b border-[#bd4a4a]/20">
              <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">{(selectedAsset as any).title || selectedAsset.url.split('/').pop()}</CardTitle>
              <span className="inline-block mt-2 px-3 py-1 bg-[#bd4a4a]/10 border border-[#bd4a4a]/30 rounded text-[9px] font-bold text-[#bd4a4a] uppercase tracking-widest capitalize">{selectedAsset.asset_type}</span>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {(selectedAsset.asset_type === 'IMAGE' || selectedAsset.thumbnail_url) && <img src={selectedAsset.url || selectedAsset.thumbnail_url} alt="Asset" className="w-full rounded-xl border border-zinc-900" />}
              <div className="flex gap-4">
                <Button className="flex-1 bg-[#bd4a4a] hover:bg-[#d45555] rounded-xl px-6 py-3 font-black uppercase text-sm tracking-widest"><Plus className="w-4 h-4 mr-2" /> Use</Button>
                <Button variant="outline" className="flex-1 rounded-xl px-6 py-3 font-black uppercase text-sm tracking-widest"><Download className="w-4 h-4 mr-2" /> Download</Button>
                <Button variant="outline" className="rounded-xl px-6 py-3 font-black uppercase text-sm tracking-widest"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AssetPacksTab;

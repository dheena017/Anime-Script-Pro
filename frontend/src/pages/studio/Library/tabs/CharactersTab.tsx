import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Edit3, Trash2, Heart, Share2, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { characterApi } from '@/services/api/characters';
import { useAuth } from '@/hooks/useAuth';

interface Character {
  id: string;
  name: string;
  role?: string;
  personality?: string;
  appearance?: string;
  visual_dna?: string;
  reference_image_url?: string;
  seed?: string;
  created_at?: string;
  is_liked?: boolean;
}

interface CharactersTabProps {
  searchTerm: string;
  viewMode: 'grid' | 'list';
}

export const CharactersTab: React.FC<CharactersTabProps> = ({ searchTerm, viewMode }) => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const fetchCharacters = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const cast = await characterApi.getCharacters(user.id);
      if (cast && cast.character_list_blob) {
        const parsedList = JSON.parse(cast.character_list_blob);
        setCharacters(parsedList.map((c: any) => ({
          id: c.id || Math.random().toString(36).substr(2, 9),
          name: c.name || 'Unknown Unit',
          role: c.role || 'Neutral',
          personality: c.personality || c.traits || '',
          appearance: c.appearance || '',
          reference_image_url: c.imageUrl || c.reference_image_url || '',
          created_at: cast.updated_at
        })));
      }
    } catch (error) {
      console.error("Failed to fetch characters:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [user?.id]);

  const roles = ['Protagonist', 'Antagonist', 'Ally', 'Rival', 'Neutral', 'Background'];
  const filteredCharacters = characters.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.personality?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || c.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="w-12 h-12 border-4 border-[#bd4a4a] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Loading Character Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Role Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedRole('all')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition",
            selectedRole === 'all'
              ? "bg-[#bd4a4a] text-white"
              : "bg-zinc-900 border border-zinc-900 text-zinc-400 hover:border-[#bd4a4a]/30"
          )}
        >
          All ({characters.length})
        </button>
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition",
              selectedRole === role
                ? "bg-[#bd4a4a] text-white"
                : "bg-zinc-900 border border-zinc-900 text-zinc-400 hover:border-[#bd4a4a]/30"
            )}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Characters Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map((character, idx) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-zinc-950 border-zinc-900 hover:border-[#bd4a4a]/30 transition-all overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedCharacter(character)}>
                  {/* Character Image */}
                  <div className="relative aspect-square bg-zinc-900 overflow-hidden">
                    <img
                      src={character.reference_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${character.name}`}
                      alt={character.name}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* DNA Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#bd4a4a]/20 border border-[#bd4a4a]/40 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <Zap className="w-3 h-3 text-[#bd4a4a]" />
                      <span className="text-xs font-black text-[#bd4a4a] uppercase tracking-widest">Character</span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(character.id);
                      }}
                      className="absolute bottom-4 right-4 p-2 bg-[#bd4a4a]/10 hover:bg-[#bd4a4a]/20 border border-[#bd4a4a]/30 rounded-lg transition"
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4 transition",
                          favorites.has(character.id) ? "fill-[#bd4a4a] text-[#bd4a4a]" : "text-zinc-600"
                        )}
                      />
                    </button>
                  </div>

                  {/* Character Info */}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <CardTitle className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        {character.name}
                      </CardTitle>
                      {character.role && (
                        <span className="inline-block mt-2 px-2 py-1 bg-[#bd4a4a]/10 border border-[#bd4a4a]/30 rounded text-xs font-bold text-[#bd4a4a] uppercase tracking-widest">
                          {character.role}
                        </span>
                      )}
                    </div>

                    {character.personality && (
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {character.personality}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 p-2 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded transition flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-widest">
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button className="p-2 hover:bg-zinc-900 text-zinc-500 hover:text-[#bd4a4a] rounded transition">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-zinc-900 border-dashed rounded-2xl">
              <Fingerprint className="w-12 h-12 text-zinc-700 mx-auto mb-4 opacity-50" />
              <p className="text-xs font-black text-zinc-700 uppercase tracking-widest">
                {searchTerm ? 'No characters match your search' : 'No characters saved yet'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Panel */}
      {selectedCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCharacter(null)}
        >
          <Card className="bg-zinc-950 border-[#bd4a4a]/30 rounded-3xl max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <CardHeader className="p-8 border-b border-[#bd4a4a]/20">
              <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">
                {selectedCharacter.name}
              </CardTitle>
              {selectedCharacter.role && (
                <span className="inline-block mt-2 px-3 py-1 bg-[#bd4a4a]/10 border border-[#bd4a4a]/30 rounded text-xs font-bold text-[#bd4a4a] uppercase tracking-widest">
                  {selectedCharacter.role}
                </span>
              )}
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedCharacter.reference_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCharacter.name}`}
                    alt={selectedCharacter.name}
                    className="w-full rounded-xl border border-zinc-900"
                  />
                </div>
                <div className="space-y-4">
                  {selectedCharacter.personality && (
                    <div>
                      <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Personality</h3>
                      <p className="text-[13px] text-zinc-300 leading-relaxed">{selectedCharacter.personality}</p>
                    </div>
                  )}
                  {selectedCharacter.appearance && (
                    <div>
                      <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Appearance</h3>
                      <p className="text-[13px] text-zinc-300 leading-relaxed">{selectedCharacter.appearance}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-[#bd4a4a] hover:bg-[#d45555] rounded-xl px-6 py-3 font-black uppercase text-sm tracking-widest">
                  Use Character
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl px-6 py-3 font-black uppercase text-sm tracking-widest">
                  <Share2 className="w-4 h-4 mr-2" /> Share Character
                </Button>
                <Button variant="outline" className="rounded-xl px-6 py-3 font-black uppercase text-sm tracking-widest">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CharactersTab;

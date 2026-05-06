import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Edit3, Trash2, Copy, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { fetchTemplates } from '@/services/api/templates';

interface SavedPrompt {
  id: string;
  label: string;
  prompt_text: string;
  category?: string;
  created_at?: string;
  usage_count?: number;
}

interface ScriptsTabProps {
  searchTerm: string;
  viewMode: 'grid' | 'list';
}

export const ScriptsTab: React.FC<ScriptsTabProps> = ({ searchTerm, viewMode }) => {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const templates = await fetchTemplates();
      setPrompts(templates.map(t => ({
        id: t.id.toString(),
        label: t.name,
        prompt_text: t.prompt,
        category: t.category,
        created_at: t.created_at,
        usage_count: t.stats?.usage || 0
      })));
    } catch (error) {
      console.error("Failed to load script blueprints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const categories = ['World Building', 'Character Development', 'Plot Structure', 'Dialogue', 'Action', 'Lore'];
  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prompt_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="w-10 h-10 border-4 border-[#bd4a4a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Compiling Blueprints...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition",
            selectedCategory === 'all'
              ? "bg-[#bd4a4a] text-white"
              : "bg-zinc-900 border border-zinc-900 text-zinc-400 hover:border-[#bd4a4a]/30"
          )}
        >
          All ({prompts.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition",
              selectedCategory === cat
                ? "bg-[#bd4a4a] text-white"
                : "bg-zinc-900 border border-zinc-900 text-zinc-400 hover:border-[#bd4a4a]/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompts Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt, idx) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-zinc-950 border-zinc-900 hover:border-[#bd4a4a]/30 transition-all cursor-pointer group"
                  onClick={() => setSelectedPrompt(prompt)}>
                  <CardHeader className="p-6 border-b border-white/5">
                    <div className="space-y-2">
                      <CardTitle className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        {prompt.label}
                      </CardTitle>
                      {prompt.category && (
                        <span className="inline-block px-2 py-1 bg-[#bd4a4a]/10 border border-[#bd4a4a]/30 rounded text-[8px] font-bold text-[#bd4a4a] uppercase tracking-widest">
                          {prompt.category}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-[13px] text-zinc-400 line-clamp-3 leading-relaxed">
                      {prompt.prompt_text}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-zinc-600">
                      <span>Used {prompt.usage_count || 0}x</span>
                      <span>{prompt.created_at ? new Date(prompt.created_at).toLocaleDateString() : 'Recently'}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="flex-1 p-2 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded transition flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      <button className="flex-1 p-2 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded transition flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
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
            <div className="col-span-2 py-20 text-center border border-zinc-900 border-dashed rounded-2xl">
              <Terminal className="w-12 h-12 text-zinc-700 mx-auto mb-4 opacity-50" />
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                {searchTerm ? 'No blueprints match your search' : 'No prompts saved yet'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Panel */}
      {selectedPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPrompt(null)}
        >
          <Card className="bg-zinc-950 border-[#bd4a4a]/30 rounded-3xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <CardHeader className="p-8 border-b border-[#bd4a4a]/20">
              <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">
                {selectedPrompt.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-900">
                <p className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {selectedPrompt.prompt_text}
                </p>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1 bg-[#bd4a4a] hover:bg-[#d45555] rounded-xl px-6 py-3 font-black uppercase text-sm tracking-widest">
                  <Copy className="w-4 h-4 mr-2" /> Copy Prompt
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl px-6 py-3 font-black uppercase text-sm tracking-widest">
                  <Download className="w-4 h-4 mr-2" /> Export
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

export default ScriptsTab;

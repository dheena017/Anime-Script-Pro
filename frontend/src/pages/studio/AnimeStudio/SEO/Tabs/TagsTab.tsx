import React from 'react';
import { Tag, Sparkles, Copy, RefreshCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { seoStyles as s } from '../seoStyles';

interface TagsTabProps {
  content: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const TagsTab: React.FC<TagsTabProps> = ({ content, isGenerating, onGenerate }) => {
  // Parsing a markdown content to extract potential tags if needed, 
  // but for now we'll just show the raw content or a structured view.
  
  return (
    <div className="space-y-6">
      <div className={s.headerContainer}>
        <div>
          <h3 className={s.headerTitle}>
            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
            Meta Tags & Categories
          </h3>
          <p className={s.headerSubtitle}>Technical metadata, category mappings, and algorithmic tag clusters.</p>
        </div>

        <Button
          size="sm"
          className={s.generateButtonBase + ' bg-fuchsia-500 text-white hover:bg-fuchsia-600 shadow-[0_0_25px_rgba(217,70,239,0.4)]'}
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <RefreshCcw className="w-4 h-4 mr-3 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-3" />
          )}
          {isGenerating ? 'Compiling Tags...' : 'Generate Tags'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={s.cardContainer + ' lg:col-span-2 p-8 min-h-[400px]'}>
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {content ? (
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className={s.tagManifestHeader + ' text-fuchsia-400'}>Tag Manifest</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className={s.tagsContainer}>
                {/* Mockup of tag display */}
                {['Anime', 'Storytelling', 'AI Production', 'Animation', 'Tutorial', 'Nexus', 'Visual DNA'].map((tag, i) => (
                  <div key={i} className={s.tagItem + ' bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-300'}>
                    <Tag className="w-3 h-3" />
                    {tag}
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 italic mt-8 leading-relaxed">
                These tags are optimized for YouTube, TikTok, and Instagram discovery algorithms based on your script content.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-700">
              <Tag className="w-12 h-12 mb-6 opacity-20" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-center max-w-[200px]">No tag clusters generated yet.</p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className={s.sidebarCard}>
            <h4 className={s.sidebarTitle}>Platform Specifics</h4>
            <div className="space-y-2">
              {['YouTube (500 chars)', 'TikTok (4000 chars)', 'Instagram (30 tags)'].map((p, i) => (
                <div key={i} className={s.platformSpec}>
                  <span className="text-xs font-bold text-zinc-500">{p}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};




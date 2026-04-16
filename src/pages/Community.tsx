import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Flame,
  LayoutGrid,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageShell, SectionHeading } from '@/components/page/PageShell';
import { trendingScripts } from '@/data/pages/communityData';

// New Components
import { CommunityHero } from '@/components/community/CommunityHero';
import { CommunityCreatorCard } from '@/components/community/CommunityCreatorCard';
import { DiscoverCard } from '@/components/discover/DiscoverCard';

export function CommunityPage() {
  return (
    <PageShell className="space-y-20 pb-20">
      <CommunityHero />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Main Content: Trending Scripts */}
        <div className="xl:col-span-2 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <SectionHeading
              title="MISSION OBJECTIVES"
              icon={<TrendingUp className="w-6 h-6 text-red-500" />}
              titleClassName="text-3xl font-black tracking-tighter uppercase italic"
              className="p-0 border-none m-0"
            />
            <div className="flex items-center gap-4">
               {['Trending', 'Most Recent', 'Highest Rated'].map(opt => (
                 <button key={opt} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    {opt}
                 </button>
               ))}
               <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
               <Filter className="w-4 h-4 text-zinc-700 hover:text-red-500 cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendingScripts.map((script) => (
              <DiscoverCard 
                key={script.id} 
                script={{
                  ...script,
                  rating: 4.8,
                  views: `${script.likes}k`,
                  image: `https://picsum.photos/seed/comm-${script.id}/800/450`,
                  tags: [script.genre, 'Community']
                }} 
              />
            ))}
          </div>

          {/* Call to action for more */}
          <div className="pt-6 flex justify-center">
             <Button variant="outline" className="border-zinc-800 bg-zinc-950/50 h-12 px-10 rounded-2xl uppercase font-black text-[10px] tracking-[0.2em] hover:bg-zinc-900 transition-all text-zinc-400 hover:text-white">
                View All Community Assets
             </Button>
          </div>
        </div>

        {/* Sidebar: Top Creators */}
        <div className="space-y-10">
          <div className="space-y-1">
            <SectionHeading
              title="ELITE OPERATIVES"
              icon={<Users className="w-6 h-6 text-red-500" />}
              titleClassName="text-2xl font-black tracking-tighter uppercase italic"
              className="p-0 border-none m-0"
            />
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-9">Highest production output this week</p>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CommunityCreatorCard 
                key={i} 
                id={i} 
                name={`OPERATIVE_${i * 123}`} 
                stats={`${15 + i * 2}0 Scripts • ${i}.2m Views`} 
              />
            ))}
          </div>

          {/* Mini Event Card */}
          <div className="p-6 rounded-[32px] bg-gradient-to-br from-red-600/20 to-zinc-900 border border-red-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-[2000ms]">
               <Flame className="w-24 h-24 text-red-500" />
            </div>
            <div className="relative z-10 space-y-4">
               <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                  <Flame className="w-5 h-5 text-white" />
               </div>
               <div>
                  <h4 className="text-xl font-black tracking-tight uppercase leading-none mb-1">Weekly Challenge</h4>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest italic font-mono">Status: Active</p>
               </div>
               <p className="text-xs text-zinc-400 leading-relaxed font-medium pr-4">
                  Theme: "Neon Dystopia". Submit your best cyberpunk prompt to win a Verified Creator Badge.
               </p>
               <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-xl">
                  Entry Terminal
               </Button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

import { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Zap, 
  LifeBuoy, 
  ExternalLink,
  Cpu,
  ShieldCheck,
  FileText,
  Mail,
  Activity,
  ArrowRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supportService, HelpCategory, FAQ } from '@/services/api/support';

const ICON_MAP: Record<string, any> = {
  Zap,
  FileText,
  Cpu,
  ShieldCheck,
  BookOpen,
  HelpCircle
};

export default function HelpPage() {
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ faqs: FAQ[] } | null>(null);

  useEffect(() => {
    async function hydrate() {
      try {
        const [cats, frequentFaqs] = await Promise.all([
          supportService.getHelpCategories(),
          supportService.getFAQs(true)
        ]);
        setCategories(cats);
        setFaqs(frequentFaqs);
      } catch (err) {
        console.error("Transmission failed", err);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const results = await supportService.searchHelp(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error("Search protocol failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
           <div className="w-16 h-16 border-2 border-studio/20 border-t-studio rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-6 h-6 text-studio animate-pulse" />
           </div>
        </div>
        <span className="text-[10px] font-black text-studio uppercase tracking-[0.5em] animate-pulse">Initializing Terminal</span>
      </div>
    );
  }

  const displayFaqs = searchResults ? searchResults.faqs : faqs;

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col p-6 lg:p-12 selection:bg-studio/30">
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-24">
        
        {/* 1. KNOWLEDGE SEARCH MATRIX */}
        <header className="flex flex-col items-center text-center space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="px-4 py-1.5 bg-studio/5 rounded-full border border-studio/20 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-studio" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-studio">Help Archive</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
              How can we <span className="text-studio">Assist?</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
              Global knowledge terminal for autonomous production protocols. Search the archive or initialize a support directive.
            </p>
          </div>

          <div className="w-full max-w-3xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-studio/30 to-fuchsia-500/30 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700" />
            <div className="relative flex items-center bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-3 pl-8 focus-within:border-studio/50 transition-all duration-500 shadow-2xl">
              <Search className={cn("w-6 h-6 transition-colors", isSearching ? "text-studio animate-pulse" : "text-zinc-600")} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-700 text-xl py-8 font-black uppercase tracking-widest" 
                placeholder="SEARCH PROTOCOLS, MODELS, OR BILLING..." 
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="bg-studio text-black font-black uppercase tracking-widest rounded-[1.5rem] px-10 h-16 hover:bg-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                {isSearching ? "SEARCHING..." : "INITIALIZE"}
              </Button>
            </div>
          </div>
        </header>

        {/* 2. PROTOCOL GRID */}
        {!searchResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => {
              const Icon = ICON_MAP[cat.icon] || HelpCircle;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-[#0a0a0b] border border-white/5 p-10 rounded-[3rem] hover:border-studio/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group cursor-pointer relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                      <Icon className={cn("w-32 h-32", cat.color)} />
                    </div>
                    <div className="relative z-10 space-y-10">
                      <div className={cn("w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all duration-700 group-hover:bg-studio group-hover:-rotate-6", cat.color)}>
                        <Icon className="w-8 h-8 group-hover:text-black transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">NODE-P{idx + 1}</span>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-widest group-hover:text-studio transition-colors">{cat.label}</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{cat.sub}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-studio uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-700">
                        OPEN PROTOCOL <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* 3. ARCHIVE MONITOR */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
               <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-studio/10 rounded-xl border border-studio/20">
                     <Zap className="w-6 h-6 text-studio fill-studio" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    {searchResults ? `Archive Search (${displayFaqs.length})` : 'Frequent Inquiries'}
                  </h2>
               </div>
               {searchResults && (
                 <button onClick={() => { setSearchQuery(''); setSearchResults(null); }} className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">
                    Reset Archive
                 </button>
               )}
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {displayFaqs.length > 0 ? displayFaqs.map((faq, idx) => (
                  <motion.div 
                    layout
                    key={faq.id || idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-8 bg-[#0a0a0b] border border-white/5 rounded-[2.5rem] hover:border-studio/30 transition-all cursor-pointer group shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                           <p className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-studio transition-colors">{faq.question}</p>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed pl-4 border-l border-white/5">
                           {faq.answer}
                        </p>
                      </div>
                      <div className="bg-zinc-900 p-2.5 rounded-xl text-zinc-700 group-hover:text-studio group-hover:bg-white transition-all shadow-inner">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-32 bg-zinc-900/10 rounded-[3rem] border border-dashed border-white/5">
                     <LifeBuoy className="w-16 h-16 text-zinc-800 mx-auto mb-6 animate-spin-slow" />
                     <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px]">Transmission Error: Protocol Not Found In Archive.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 4. SYNC MONITOR (SIDEBAR) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
               <div className="p-2.5 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20">
                  <Activity className="w-6 h-6 text-fuchsia-500" />
               </div>
               <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Support Core</h2>
            </div>

            <div className="space-y-6">
               <Card className="bg-gradient-to-br from-[#0a0a0b] to-black border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-3xl">
                  <div className="space-y-4 text-center">
                    <div className="w-20 h-20 bg-studio/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-studio/10 relative">
                      <Mail className="w-10 h-10 text-studio" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Priority Support</h3>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Response Latency: &lt; 2 hours</p>
                  </div>
                  <Button className="w-full h-16 bg-studio text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] hover:bg-white transition-all shadow-2xl">
                    INITIATE CONTACT LINK
                  </Button>
               </Card>

               <div className="grid grid-cols-1 gap-3">
                  {[
                    { icon: BookOpen, label: 'API Protocols', link: '/documentation' },
                    { icon: MessageSquare, label: 'Global Collective', link: '#' }
                  ].map((item, idx) => (
                    <a 
                      key={idx}
                      href={item.link} 
                      className="flex items-center justify-between p-6 bg-zinc-900/30 border border-white/5 rounded-[1.5rem] hover:bg-studio/5 hover:border-studio/30 transition-all group no-underline"
                    >
                      <div className="flex items-center gap-4">
                        <item.icon className="w-5 h-5 text-zinc-700 group-hover:text-studio" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] group-hover:text-white">{item.label}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-800 group-hover:text-studio" />
                    </a>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* 5. SYSTEM STATUS FOOTER */}
        <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span>Studio Uptime: 99.98%</span>
              </div>
              <div className="w-px h-4 bg-white/5 hidden md:block" />
              <span>Node: Global-Archive-Main</span>
           </div>
           <div className="flex items-center gap-12">
              <a href="#" className="hover:text-studio transition-colors no-underline">Privacy Policy</a>
              <a href="#" className="hover:text-studio transition-colors no-underline">Terms of Service</a>
              <a href="/system/status" className="hover:text-studio transition-colors no-underline">System Status</a>
           </div>
        </footer>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  MessageCircle, 
  LifeBuoy, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FAQ_DATA } from '../constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredFaq = FAQ_DATA.filter(
    item => 
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="max-w-7xl mx-auto py-32 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* 1. ARCHITECTURAL SIDEBAR */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-6">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                <span className="text-xs font-black text-studio uppercase tracking-[0.4em]">Intelligence Node</span>
             </div>
             <h2 className="text-4xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Technical <br /> <span className="text-studio">Inquiry</span></h2>
             <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
               Comprehensive documentation for the AnimeScript Pro production protocols.
             </p>
          </div>

          {/* SEARCH PROTOCOL */}
          <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-studio/50 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH PROTOCOLS..."
                  className="bg-zinc-900/50 border-zinc-800 rounded-2xl h-14 pl-12 font-black uppercase tracking-widest text-xs focus:border-studio/50"
                />
             </div>
          </div>

          {/* SUPPORT COMMAND MODULE */}
          <div className="p-8 rounded-[2.5rem] bg-studio/[0.02] border border-studio/10 space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-studio/10 border border-studio/20 flex items-center justify-center text-studio">
                   <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest">Still Need Assistance?</h4>
                   <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Command Center is active 24/7</p>
                </div>
             </div>
             <Button className="w-full h-14 bg-white text-black hover:bg-studio font-black uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center justify-center gap-3">
                Contact Support <ArrowRight className="w-4 h-4" />
             </Button>
          </div>
        </div>

        {/* 2. NEURAL ACCORDION MATRIX */}
        <div className="lg:col-span-8">
           <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredFaq.length > 0 ? (
                  filteredFaq.map((faq, i) => {
                    const isOpen = activeIndex === i;
                    return (
                      <motion.div
                        layout
                        key={faq.q}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          "rounded-[2rem] border transition-all duration-500 overflow-hidden",
                          isOpen 
                            ? "bg-[#0a0a0b] border-studio/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
                            : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                        )}
                      >
                        <button
                          onClick={() => setActiveIndex(isOpen ? null : i)}
                          className="w-full p-8 flex items-center justify-between text-left group"
                        >
                          <div className="flex items-center gap-6">
                             <div className={cn(
                               "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500",
                               isOpen ? "bg-studio text-black" : "bg-white/5 text-zinc-600 group-hover:text-white"
                             )}>
                                <span className="text-xs font-black">{i + 1}</span>
                             </div>
                             <span className={cn(
                               "text-sm font-black uppercase tracking-widest transition-colors",
                               isOpen ? "text-white" : "text-zinc-400 group-hover:text-white"
                             )}>
                                {faq.q}
                             </span>
                          </div>
                          <ChevronDown className={cn(
                            "w-5 h-5 transition-transform duration-500",
                            isOpen ? "rotate-180 text-studio" : "text-zinc-700"
                          )} />
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            >
                              <div className="px-8 pb-8 pl-[4.5rem]">
                                 <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase tracking-widest">
                                    {faq.a}
                                 </p>
                                 <div className="mt-6 flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                       <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                       <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Verified Protocol</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Zap className="w-3.5 h-3.5 text-studio" />
                                       <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">System Active</span>
                                    </div>
                                 </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-20 text-center space-y-4 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5"
                  >
                     <LifeBuoy className="w-12 h-12 text-zinc-800 mx-auto animate-spin-slow" />
                     <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">No protocols found for "{searchTerm}"</p>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </section>
  );
};



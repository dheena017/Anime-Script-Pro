import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Terminal, ChevronRight, FileText, Search } from 'lucide-react';

const docSections = [
  { 
    title: "Getting Started", 
    icon: Book, 
    items: ["System Requirements", "Installation Guide", "Quick Start"],
    desc: "Initial setup and architectural deployment."
  },
  { 
    title: "System Logic", 
    icon: Terminal, 
    items: ["Story Development", "Character Design", "Logic Management"],
    desc: "Understanding the core AI reasoning engine."
  },
  { 
    title: "API Reference", 
    icon: Code, 
    items: ["Authentication", "Endpoint Mapping", "Webhooks"],
    desc: "Developer integrations and neural hooks."
  },
];

export const DocumentationTab: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-950/50 border border-white/5 p-8 rounded-[2.5rem]">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Knowledge Repository</h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Access system blueprints and integration protocols</p>
        </div>
        <div className="relative min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
          <input 
            type="text" 
            placeholder="SEARCH BLUEPRINTS..." 
            className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-[#bd4a4a]/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {docSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-950 border border-white/5 rounded-[3rem] p-8 hover:border-[#bd4a4a]/30 transition-all group cursor-pointer shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 group-hover:border-[#bd4a4a]/20 transition-all">
                <section.icon className="w-6 h-6 text-[#bd4a4a]" />
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-zinc-700" />
              </div>
            </div>

            <h3 className="text-lg font-black text-white uppercase tracking-tighter italic mb-2">{section.title}</h3>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-loose mb-8">{section.desc}</p>

            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-white/5 hover:border-[#bd4a4a]/10 transition-all group/item">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover/item:text-zinc-300">{item}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-800 group-hover/item:text-[#bd4a4a] transition-colors" />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DocumentationTab;

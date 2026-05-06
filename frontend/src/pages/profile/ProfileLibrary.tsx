import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Fingerprint, Plus, FileText, Trash2, Edit3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileLibraryProps {
   savedPrompts: any[];
   characters: any[];
   onAddPrompt: () => void;
   onAddDNA: () => void;
}

export const ProfileLibrary: React.FC<ProfileLibraryProps> = ({ savedPrompts, characters, onAddPrompt, onAddDNA }) => {
   return (
      <motion.div key="lib" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 md:space-y-12 pt-4 md:pt-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Card className="bg-zinc-950 border-zinc-900 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
               <CardHeader className="p-6 md:p-10 border-b border-white/5 flex flex-row items-center justify-between gap-4">
                  <div className="space-y-2">
                     <CardTitle className="text-xs md:text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Terminal className="w-4 h-4 text-[#bd4a4a]" /> Blueprints</CardTitle>
                     <CardDescription className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest line-clamp-1 md:line-clamp-none">Optimized neural prompt signatures.</CardDescription>
                  </div>
                  <Button onClick={onAddPrompt} size="sm" className="bg-[#bd4a4a] hover:bg-[#d45555] rounded-xl px-3 md:px-4 py-4 md:py-6 font-black uppercase text-[8px] md:text-[9px] tracking-widest flex gap-2">
                     <Plus className="w-3 h-3" /> New
                  </Button>
               </CardHeader>
               <CardContent className="p-6 md:p-10 space-y-4 md:space-y-6">
                  {savedPrompts.map((p, i) => (
                     <div key={p.id || i} className="group p-6 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center justify-between hover:border-[#bd4a4a]/40 transition-all">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-white uppercase tracking-widest">{p.label}</p>
                           <p className="text-[9px] text-zinc-500 font-medium line-clamp-1">{p.prompt_text}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button className="p-2 hover:text-white text-zinc-600"><Edit3 className="w-3.5 h-3.5" /></button>
                           <button className="p-2 hover:text-[#bd4a4a] text-zinc-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                  ))}
                  {savedPrompts.length === 0 && <div className="py-20 text-center border border-zinc-900 border-dashed rounded-[2rem] text-[9px] font-black text-zinc-700 uppercase tracking-widest">Blueprint Vault Empty</div>}
               </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-zinc-900 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
               <CardHeader className="p-6 md:p-10 border-b border-white/5 flex flex-row items-center justify-between gap-4">
                  <div className="space-y-2">
                     <CardTitle className="text-xs md:text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Fingerprint className="w-4 h-4 text-[#bd4a4a]" /> Character DNA</CardTitle>
                     <CardDescription className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest line-clamp-1 md:line-clamp-none">Visual signatures for cast consistency.</CardDescription>
                  </div>
                  <Button onClick={onAddDNA} size="sm" className="bg-[#bd4a4a] hover:bg-[#d45555] rounded-xl px-3 md:px-4 py-4 md:py-6 font-black uppercase text-[8px] md:text-[9px] tracking-widest flex gap-2">
                     <Plus className="w-3 h-3" /> Forge
                  </Button>
               </CardHeader>
               <CardContent className="p-6 md:p-10">
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                     {characters.map((c, i) => (
                        <div key={c.id || i} className="group relative aspect-square bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#bd4a4a]/40 transition-all">
                           <img src={c.reference_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" />
                           <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent pt-12">
                              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{c.name}</p>
                              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Seed: {c.seed}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                  {characters.length === 0 && <div className="py-20 text-center border border-zinc-900 border-dashed rounded-[2rem] text-[9px] font-black text-zinc-700 uppercase tracking-widest">Character DNA Empty</div>}
               </CardContent>
            </Card>

            <Card className="col-span-full bg-[#bd4a4a]/5 border border-[#bd4a4a]/20 rounded-[3rem] overflow-hidden">
               <CardHeader className="p-8 border-b border-[#bd4a4a]/10">
                  <CardTitle className="text-sm font-black text-[#bd4a4a] uppercase tracking-[0.3em] flex items-center gap-3 italic"><FileText className="w-4 h-4" /> Production Logs</CardTitle>
                  <CardDescription className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Detailed technical blueprints and narrative scripts exported from the studio.</CardDescription>
               </CardHeader>
               <CardContent className="p-12 text-center space-y-4 opacity-30">
                  <FileText className="w-12 h-12 text-[#bd4a4a] mx-auto" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">No Production Exports Detected</p>
               </CardContent>
            </Card>
         </div>
      </motion.div>
   );
};




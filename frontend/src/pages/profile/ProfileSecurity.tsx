import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Trash2, Mail, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileSecurityProps {
   onDeactivate: () => void;
}

// Custom GitHub Icon SVG
const GithubIcon = ({ className }: { className?: string }) => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
   </svg>
);

export const ProfileSecurity: React.FC<ProfileSecurityProps> = ({ onDeactivate }) => {
   return (
      <motion.div key="sec" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-5xl mx-auto space-y-8 md:space-y-12 pt-4 md:pt-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Card className="bg-zinc-950 border border-zinc-900 p-6 md:p-10 rounded-3xl md:rounded-[3rem] space-y-6 md:space-y-8 shadow-2xl">
               <CardHeader className="p-0">
                  <CardTitle className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><ShieldAlert className="w-4 h-4 text-orange-500" /> Identity Protection</CardTitle>
                  <CardDescription className="text-xs md:text-xs font-bold text-zinc-600 uppercase mt-2">Manage your multi-factor credentials and linked identities.</CardDescription>
               </CardHeader>
               <CardContent className="p-0 space-y-4">
                  <Button variant="outline" className="w-full h-12 md:h-14 bg-zinc-900/60 border-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-xs md:text-xs hover:text-white transition-all">Update Credentials</Button>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button className="flex-1 h-12 md:h-14 bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-xs md:text-xs font-black uppercase tracking-widest flex gap-2 justify-center items-center"><GithubIcon className="w-4 h-4" /> Link GitHub</Button>
                     <Button className="flex-1 h-12 md:h-14 bg-zinc-900/40 border border-zinc-800 text-zinc-300 text-xs md:text-xs font-black uppercase tracking-widest flex gap-2 justify-center items-center"><Mail className="w-4 h-4" /> Link Google</Button>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-red-500/5 border border-red-500/20 p-6 md:p-10 rounded-3xl md:rounded-[3rem] space-y-6 md:space-y-8 shadow-2xl">
               <CardHeader className="p-0">
                  <CardTitle className="text-xs font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-3 italic"><Trash2 className="w-4 h-4" /> Destructive Protocols</CardTitle>
                  <CardDescription className="text-xs md:text-xs font-bold text-zinc-700 uppercase mt-2">Permanently delete your account and data.</CardDescription>
               </CardHeader>
               <CardContent className="p-0 space-y-4">
                  <p className="text-xs md:text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Warning: Deleting your account will permanently remove all generation history, character data, and credit balances.</p>
                  <Button onClick={onDeactivate} className="w-full h-12 md:h-14 bg-red-950/40 border border-red-900/50 text-red-500 font-black uppercase tracking-widest text-xs md:text-xs hover:bg-red-600 hover:text-white transition-all">Initiate Node Deletion</Button>
               </CardContent>
            </Card>
         </div>

         <div className="p-6 md:p-8 bg-zinc-900/40 border border-white/5 rounded-2xl md:rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-zinc-500">
                  <Lock className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Security Encryption Active</p>
                  <p className="text-xs text-zinc-600 font-bold uppercase mt-1">All generation logs are encrypted with AES-256-GCM.</p>
               </div>
            </div>
            <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest rounded-full">Secure Node</div>
         </div>
      </motion.div>
   );
};




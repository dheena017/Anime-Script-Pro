import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Database,
  Lock,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { id: 'NODE-L1', title: 'Acceptance of Protocol', icon: Shield },
  { id: 'NODE-L2', title: 'Content Ownership', icon: FileText },
  { id: 'NODE-L3', title: 'Acceptable Use', icon: AlertTriangle },
  { id: 'NODE-L4', title: 'Service Continuity', icon: Activity },
];

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-32 px-6 relative overflow-hidden">
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* 1. HEADER PROTOCOL */}
        <div className="flex flex-col items-center text-center space-y-8">
           <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-studio/5 border border-studio/20">
              <Lock className="w-3.5 h-3.5 text-studio" />
              <span className="text-[10px] font-black text-studio uppercase tracking-[0.4em]">Legal Archive Terminal</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
             Terms of <span className="text-studio">Protocol.</span>
           </h1>
           <p className="text-zinc-500 max-w-2xl uppercase text-[11px] font-bold tracking-[0.2em] leading-relaxed">
             Global legal documentation for the AnimeScript Pro production environment. <br />
             Last Transmitted: {new Date().toLocaleDateString()}
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 2. PROTOCOL INDEX (SIDEBAR) */}
          <div className="lg:col-span-4 space-y-10">
             <div className="space-y-6 sticky top-32">
                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                   <div className="p-2.5 bg-studio/10 rounded-xl border border-studio/20">
                      <Database className="w-6 h-6 text-studio fill-studio" />
                   </div>
                   <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Protocol Index</h2>
                </div>
                
                <div className="space-y-2">
                   {SECTIONS.map((section, idx) => (
                     <a 
                      key={idx}
                      href={`#${section.id}`}
                      className="flex items-center justify-between p-5 bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-studio/5 hover:border-studio/30 transition-all group no-underline"
                     >
                        <div className="flex items-center gap-4">
                           <span className="text-[9px] font-black text-zinc-700 group-hover:text-studio transition-colors">{section.id}</span>
                           <span className="text-[10px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest">{section.title}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-800 group-hover:text-studio transition-colors" />
                     </a>
                   ))}
                </div>

                <div className="p-8 rounded-[2rem] bg-fuchsia-500/[0.02] border border-fuchsia-500/10 space-y-4">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-fuchsia-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Legal Sovereignty</span>
                   </div>
                   <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                      All protocols are binding under global digital production governance. 
                      Account data is subject to encryption standards.
                   </p>
                </div>
             </div>
          </div>

          {/* 3. LEGAL NODE MATRIX */}
          <div className="lg:col-span-8 space-y-12">
             {/* NODE L1 */}
             <section id="NODE-L1" className="p-10 md:p-16 rounded-[3rem] bg-[#0a0a0b] border border-white/5 space-y-10 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Shield className="w-32 h-32 text-studio" />
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                      <span className="text-[10px] font-black text-studio uppercase tracking-[0.4em]">NODE-L1</span>
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Acceptance of Protocol</h2>
                   <p className="text-zinc-500 text-sm font-bold leading-relaxed uppercase tracking-widest">
                      By accessing and using AnimeScript Pro ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                      The Platform provides an AI-powered studio environment for autonomous anime and manga generation. 
                      Protocol link initialization confirms your total agreement with all listed nodes.
                   </p>
                </div>
             </section>

             {/* NODE L2 */}
             <section id="NODE-L2" className="p-10 md:p-16 rounded-[3rem] bg-[#0a0a0b] border border-white/5 space-y-10 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <FileText className="w-32 h-32 text-studio" />
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                      <span className="text-[10px] font-black text-studio uppercase tracking-[0.4em]">NODE-L2</span>
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Content Ownership & Rights</h2>
                   <div className="space-y-4">
                      <p className="text-zinc-500 text-sm font-bold leading-relaxed uppercase tracking-widest">
                         Users retain all rights, title, and interest in and to their original prompts and directives.
                         For users on a paid tier, all generated images and assets belong entirely to the user for commercial and non-commercial use.
                      </p>
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                         <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Free Tier Restriction</span>
                         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">
                            Users on the Aspirant tier are granted a non-exclusive license for personal use only. Commercialization requires Architect or Master protocol.
                         </p>
                      </div>
                   </div>
                </div>
             </section>

             {/* NODE L3 */}
             <section id="NODE-L3" className="p-10 md:p-16 rounded-[3rem] bg-[#0a0a0b] border border-white/5 space-y-10 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <AlertTriangle className="w-32 h-32 text-studio" />
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                      <span className="text-[10px] font-black text-studio uppercase tracking-[0.4em]">NODE-L3</span>
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Acceptable Use Policy</h2>
                   <div className="space-y-6">
                      <p className="text-zinc-500 text-sm font-bold leading-relaxed uppercase tracking-widest">
                         You agree not to use the Platform to generate directives that violate the following protocols:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {[
                           "Illegal Content Or Imagery",
                           "IP Infringement Nodes",
                           "Defamatory Directives",
                           "Sensitive Political Content",
                           "NSFW Production Filter Bypass",
                           "Automated Scraper Protocols"
                         ].map((policy, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50" />
                              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{policy}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </section>

             {/* 4. PROTOCOL ACCEPTANCE */}
             <div className="p-12 md:p-20 rounded-[4rem] bg-studio/[0.03] border border-studio/20 text-center space-y-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-studio/5 via-transparent to-fuchsia-500/5" />
                <div className="relative z-10 space-y-6">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-studio/10 border border-studio/20 flex items-center justify-center text-studio">
                         <Zap className="w-6 h-6 fill-studio" />
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Confirm Protocols</h3>
                   </div>
                   <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">
                      By clicking below, you confirm your synchronization with all listed legal nodes and production protocols.
                   </p>
                </div>
                <Button 
                  onClick={() => navigate('/login')}
                  className="relative z-10 h-20 px-16 rounded-[2rem] bg-studio text-black font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white hover:scale-105 transition-all shadow-[0_30px_70px_rgba(6,182,212,0.3)]"
                >
                   ACCEPT PROTOCOLS <ArrowRight className="ml-4 w-5 h-5" />
                </Button>
             </div>

             {/* SYSTEM FOOTER */}
             <footer className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Verified Legal Hash: #ASP-8842-X</span>
                   </div>
                   <div className="w-px h-4 bg-white/5 hidden md:block" />
                   <span>Compliant with Global AI Standards</span>
                </div>
                <div className="flex items-center gap-8">
                   <a href="#" className="hover:text-studio transition-colors no-underline">Terms of Service</a>
                   <a href="#" className="hover:text-studio transition-colors no-underline">Cookie Protocol</a>
                </div>
             </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;

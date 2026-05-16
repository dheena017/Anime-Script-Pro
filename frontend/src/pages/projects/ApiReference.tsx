import { useState } from 'react';
import { 
  Terminal, 
  Zap, 
  ChevronRight, 
  Copy, 
  Check, 
  Activity, 
  ShieldCheck, 
  Database,
  Code2,
  ArrowUpRight,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NAV_NODES = [
  { id: 'introduction', label: 'Introduction', nodeId: 'NODE-A1' },
  { id: 'authentication', label: 'Authentication', nodeId: 'NODE-A2' },
  { id: 'endpoints', label: 'Endpoints', nodeId: 'NODE-A3' },
  { id: 'webhooks', label: 'Webhooks', nodeId: 'NODE-A4' },
  { id: 'errors', label: 'Errors', nodeId: 'NODE-A5' },
];

export function ApiReferencePage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const curlExample = `curl -X POST https://api.animescript.pro/v1/generations \\
  -H "Authorization: Bearer sk_test_123456789" \\
  -H "Content-Type: application/json"`;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 py-32 px-6 relative overflow-hidden">
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-studio/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* 1. HEADER PROTOCOL */}
        <div className="flex flex-col items-center text-center space-y-10">
           <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-studio/5 border border-studio/20">
              <Code2 className="w-3.5 h-3.5 text-studio" />
              <span className="text-xs font-black text-studio uppercase tracking-[0.4em]">API Protocol Terminal V4.2</span>
           </div>
           
           <div className="space-y-6">
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                API <span className="text-studio">Reference.</span>
              </h1>
              <p className="text-zinc-500 max-w-2xl mx-auto uppercase text-xs font-bold tracking-[0.2em] leading-relaxed">
                Build high-fidelity integrations with the AnimeScript Pro engine. <br />
                Real-time AI generation at your fingertips.
              </p>
           </div>

           {/* API TELEMETRY */}
           <div className="flex flex-wrap items-center justify-center gap-8 pt-4 border-t border-white/5 w-full max-w-4xl">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Global Uptime: 99.98%</span>
              </div>
              <div className="flex items-center gap-3">
                 <Activity className="w-3.5 h-3.5 text-studio" />
                 <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Avg Latency: 142ms</span>
              </div>
              <div className="flex items-center gap-3">
                 <Cpu className="w-3.5 h-3.5 text-fuchsia-500" />
                 <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Nodes Active: 842</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 2. NAVIGATION SIDEBAR */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 space-y-8">
               <div className="flex items-center gap-3 mb-6">
                  <Database className="w-5 h-5 text-zinc-600" />
                  <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Protocol Index</h3>
               </div>
               <div className="flex flex-col gap-2">
                 {NAV_NODES.map((node) => (
                   <a 
                    key={node.id} 
                    href={`#${node.id}`} 
                    className="flex items-center justify-between p-4 bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-studio/5 hover:border-studio/30 transition-all group no-underline"
                   >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-zinc-700 group-hover:text-studio transition-colors">{node.nodeId}</span>
                        <span className="text-xs font-black text-zinc-500 group-hover:text-white uppercase tracking-widest">{node.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-zinc-800 group-hover:text-studio transition-colors" />
                   </a>
                 ))}
               </div>

               {/* QUICK ACTION */}
               <Card className="bg-studio/5 border border-studio/20 p-8 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-studio fill-studio" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Developer Key</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                     Generate your production keys in the settings terminal.
                  </p>
                  <Button className="w-full h-12 bg-studio text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all">
                     DASHBOARD <ArrowUpRight className="ml-2 w-3.5 h-3.5" />
                  </Button>
               </Card>
            </div>
          </div>

          {/* 3. DOCUMENTATION MATRIX */}
          <div className="lg:col-span-9 space-y-24">
            
            {/* NODE-A1: INTRODUCTION */}
            <section id="introduction" className="space-y-10 group relative">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                 <span className="text-xs font-black text-studio uppercase tracking-[0.4em]">NODE-A1</span>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Introduction</h2>
                <p className="text-zinc-500 text-sm font-bold leading-relaxed uppercase tracking-widest max-w-3xl">
                  The AnimeScript Pro API is organized around REST. Our protocol has predictable resource-oriented URLs, accepts form-encoded request bodies, and returns JSON-encoded responses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                {[
                  { icon: Terminal, title: 'REST Protocol', sub: 'Standard production interface' },
                  { icon: Zap, title: 'Websockets', sub: 'Real-time synthesis progress' }
                ].map((item, i) => (
                  <div key={i} className="p-10 rounded-[2.5rem] bg-[#0a0a0b] border border-white/5 hover:border-studio/30 transition-all flex items-start gap-6 group/card">
                     <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-600 group-hover/card:bg-studio group-hover/card:text-black transition-all">
                        <item.icon className="w-6 h-6" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-lg font-black text-white uppercase italic">{item.title}</h4>
                        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{item.sub}</p>
                     </div>
                  </div>
                ))}
              </div>
            </section>

            {/* NODE-A2: AUTHENTICATION */}
            <section id="authentication" className="space-y-10 group relative">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-studio" />
                 <span className="text-xs font-black text-studio uppercase tracking-[0.4em]">NODE-A2</span>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Authentication</h2>
                <p className="text-zinc-500 text-sm font-bold leading-relaxed uppercase tracking-widest max-w-3xl">
                  Authenticate your API transmissions by including your secret API key in the request headers. manage keys via the secure developer hub.
                </p>
              </div>

              {/* CODE BLOCK MATRIX */}
              <div className="rounded-[3rem] bg-[#0a0a0b] border border-white/5 overflow-hidden shadow-2xl relative group/code">
                <div className="px-8 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                         <div className="w-2 h-2 rounded-full bg-red-500/50" />
                         <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                         <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                      </div>
                      <span className="text-xs font-black text-zinc-700 uppercase tracking-[0.3em]">CURL TERMINAL</span>
                   </div>
                   <button 
                    onClick={() => handleCopy('curl', curlExample)}
                    className="flex items-center gap-2 text-xs font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors"
                   >
                      {copied === 'curl' ? (
                        <>COMPLETED <Check className="w-3.5 h-3.5 text-emerald-500" /></>
                      ) : (
                        <>COPY PROTOCOL <Copy className="w-3.5 h-3.5" /></>
                      )}
                   </button>
                </div>
                <div className="p-8 relative">
                   {/* Syntax Aura */}
                   <div className="absolute inset-0 bg-studio/5 blur-3xl pointer-events-none opacity-0 group-hover/code:opacity-100 transition-opacity" />
                   <pre className="text-sm font-mono text-zinc-300 overflow-x-auto selection:bg-studio/20 relative z-10 leading-relaxed">
                      <code>
                        <span className="text-fuchsia-500">curl</span> -X <span className="text-studio">POST</span> https://api.animescript.pro/v1/generations \<br />
                        &nbsp;&nbsp;-H <span className="text-zinc-500">"Authorization: Bearer sk_test_123456789"</span> \<br />
                        &nbsp;&nbsp;-H <span className="text-zinc-500">"Content-Type: application/json"</span>
                      </code>
                   </pre>
                </div>
              </div>
            </section>

            {/* ENDPOINT SYSTEM STATUS FOOTER */}
            <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-xs font-black text-zinc-700 uppercase tracking-[0.4em]">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span>Verified API Hash: #API-8842-A</span>
                  </div>
                  <div className="w-px h-4 bg-white/5 hidden md:block" />
                  <span>Protocol: v4.2 Stable</span>
               </div>
               <div className="flex items-center gap-8">
                  <a href="#" className="hover:text-studio transition-colors no-underline">Rate Limit Policy</a>
                  <a href="#" className="hover:text-studio transition-colors no-underline">Developer Terms</a>
               </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiReferencePage;

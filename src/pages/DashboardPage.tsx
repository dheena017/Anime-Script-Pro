import React from 'react';
import { 
  Rocket, 
  ArrowRight, 
  FileText, 
  Users, 
  Layout, 
  Library,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#050505] text-white p-8 font-sans selection:bg-red-500/30">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Studio Dashboard</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Control Room</h1>
            <p className="text-zinc-500 text-sm max-w-2xl">
              Track script output, jump across tools, and keep your production flow focused from one place.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/studio/script')}
            className="bg-red-600 hover:bg-red-500 text-white rounded-lg px-6 h-12 font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          >
            <Sparkles className="w-4 h-4" />
            Open Generator
          </Button>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-4">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Total Scripts</p>
            <p className="text-4xl font-black tracking-tighter">0</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-4">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Created This Week</p>
            <p className="text-4xl font-black tracking-tighter">0</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-4">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Latest Save</p>
            <p className="text-sm font-medium text-zinc-500">No saved scripts yet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Area (8/12) */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Quick Actions Title */}
            <div className="flex items-center gap-3">
              <Rocket className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-black tracking-tight uppercase">Quick Actions</h2>
            </div>

            {/* Quick Actions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Start Script', desc: 'Open the script workspace and generate a new episode draft.', icon: FileText, path: '/studio/script' },
                { title: 'Build Cast', desc: 'Generate and refine character details for your next production.', icon: Users, path: '/studio/cast' },
                { title: 'Open Templates', desc: 'Use quick templates to jump-start ideas and script structure.', icon: Layout, path: '/studio/template' },
              ].map((action) => (
                <div 
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 space-y-6 group hover:border-red-500/20 transition-all cursor-pointer relative overflow-hidden"
                >
                  <action.icon className="w-8 h-8 text-red-500/40 group-hover:text-red-500 transition-colors" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                      {action.desc}
                    </p>
                  </div>
                  <ChevronRight className="absolute top-6 right-6 w-4 h-4 text-zinc-800 group-hover:text-red-500 transition-colors" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Production Health */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Production Health</h3>
                <div className="space-y-4">
                   <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        <span className="text-zinc-100 font-bold block mb-1">Keep episodes consistent by setting scene count and runtime before generating.</span>
                        Tip: Save scripts frequently so they show up in Library and the dashboard metrics stay accurate.
                      </p>
                   </div>
                </div>
              </div>

              {/* Studio Pipeline */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Studio Pipeline</h3>
                <div className="space-y-3">
                  {[
                    '1. Concept',
                    '2. Cast',
                    '3. Storyboard',
                    '4. Export'
                  ].map((step) => (
                    <div key={step} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all cursor-pointer">
                      <span className="text-xs font-bold text-zinc-300">{step}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar (3/12) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-6 h-full">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Quick Jump</p>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">Move between studio tools without leaving the dashboard.</p>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Script Workspace', icon: FileText, path: '/studio/script' },
                  { label: 'Cast Builder', icon: Users, path: '/studio/cast' },
                  { label: 'Series Planner', icon: Library, path: '/studio/series' },
                  { label: 'Storyboard View', icon: Layout, path: '/studio/storyboard' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="w-full h-11 flex items-center justify-between px-4 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-500 transition-colors" />
                      {item.label}
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-800" />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="p-4 rounded-lg bg-black border border-white/5">
                   <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">Total</p>
                   <p className="text-xl font-black">0</p>
                </div>
                <div className="p-4 rounded-lg bg-black border border-white/5">
                   <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">This Week</p>
                   <p className="text-xl font-black text-red-500">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2 leading-none">Footer Bar</p>
              <h3 className="text-xl font-black tracking-tight text-white mb-1">Ready For Final Delivery?</h3>
              <p className="text-xs text-zinc-500 font-medium">Review storyboard and export your production package in one step.</p>
           </div>
           <div className="flex items-center gap-4">
              <Button variant="outline" className="h-11 px-8 rounded-lg border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-bold flex items-center gap-2">
                 <Layout className="w-4 h-4" /> Storyboard
              </Button>
              <Button className="h-11 px-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-2 border border-white/5">
                 <ArrowRight className="w-4 h-4 text-red-500" /> Export <ArrowRight className="w-4 h-4 ml-1 opacity-40" />
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
}

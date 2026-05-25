import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Cpu, 
  Send, 
  ChevronLeft,
  Settings,
  Flame,
  Bomb,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';

export default function PopNotificationShowcase() {
  const { showNotification } = useApp();
  const navigate = useNavigate();

  const [customMsg, setCustomMsg] = useState('Production sequence fully compiled & ready for staging.');
  const [customType, setCustomType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [intensity, setIntensity] = useState<'low' | 'high'>('high');

  const triggerToast = (type: 'success' | 'error' | 'warning' | 'info', msg: string) => {
    showNotification(msg, type);
  };

  const samplePopups = [
    {
      title: "Success Node",
      type: "success" as const,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      shadow: "shadow-emerald-950/20",
      btnClass: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20",
      description: "Trigger a success toast indicating successfully completed tasks or positive outcomes.",
      defaultMsg: "Compilation successful. 18 acts synchronized with casting module."
    },
    {
      title: "Error Node",
      type: "error" as const,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      shadow: "shadow-red-950/20",
      btnClass: "bg-red-600 hover:bg-red-500 text-white shadow-red-500/20",
      description: "Trigger an error alert for system exceptions, pipeline blockages, or failure states.",
      defaultMsg: "Engine critical warning: Aetheria core sync failed on scene 14."
    },
    {
      title: "Warning Node",
      type: "warning" as const,
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      shadow: "shadow-amber-950/20",
      btnClass: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20",
      description: "Trigger a warning indicating resource constraints, unsaved work, or network timeouts.",
      defaultMsg: "Tension delta is highly unstable. Resolve connections in the Relationship matrix."
    },
    {
      title: "Info Node",
      type: "info" as const,
      icon: Info,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
      shadow: "shadow-cyan-950/20",
      btnClass: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20",
      description: "Trigger informational dialogs, system updates, latency telemetry, or routine tips.",
      defaultMsg: "AI context initialized. Staging models: Gemini-3.5-Flash (Ready)."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background light glow effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Breadcrumb / Nav */}
      <div className="flex items-center justify-between relative z-10 pt-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-white transition-all group rounded-xl hover:bg-white/5"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Diag Mode: Active</span>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] uppercase tracking-[0.25em] text-cyan-400 font-black">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Pop Systems Playground
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
          Toast <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400">Showcase</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium max-w-xl leading-relaxed">
          Test and preview the beautiful framer-motion slide-in-from-right pop notifications. Verify responsiveness, HSL-themed overlays, and physical dismiss transitions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: Preset triggers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {samplePopups.map((pop, idx) => (
              <motion.div
                key={pop.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`p-6 bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2rem] flex flex-col justify-between h-full hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300 group`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${pop.bg} flex items-center justify-center`}>
                        <pop.icon className={`w-5 h-5 ${pop.color}`} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-shadow-glow transition-all">
                        {pop.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed min-h-[40px]">
                      {pop.description}
                    </p>
                  </div>
                  <div className="pt-6">
                    <Button 
                      onClick={() => triggerToast(pop.type, pop.defaultMsg)}
                      className={`w-full rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 shadow-lg ${pop.btnClass}`}
                    >
                      <Bell className="w-3.5 h-3.5 mr-2" /> Launch Pop Alert
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Interactive custom transmitter */}
          <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2rem] space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" /> Custom Signal Transmitter
              </h3>
              <div className="h-px bg-zinc-800 flex-1 mx-6 hidden sm:block" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">RF Transmit v2.1</span>
            </div>

            <div className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Select Signal Level</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['success', 'error', 'warning', 'info'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCustomType(t)}
                      className={`p-4 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${
                        customType === t 
                          ? t === 'success' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                            : t === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-400'
                            : t === 'warning' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                            : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                          : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">Signal Message Body</Label>
                <div className="relative">
                  <input
                    type="text"
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-0 placeholder-zinc-700 font-medium"
                    placeholder="Enter custom telemetry details..."
                  />
                  <button 
                    onClick={() => triggerToast(customType, customMsg)}
                    className="absolute right-2 top-2 p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors border border-cyan-500/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Information & telemetry */}
        <div className="space-y-6">
          <Card className="p-8 bg-gradient-to-b from-cyan-500/5 to-transparent border border-cyan-500/10 rounded-[2.5rem] space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Buttery Pop Animations</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                The revamped notification center handles asynchronous popups safely via framer-motion's <code className="text-cyan-400 font-bold font-mono">AnimatePresence</code>. 
              </p>
              <div className="h-[1px] bg-white/5 my-2" />
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Spring physics properties (stiffness 380, damping 30) guarantee instantaneous responsiveness on execution.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Network Telemetry</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-500 uppercase tracking-widest">Transmitter:</span>
                <span className="font-black text-white font-mono">UHF 840MHz</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-500 uppercase tracking-widest">Format:</span>
                <span className="font-black text-white font-mono">JSON ENCODED</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-500 uppercase tracking-widest">Target Vault:</span>
                <span className="font-black text-cyan-400 font-mono">AppProvider.tsx</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

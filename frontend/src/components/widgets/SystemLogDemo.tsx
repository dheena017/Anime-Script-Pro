import { useState } from 'react';
import { logsApi } from '@/services/api/logs';
import { AlertTriangle, Terminal, Save } from 'lucide-react';

export const SystemLogDemo = () => {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const triggerKernelPanic = async () => {
    setIsSaving(true);
    try {
      // 1. Logic: Prepare the failure data
      const source = "[Kernel]";
      const message = "CRITICAL: Memory heap corruption detected at 0x004F32. System halted.";
      const level = "CRITICAL";

      // 2. The Persistence Call: Save to SQLite via FastAPI
      const savedLog = await logsApi.saveLog(source, message, level);
      
      setLastSaved(`Log ID #${savedLog.id} persisted to database at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error("Failed to save log:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-red-900/30 shadow-2xl max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6 text-red-500">
        <AlertTriangle size={24} />
        <h2 className="text-xl font-bold font-mono uppercase tracking-tighter">Emergency Protocols</h2>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        Clicking the button below will simulate a system-wide failure and permanently record the incident in the 
        <code className="text-blue-400 mx-1">SystemLog</code> database table.
      </p>

      <button
        onClick={triggerKernelPanic}
        disabled={isSaving}
        className="w-full group relative overflow-hidden bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-black py-4 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-red-900/40"
      >
        <Terminal size={20} className="group-hover:animate-pulse" />
        {isSaving ? "PERSISTING ERROR..." : "TRIGGER KERNEL PANIC"}
      </button>

      {lastSaved && (
        <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-900/30 rounded-xl flex items-start gap-3">
          <Save size={16} className="text-emerald-500 mt-1" />
          <p className="text-xs text-emerald-400 font-mono leading-tight">
            {lastSaved}
          </p>
        </div>
      )}
    </div>
  );
};




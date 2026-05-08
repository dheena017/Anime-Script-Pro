import React, { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';

export const TerminalOutputViewer: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Initializing core services...', '[SYSTEM] Connection established.']);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulated Stream Integration
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Keep-alive ping from AI Core...`].slice(-100));
    }, 8080);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] border border-white/10 rounded-xl overflow-hidden font-mono text-xs">
      <div className="p-2 border-b border-white/10 bg-white/5 flex items-center gap-2 text-white/40">
        <Terminal className="w-4 h-4" /> root@anime-studio-core:~
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={log.includes('error') ? 'text-red-400' : 'text-emerald-400/80'}>
            {log}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

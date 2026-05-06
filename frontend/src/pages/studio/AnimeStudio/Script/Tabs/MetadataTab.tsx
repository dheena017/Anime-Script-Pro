import React from 'react';
import { Database, Clock, Hash, Tag, Globe, Cpu } from 'lucide-react';

interface MetadataTabProps {
  session: string;
  episode: string;
  prompt: string;
  tone: string;
  audience: string;
  contentType: string;
  selectedModel: string;
}

export const MetadataTab: React.FC<MetadataTabProps> = ({
  session,
  episode,
  prompt,
  tone,
  audience,
  contentType,
  selectedModel,
}) => {
  const fields = [
    { label: 'Content Type', value: contentType, icon: Tag },
    { label: 'Session', value: `S${session}`, icon: Hash },
    { label: 'Episode', value: `E${episode}`, icon: Hash },
    { label: 'Tone', value: tone || 'N/A', icon: Globe },
    { label: 'Audience', value: audience || 'N/A', icon: Globe },
    { label: 'AI Model', value: selectedModel || 'Default', icon: Cpu },
    { label: 'Generated', value: new Date().toLocaleDateString(), icon: Clock },
  ];

  return (
    <div className="py-12 space-y-12">
      <div className="flex items-center gap-6 border-b border-white/5 pb-10">
        <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Database className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Production Metadata</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Episode parameters and synthesis diagnostics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {fields.map((field, i) => (
          <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all group">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <field.icon className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{field.label}</p>
              <p className="text-sm font-black text-white uppercase tracking-wide truncate mt-0.5">{field.value}</p>
            </div>
          </div>
        ))}

        {/* Prompt field — full width */}
        <div className="md:col-span-2 p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Core Production Prompt</p>
          <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">{prompt || 'No prompt set.'}</p>
        </div>
      </div>
    </div>
  );
};




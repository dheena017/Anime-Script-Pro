import { 
  ExternalLink, 
  Sparkles, 
  Code, 
  Search, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EXTERNAL_MODELS = [
  { 
    name: "Chat GPT", 
    description: "Versatile text generation & reasoning.", 
    url: "https://chatgpt.com", 
    category: "General",
    color: "emerald"
  },
  { 
    name: "Gemini", 
    description: "Google's ultra-fast multimodal intelligence.", 
    url: "https://gemini.google.com", 
    category: "General",
    color: "blue"
  },
  { 
    name: "Claude AI", 
    description: "Advanced reasoning & safety-first generation.", 
    url: "https://claude.ai", 
    category: "General",
    color: "amber"
  },
  { 
    name: "DeepSeek AI", 
    description: "High-precision code & logic synthesis.", 
    url: "https://deepseek.com", 
    category: "Coding",
    color: "cyan"
  },
  { 
    name: "Mistral AI", 
    description: "Efficient open-weight conversational models.", 
    url: "https://mistral.ai", 
    category: "General",
    color: "orange"
  },
  { 
    name: "Perplexity AI", 
    description: "Search-augmented knowledge retrieval.", 
    url: "https://perplexity.ai", 
    category: "Search",
    color: "teal"
  },
  { 
    name: "Meta Llama", 
    description: "Open source powerhouse for diverse tasks.", 
    url: "https://llama.meta.com", 
    category: "General",
    color: "indigo"
  },
  { 
    name: "Phind", 
    description: "Search engine for developers & engineers.", 
    url: "https://phind.com", 
    category: "Search",
    color: "sky"
  },
  { 
    name: "Codeium", 
    description: "Lightning-fast AI code completion.", 
    url: "https://codeium.com", 
    category: "Coding",
    color: "green"
  },
  { 
    name: "Poe", 
    description: "Quora's multi-model aggregator platform.", 
    url: "https://poe.com", 
    category: "Platform",
    color: "purple"
  },
  { 
    name: "Copilot", 
    description: "Microsoft's premier pair programming AI.", 
    url: "https://github.com/features/copilot", 
    category: "Coding",
    color: "slate"
  },
  { 
    name: "BlackBox AI", 
    description: "Real-time code generation & suggestions.", 
    url: "https://blackbox.ai", 
    category: "Coding",
    color: "fuchsia"
  },
  { 
    name: "Cohere", 
    description: "Enterprise-grade natural language processing.", 
    url: "https://cohere.com", 
    category: "General",
    color: "rose"
  },
  { 
    name: "Inflection Pi", 
    description: "Personal AI focused on natural conversation.", 
    url: "https://pi.ai", 
    category: "Personal",
    color: "lime"
  },
  { 
    name: "Hugging Face", 
    description: "The central hub for open-source AI models.", 
    url: "https://huggingface.co", 
    category: "Platform",
    color: "yellow"
  },
  { 
    name: "You", 
    description: "AI-powered search and productivity suite.", 
    url: "https://you.com", 
    category: "Search",
    color: "violet"
  },
  { 
    name: "Julius AI", 
    description: "Specialized AI for data analysis & math.", 
    url: "https://julius.ai", 
    category: "Specialized",
    color: "red"
  },
  { 
    name: "Cody", 
    description: "Sourcegraph's context-aware code assistant.", 
    url: "https://sourcegraph.com/cody", 
    category: "Coding",
    color: "blue"
  },
  { 
    name: "Worm GPT", 
    description: "Unfiltered text generation experiment.", 
    url: "https://wormgpt.ai", 
    category: "Specialized",
    color: "zinc"
  },
  { 
    name: "AI21 Jamba", 
    description: "Innovative Mamba-based hybrid architecture.", 
    url: "https://ai21.com", 
    category: "General",
    color: "orange"
  },
  { 
    name: "1min AI", 
    description: "Rapid-fire conversational intelligence.", 
    url: "https://1min.ai", 
    category: "Specialized",
    color: "pink"
  },
  { 
    name: "Duck AI", 
    description: "Privacy-focused AI chat by DuckDuckGo.", 
    url: "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat", 
    category: "Platform",
    color: "orange"
  },
];

const categoryIcons: Record<string, any> = {
  "General": Sparkles,
  "Coding": Code,
  "Search": Search,
  "Platform": Globe,
  "Personal": ShieldCheck,
  "Specialized": Zap
};

const colorClasses: Record<string, string> = {
  emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40",
  blue: "text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40",
  amber: "text-amber-400 border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40",
  cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/40",
  orange: "text-orange-400 border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40",
  teal: "text-teal-400 border-teal-500/20 bg-teal-500/5 hover:border-teal-500/40",
  indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/40",
  sky: "text-sky-400 border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40",
  green: "text-green-400 border-green-500/20 bg-green-500/5 hover:border-green-500/40",
  purple: "text-purple-400 border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40",
  slate: "text-slate-400 border-slate-500/20 bg-slate-500/5 hover:border-slate-500/40",
  fuchsia: "text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5 hover:border-fuchsia-500/40",
  rose: "text-rose-400 border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40",
  lime: "text-lime-400 border-lime-500/20 bg-lime-500/5 hover:border-lime-500/40",
  yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40",
  violet: "text-violet-400 border-violet-500/20 bg-violet-500/5 hover:border-violet-500/40",
  red: "text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/40",
  zinc: "text-zinc-400 border-zinc-500/20 bg-zinc-500/5 hover:border-zinc-500/40",
  pink: "text-pink-400 border-pink-500/20 bg-pink-500/5 hover:border-pink-500/40",
};

export function ExternalModelNetwork() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">Discovery Network</h3>
        </div>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest pl-10">
          A curated bypass to external high-performance free AI models for production assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {EXTERNAL_MODELS.map((model) => {
          const CategoryIcon = categoryIcons[model.category] || Sparkles;
          const colorClass = colorClasses[model.color] || "text-zinc-400 border-zinc-500/20 bg-zinc-500/5";
          
          return (
            <a 
              key={model.name}
              href={model.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 flex flex-col gap-3 overflow-hidden hover:scale-[1.02] active:scale-95",
                colorClass
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-black/40 rounded-lg border border-white/5">
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                    {model.category}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-inherit transition-colors">
                  {model.name}
                </h4>
                <p className="text-[10px] text-zinc-400 font-bold leading-relaxed line-clamp-2">
                  {model.description}
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CategoryIcon className="w-16 h-16" />
              </div>
            </a>
          );
        })}
      </div>

      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20">
            <Cpu className="w-6 h-6 text-fuchsia-400" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Missing a Node?</h4>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter mt-1">Submit new free AI models to the discovery matrix via the feedback hub.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-zinc-700 transition-all whitespace-nowrap">
          Open Feedback Hub
        </button>
      </div>
    </div>
  );
}




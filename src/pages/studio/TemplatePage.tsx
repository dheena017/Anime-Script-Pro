import React, { useState } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollText, Sparkles, Heart, Sword, Globe, Zap, Ghost, Brain, ArrowRight, Video, Flame, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGenerator } from '@/contexts/GeneratorContext';
import { useNavigate } from 'react-router-dom';

const QUICK_TEMPLATES = [
  { 
    id: 'shonen', 
    label: 'Shonen Battle', 
    icon: Sword, 
    prompt: 'A high-stakes tournament where fighters use elemental powers to determine the next emperor.',
    color: 'text-orange-500',
    border: 'border-orange-500/50',
    bg: 'bg-orange-500/10',
    shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    description: 'High energy, intense pacing, and tournament arcs.'
  },
  { 
    id: 'isekai', 
    label: 'Dark Isekai', 
    icon: Globe, 
    prompt: 'A programmer is reborn in a cruel fantasy world as a minor villain destined to be defeated.',
    color: 'text-purple-500',
    border: 'border-purple-500/50',
    bg: 'bg-purple-500/10',
    shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    description: 'Reincarnation with a dark and gritty twist.'
  },
  { 
    id: 'cyberpunk', 
    label: 'Cyberpunk', 
    icon: Zap, 
    prompt: 'A street racer in a neon-lit megacity uncovering a corporate conspiracy involving digital souls.',
    color: 'text-cyan-500',
    border: 'border-cyan-500/50',
    bg: 'bg-cyan-500/10',
    shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    description: 'Dystopian futures, neon lights, and hackers.'
  },
  { 
    id: 'slice', 
    label: 'Slice of Life', 
    icon: Ghost, 
    prompt: 'A group of high school students starting an occult research club in a genuinely haunted school.',
    color: 'text-emerald-500',
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-500/10',
    shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    description: 'Supernatural events mingling with daily life.'
  },
  { 
    id: 'psych', 
    label: 'Psychological', 
    icon: Brain, 
    prompt: 'A detective who can enter the dreams of suspects to find the truth behind a series of impossible crimes.',
    color: 'text-blue-500',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/10',
    shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    description: 'Mind-bending mysteries and psychological thrills.'
  },
  { 
    id: 'mecha', 
    label: 'Mecha', 
    icon: Flame, 
    prompt: 'A disgraced pilot is forced to pilot an experimental, unstable mech to protect the last human colony.',
    color: 'text-red-500',
    border: 'border-red-500/50',
    bg: 'bg-red-500/10',
    shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    description: 'Giant robots and interstellar warfare.'
  },
];

const templateMarkdown = `
# Professional Anime Recap Template

Use this structure to ensure high retention and engagement on YouTube.

## 1. The Hook (0:00 - 0:15)
- **Goal:** Stop the scroll.
- **Visual:** Most intense action or biggest mystery.
- **Audio:** High-impact SFX, immediate BGM start.

## 2. The Setup (0:15 - 1:00)
- **Goal:** Establish context and stakes.
- **Visual:** Character introductions, world-building shots.
- **Audio:** Narrative-driven BGM, clear voiceover.

## 3. The Conflict (1:00 - 3:30)
- **Goal:** Build tension and momentum.
- **Visual:** Choreographed action, emotional micro-expressions.
- **Audio:** Layered SFX (clashes, magic, environment).

## 4. The Climax (3:30 - 4:30)
- **Goal:** Deliver the payoff.
- **Visual:** Dynamic camera angles (Dutch tilts, tracking shots).
- **Audio:** Peak BGM intensity, resonant SFX.

## 5. The Outro (4:30 - 5:00)
- **Goal:** Drive action (Subscribe/Next Video).
- **Visual:** Cliffhanger shot, end cards.
- **Audio:** Fade out BGM, final impactful SFX.

---

### Standard Script Table Format
| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues |
| :--- | :--- | :--- | :--- |
| [Name] | [Spoken Lines] | [Camera + Lighting + Action] | [BGM + SFX Layers] |
`;

export function TemplatePage() {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'structure'>('prompts');
  const { setPrompt, setContentType } = useGenerator();
  const navigate = useNavigate();

  const handleUsePrompt = (prompt: string) => {
    setPrompt(prompt);
    // Determine context path, assuming we are inside the studio which has the specific type in the URL
    // Actually we can just navigate up/to the script route
    navigate('..', { relative: 'path' }); // goes back to /anime from /anime/template 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black uppercase tracking-[0.15em] flex items-center gap-3 text-cyan-50 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
          <ScrollText className="w-6 h-6 text-cyan-400" />
          Template Library
        </h2>
        <p className="text-cyan-500/60 font-bold uppercase tracking-widest text-xs">
          Pre-configured prompts and script structures for lightning fast creation.
        </p>
      </div>

      <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-4">
        <button
          onClick={() => setActiveTab('prompts')}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
            activeTab === 'prompts' 
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
              : "border-transparent text-zinc-500 hover:text-cyan-200 hover:bg-white/[0.02]"
          )}
        >
          <Code className="w-3.5 h-3.5 inline-block mr-2" />
          Quick Prompts
        </button>
        <button
          onClick={() => setActiveTab('structure')}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
            activeTab === 'structure' 
              ? "bg-orange-500/10 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]" 
              : "border-transparent text-zinc-500 hover:text-orange-200 hover:bg-white/[0.02]"
          )}
        >
          <Video className="w-3.5 h-3.5 inline-block mr-2" />
          Script Structure
        </button>
      </div>

      {activeTab === 'prompts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {QUICK_TEMPLATES.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={cn("h-full bg-gradient-to-br from-[#111318] to-[#0a0b0e] border transition-all overflow-hidden group flex flex-col hover:scale-[1.02]", template.border, template.shadow)}>
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                <CardHeader className="p-5 relative z-10 pb-0">
                  <div className="flex items-start justify-between">
                    <div className={cn("p-2.5 rounded-xl border flex items-center justify-center shrink-0 mb-4 bg-opacity-20", template.bg, template.border)}>
                      <template.icon className={cn("w-5 h-5", template.color)} />
                    </div>
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                    {template.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-3 flex flex-col justify-between flex-1 relative z-10">
                  <div className="space-y-3">
                    <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 line-clamp-2">
                      {template.description}
                    </CardDescription>
                    <div className="p-3 bg-[#0a0a0a]/80 backdrop-blur-md rounded-lg border border-zinc-800/80 shadow-inner">
                      <p className="text-xs text-zinc-400 font-medium italic line-clamp-3 leading-relaxed">
                        "{template.prompt}"
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 mt-auto">
                    <Button 
                      className={cn(
                        "w-full bg-transparent border hover:bg-opacity-20 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                        template.border,
                        template.color,
                        template.bg.replace('/10', '/30') // Make hover background slightly more opaque
                      )}
                      onClick={() => handleUsePrompt(template.prompt)}
                    >
                      Use Template <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'structure' && (
        <Card className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border-orange-500/20 overflow-hidden shadow-[0_0_25px_rgba(249,115,22,0.1)] relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0" />
          <div className="p-4 border-b border-orange-500/20 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-orange-500 shadow-sm shadow-orange-500/20 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/30">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Industry Standard Structure</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-300 border border-transparent",
                  isLiked ? "text-orange-500 bg-orange-500/10 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]" : "text-zinc-600 hover:text-orange-400 hover:bg-zinc-800/50"
                )}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[600px] w-full p-6 relative z-10 bg-[#050505]/50">
            <div className="prose prose-invert prose-orange max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-h1:text-orange-500 prose-h2:text-orange-400/80 prose-a:text-cyan-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{templateMarkdown}</ReactMarkdown>
            </div>
          </ScrollArea>
        </Card>
      )}
    </motion.div>
  );
}

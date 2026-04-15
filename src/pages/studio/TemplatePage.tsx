import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollText, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-red-500" />
          Script Template
        </h2>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center gap-2 text-red-500">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Industry Standard Structure</span>
        </div>
        <ScrollArea className="h-[600px] w-full p-6">
          <div className="prose prose-invert prose-red max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{templateMarkdown}</ReactMarkdown>
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

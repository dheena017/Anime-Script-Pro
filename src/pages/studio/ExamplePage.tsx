import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const exampleScript = `
# Example: Whispers of the Moonlight - Episode 1

| Section | Voiceover Narration | Visual/Scene Description | Sound Effect/BGM Cues |
| :--- | :--- | :--- | :--- |
| **Hook** | Yuna: (Whispering) “It’s so quiet tonight… almost too quiet.” | **Extreme Close-up:** Yuna’s eyes reflecting the full moon. The camera pulls back to reveal her on a rooftop at night. | Eerie, low-frequency hum. Wind whistling softly through the rails. |
| **Intro** | Riku: “Quiet isn’t always a good thing, you know. Shadow storms have a habit of showing up when least expected.” | **Medium Shot:** Riku leaning against the rail, arms crossed. A Dutch tilt emphasizes the growing tension. | Melancholic piano melody begins, building slowly in the background. |
| **Rising Action** | Yuna: “You really think something will happen?” <br>Riku: “When the moon glows like that… yeah. Something’s lurking.” | **Tracking Shot:** A subtle shadow moves in the corner, unnoticed by Yuna. It coils like smoke, stretching towards the moonlight. | Sound of swirling mist and a sudden sharp violin sting. |
| **Climax** | Shadow Entity: “Yuna… come. Your power is needed… or all will be swallowed.” <br>Yuna: “Then I guess… we fight.” | **Wide Shot:** The Shadow Entity manifests fully, a swirling figure with glowing blue eyes. Yuna's hands start to glow softly. | A sudden orchestral swell. High-pitched shimmer SFX as Yuna's power awakens. |
| **Conclusion** | Riku: “Finally, the fun begins.” | **Low Angle Shot:** Yuna and Riku standing together against the howling wind. The moonlight intensifies as they face the unknown. | Powerful orchestral crescendo. Fade to black with a lingering bass note. |

---

### Notes for further development:
- **Genre:** Supernatural School-Life / Action.
- **Themes:** Friendship, Awakening Powers, Hidden Destiny.
- **Dialogue Style:** Balances suspense with character personality, optimized for voice acting.
- **Visual Focus:** Emphasizes lighting (moonlight vs. shadows) and dynamic camera angles.
`;

export function ExamplePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Play className="w-5 h-5 text-red-500" />
          Example Script
        </h2>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center gap-2 text-red-500">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Reference Masterpiece</span>
        </div>
        <ScrollArea className="h-[600px] w-full p-6">
          <div className="prose prose-invert prose-red max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{exampleScript}</ReactMarkdown>
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

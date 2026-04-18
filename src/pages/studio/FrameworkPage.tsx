import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LayoutGrid, Sparkles, Wand2, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const frameworkMarkdown = `
# Scene-by-Scene Production Framework

A structured, manageable framework to ensure each part of your anime is cinematic, emotionally engaging, and visually distinct.

## Step 1: Scene Planning
- **Identify Setting & Time:** Rooftop under a full moon, dimly lit classrooms, bustling festival evening.
- **Determine Characters:** Focus on development (e.g., Yuna's awakening, Riku's support).
- **Define Mood & Tone:** Suspenseful, comedic relief, romantic tension, or action-packed.
- **Outcome per Scene:** Each scene must move the story forward (reveal a secret, introduce conflict, or show growth).

## Step 2: Scene Creation (AI-Assisted)
Structure each scene as follows:
1. **Title of Scene:** Inspirational or thematic.
2. **Setting/Time:** Brief, evocative details to help AI visualize.
3. **Characters:** Names, moods, actions.
4. **Action & Dialogue:** Stepwise depiction of movement, reactions, and exchanges.
5. **Inner Thoughts/Power Effects:** Description of unseen energy, magic, or psychological state.
6. **Closing Frame/Cliffhanger:** The hook for the next scene.

### Example: Moonlit Awakening
- **Setting:** Rooftop, moonlight intensifies.
- **Action:** Yuna's hands glow brighter as a shadow wave approaches.
- **Ending:** The screen dims, hinting at an action-packed confrontation.

## Step 3: Scene-by-Scene Iteration
- **Scene 3:** Battle choreography (AI describes movements like a storyboard).
- **Scene 4:** Post-battle reflections, emotional dialogue, foreshadowing.
- **Scene 5:** Introduce lore or antagonist’s plan subtly.

## Step 4: Visual & Audio AI Integration
Generate anime-style references for:
- Character expressions, clothing, and stance.
- Backgrounds and lighting.
- Magical effects or supernatural phenomena.
- Enhance dialogue pacing and sound cues (wind, aura hum, footsteps).

## Step 5: Continuous Loop
- **Review:** Check for continuity and narrative flow.
- **Adjust:** Ensure character consistency in dialogue.
- **Layer:** Add suspense, humor, or romance as necessary.
- **Repeat:** Continue until the episode or arc is complete.
`;

export function FrameworkPage() {
  const [isLiked, setIsLiked] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-red-500" />
          Production Framework
        </h2>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-red-500">
              <Wand2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Scene-by-Scene Methodology</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 rounded-full transition-all duration-300",
                isLiked ? "text-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "text-zinc-600 hover:text-red-400 hover:bg-zinc-800"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[600px] w-full p-6">
          <div className="prose prose-invert prose-red max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{frameworkMarkdown}</ReactMarkdown>
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-2 text-cyan-50 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <LayoutGrid className="w-6 h-6 text-cyan-400" />
          Production Framework
        </h2>
      </div>

      <Card className="bg-[#050505]/50 border border-cyan-500/10 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[700px]">
        <div className="p-4 border-b border-cyan-500/10 bg-[#0a0a0a]/80 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-500 shadow-sm shadow-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/30">
              <Wand2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Scene-by-Scene Methodology</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-300 border border-transparent",
                isLiked ? "text-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-zinc-600 hover:text-cyan-400 hover:bg-zinc-800/50"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </Button>
          </div>
          
          <Button 
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-widest uppercase text-[10px]"
            size="sm"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Generate
          </Button>
        </div>
        <div className="w-full p-8 bg-[#050505]/50">
          <div className="prose prose-invert prose-cyan max-w-none prose-h1:text-cyan-400 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{frameworkMarkdown}</ReactMarkdown>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

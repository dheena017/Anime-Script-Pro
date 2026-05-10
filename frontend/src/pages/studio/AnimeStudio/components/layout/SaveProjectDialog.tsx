import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { Save, FolderHeart } from 'lucide-react';
import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

export function SaveProjectDialog() {
  const { prompt, isSaving, currentScriptId } = useGeneratorState();
  const { setPrompt, syncCore } = useGeneratorDispatch();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('New Anime Project');
  const [details, setDetails] = useState('');

  // Initialize fields when opening or prompt changes
  useEffect(() => {
    if (open) {
      if (prompt) {
        setProjectName(prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''));
        setDetails(prompt);
      } else {
        setProjectName('New Anime Project');
        setDetails('');
      }
    }
  }, [open, prompt]);

  const handleSave = async () => {
    if (details !== prompt) {
      setPrompt(details);
    }
    
    await syncCore();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button 
          variant="outline" 
          className="bg-cyan-500/10 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/20 hover:text-cyan-400 font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
        >
          <Save className={cn("w-3.5 h-3.5 mr-2 group-hover:scale-110 transition-transform", isSaving && "animate-pulse")} />
          {isSaving ? "SAVING..." : "SAVE PROJECT"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <FolderHeart className="w-4 h-4 text-cyan-500" />
            Save Production Data
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 mt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Project Name
            </label>
            <Input 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 font-bold h-10 rounded-xl"
              placeholder="E.g., Neon Genesis Project"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Core Concept / Details
            </label>
            <TextareaAutosize 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full min-h-[80px] bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 rounded-xl text-xs p-3 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="Describe the production..."
            />
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 mt-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500 leading-relaxed text-center">
              This will sync all data across Creative Engine, World Builder, Cast, Series, Script, Storyboard, Assets, SEO, and Screening Room.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)}
            className="text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            {isSaving ? "Saving..." : "Confirm Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

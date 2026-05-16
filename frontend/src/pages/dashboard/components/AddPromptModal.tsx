import { Command } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPrompt: { label: string; text: string };
  setNewPrompt: (prompt: { label: string; text: string }) => void;
  onAdd: () => void;
}

export function AddPromptModal({ open, onOpenChange, newPrompt, setNewPrompt, onAdd }: AddPromptModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0a0b] border-white/5 rounded-[3rem] p-12 max-w-xl text-white shadow-3xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <Command className="w-8 h-8 text-studio" /> Forge Blueprint
          </DialogTitle>
          <DialogDescription className="text-xs font-black text-zinc-600 uppercase tracking-widest">Initialize a reusable project template.</DialogDescription>
        </DialogHeader>
        <div className="space-y-8 py-10">
          <div className="space-y-3">
            <Label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Protocol Name</Label>
            <Input
              value={newPrompt.label}
              onChange={(e) => setNewPrompt({ ...newPrompt, label: e.target.value })}
              className="bg-zinc-900 border-zinc-800 rounded-2xl h-16 text-white font-bold px-6"
              placeholder="CYBERPUNK_NOIR_01"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Directives (AI Text)</Label>
            <textarea
              value={newPrompt.text}
              onChange={(e) => setNewPrompt({ ...newPrompt, text: e.target.value })}
              className="w-full bg-zinc-900 border-zinc-800 rounded-[2rem] p-8 text-white font-medium text-sm min-h-[180px] focus:outline-none focus:border-studio/50 transition-all"
              placeholder="Enter production directives..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAdd} className="w-full h-20 bg-studio text-white font-black uppercase tracking-[0.4em] text-xs rounded-[2rem] shadow-2xl hover:bg-studio/80">
            Authorize Protocol
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

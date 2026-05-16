import { Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddDNAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDNA: { name: string; prompt: string; seed: number };
  setNewDNA: (dna: { name: string; prompt: string; seed: number }) => void;
  onAdd: () => void;
}

export function AddDNAModal({ open, onOpenChange, newDNA, setNewDNA, onAdd }: AddDNAModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0a0b] border-white/5 rounded-[4rem] p-12 max-w-2xl text-white shadow-3xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <Users className="w-8 h-8 text-fuchsia-500" /> DNA Sequencing
          </DialogTitle>
          <DialogDescription className="text-xs font-black text-zinc-600 uppercase tracking-widest">Establish visual consistency for recurring cast members.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-12 py-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Subject ID</Label>
              <Input
                value={newDNA.name}
                onChange={(e) => setNewDNA({ ...newDNA, name: e.target.value })}
                className="bg-zinc-900 border-zinc-800 rounded-2xl h-16 text-white font-bold px-6"
                placeholder="PROTAGONIST_ALPHA"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black text-zinc-500 uppercase tracking-widest">AI Seed</Label>
              <Input
                type="number"
                value={newDNA.seed}
                onChange={(e) => setNewDNA({ ...newDNA, seed: parseInt(e.target.value) })}
                className="bg-zinc-900 border-zinc-800 rounded-2xl h-16 text-white font-bold px-6"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Visual DNA (Physical Traits)</Label>
            <textarea
              value={newDNA.prompt}
              onChange={(e) => setNewDNA({ ...newDNA, prompt: e.target.value })}
              className="w-full bg-zinc-900 border-zinc-800 rounded-[2rem] p-8 text-white font-medium text-sm min-h-[220px] focus:outline-none focus:border-fuchsia-500/50 transition-all"
              placeholder="Define visual markers..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAdd} className="w-full h-20 bg-fuchsia-500 text-white font-black uppercase tracking-[0.4em] text-xs rounded-[2rem] shadow-2xl hover:bg-fuchsia-400 transition-all">
            Authorize DNA Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

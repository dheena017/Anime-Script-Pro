import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { Save, FolderHeart, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error' | 'warning';

export const SaveProjectDialog = React.memo(() => {
  const { prompt, isSaving, generatedScript, castList, generatedWorld } = useGeneratorState();
  const { setPrompt, syncCore } = useGeneratorDispatch();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('New Anime Project');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasAnyContent = !!(generatedScript || (castList && castList.length > 0) || generatedWorld);

  // Reset status when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStatus('idle');
      setErrorMessage(null);
      if (!hasAnyContent) {
        setErrorMessage("Warning: No production data generated yet. Saving will create an empty project container.");
      }
      if (prompt) {
        setProjectName(prompt.slice(0, 50) || 'New Anime Project');
        setDetails(prompt);
      } else {
        setProjectName('New Anime Project');
        setDetails('');
      }
    }
  }, [open, prompt, hasAnyContent]);

  const handleSave = async () => {
    console.info("[SaveProjectDialog] handleSave initiated", { projectName });
    // Pre-flight validation
    if (!projectName.trim()) {
      console.warn("[SaveProjectDialog] Validation failed: Empty project name");
      setStatus('error');
      setErrorMessage('Please enter a project name before saving.');
      return;
    }

    setStatus('saving');
    setErrorMessage(null);

    try {
      // Update prompt if details changed
      if (details.trim() && details !== prompt) {
        setPrompt(details);
      }

      let result: number | undefined;
      try {
        console.info("[SaveProjectDialog] Calling syncCore...");
        // syncCore catches errors internally and returns undefined on failure
        result = await syncCore(undefined as any, projectName as any);
        console.info("[SaveProjectDialog] syncCore result:", result);
      } catch (syncErr: any) {
        console.error("[SaveProjectDialog] syncCore caught error:", syncErr);
        result = undefined;
      }

      if (typeof result === 'number' && result > 0) {
        setStatus('success');
        setTimeout(() => setOpen(false), 2000);
      } else {
        // syncCore returned undefined — it failed silently
        setStatus('error');
        setErrorMessage(
          result === undefined
            ? 'Save failed. This could be a network issue or you may not be logged in. Check the console for details.'
            : 'Unexpected response from server. Please try again.'
        );
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const statusConfig: Record<Exclude<SaveStatus, 'idle'>, { bg: string; text: string; icon: React.ReactNode; message: string }> = {
    saving: {
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      text: 'text-cyan-400',
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      message: 'Syncing all modules to the cloud...'
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      text: 'text-emerald-400',
      icon: <CheckCircle2 className="w-4 h-4" />,
      message: 'Project saved successfully! All modules synced.'
    },
    error: {
      bg: 'bg-red-500/10 border-red-500/20',
      text: 'text-red-400',
      icon: <XCircle className="w-4 h-4" />,
      message: errorMessage || 'Save failed. Please try again.'
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20',
      text: 'text-amber-400',
      icon: <AlertCircle className="w-4 h-4" />,
      message: errorMessage || 'Caution required.'
    }
  };

  // Simplify status derivation
  const activeStatus = status !== 'idle' ? status : (errorMessage ? 'warning' : 'idle');
  const currentStatus = activeStatus !== 'idle' ? statusConfig[activeStatus as keyof typeof statusConfig] : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="bg-cyan-500/10 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/20 hover:text-cyan-400 font-black uppercase tracking-widest text-[10px] h-9 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
          >
            <Save className={cn("w-3.5 h-3.5 mr-2 group-hover:scale-110 transition-transform", isSaving && "animate-pulse")} />
            {isSaving ? "SAVING..." : "SAVE PROJECT"}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[440px] bg-black/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <FolderHeart className="w-4 h-4 text-cyan-500" />
            Save Production Data
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 mt-2">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={projectName}
              onChange={(e) => { 
                setProjectName(e.target.value); 
                setErrorMessage(null); 
                if (status === 'error') setStatus('idle');
              }}
              className={cn(
                "bg-white/5 border-white/10 text-white placeholder:text-zinc-600 font-bold h-10 rounded-xl transition-colors",
                errorMessage && !projectName.trim() && "border-red-500/50 focus:border-red-500"
              )}
              placeholder="E.g., Neon Genesis Project"
              disabled={status === 'saving' || status === 'success'}
            />
          </div>

          {/* Core Concept */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Core Concept / Details
            </label>
            <TextareaAutosize
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
                if (status === 'error') {
                   setErrorMessage(null);
                   setStatus('idle');
                }
              }}
              className="w-full min-h-[80px] bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 rounded-xl text-xs p-3 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="Describe the production..."
              disabled={status === 'saving' || status === 'success'}
            />
          </div>

          {/* Status Banner */}
          {currentStatus ? (
            <div className={cn("border rounded-xl p-3 flex items-center gap-3 transition-all duration-300", currentStatus.bg)}>
              <span className={currentStatus.text}>{currentStatus.icon}</span>
              <p className={cn("text-[10px] font-black uppercase tracking-widest leading-relaxed", currentStatus.text)}>
                {currentStatus.message}
              </p>
            </div>
          ) : (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500 leading-relaxed text-center">
                Syncs: Engine · World · Cast · Series · Script · Storyboard · Assets · SEO · Screening
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={status === 'saving'}
            className="text-zinc-400 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-xl"
          >
            {status === 'success' ? 'Close' : 'Cancel'}
          </Button>
          {status !== 'success' && (
            <Button
              onClick={handleSave}
              disabled={status === 'saving'}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              {status === 'saving' ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </span>
              ) : status === 'error' ? 'Retry Save' : 'Confirm Save'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

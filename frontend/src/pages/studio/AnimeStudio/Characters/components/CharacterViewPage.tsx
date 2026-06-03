import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Edit3,
  Target,
  Skull,
  MessageSquare,
  User,
  Shield,
  Zap,
  Lock,
  Camera,
  Sparkles,
  Sun,
  Scale,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { characterStyles as s } from "../characterStyles";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useStudioBasePath } from "@/hooks/useStudioBasePath";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { generateImage } from "@/services/generators/core";
import { cn } from "@/lib/utils";

export default function CharacterViewPage() {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const basePath = useStudioBasePath();
  const { characterData, characterList, contentType } = useGeneratorState();
  const { setCharacterList } = useGeneratorDispatch();
  const { showNotification } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [synthesisLogs, setSynthesisLogs] = useState<string[]>([]);

  const displayCast =
    characterList && characterList.length > 0
      ? characterList
      : characterData?.characters || [];
  const character = displayCast.find((c: any) => c.name === characterName);

  const handleGenerateImage = async () => {
    if (!character) return;
    setIsGenerating(true);

    // Clear and initialize log console
    setSynthesisLogs([
      "READY: Connection to visual synthesis cluster initialized.",
      "DECODING: Compiling character appearance DNA string...",
    ]);

    // Custom set of interactive logs during wait
    const techLogs = [
      "PARSING: Compiling visual details...",
      "ENGINE: Connecting to stable-image/generate/core...",
      "SYNTHESIZING: Rendering vector fields for anime aesthetic...",
      "RENDERING: Adjusting high-contrast rim lighting protocols...",
      "COMPILING: Manifesting key visual elements and noir overlays...",
      "OPTIMIZING: Buffering final base64 image canvas...",
    ];

    let stepIdx = 0;
    const logInterval = setInterval(() => {
      if (stepIdx < techLogs.length) {
        setSynthesisLogs((prev) => [...prev, techLogs[stepIdx]]);
        stepIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 1200);

    showNotification(
      "Contacting synthesis cluster... Materializing visual DNA.",
      "info",
    );
    try {
      const appearanceDetails = toText(
        character.technicalModel?.visualDNA ||
        character.appearance ||
        character.name,
      );
      const prompt = `Highly detailed anime concept art, key visual portrait of character ${character.name}: ${appearanceDetails}. High-fidelity illustration, gorgeous cinematic lighting, aesthetic rich coloring, premium studio grade quality.`;

      const base64Image = await generateImage(prompt);

      clearInterval(logInterval);
      setSynthesisLogs((prev) => [
        ...prev,
        "SUCCESS: Graphic synthesis completed successfully.",
        "PERSISTING: Transmitting base64 graphic payload to cast memory...",
        "STATUS_OK: Portrait synchronized with local cast list.",
      ]);

      const liveList = [...displayCast];
      const liveIndex = liveList.findIndex(
        (c: any) => c.name === characterName,
      );
      if (liveIndex !== -1) {
        liveList[liveIndex] = { ...liveList[liveIndex], imageUrl: base64Image };
        setCharacterList(liveList);
        showNotification(
          `Character visual DNA for ${character.name} manifested successfully!`,
          "success",
        );
      }
    } catch (err: any) {
      clearInterval(logInterval);
      setSynthesisLogs((prev) => [
        ...prev,
        `ERROR: Visual synthesis failed: ${err.message || err}`,
        "STATUS_FAIL: Compilation terminated.",
      ]);
      console.error(err);
      showNotification(`Synthesis failed: ${err.message || err}`, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const toText = (value: unknown, fallback = ""): string => {
    if (typeof value === "string") return value;
    if (value == null) return fallback;
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
        .join(", ");
    }
    if (typeof value === "object") {
      return Object.values(value as Record<string, unknown>)
        .map((item) =>
          typeof item === "string"
            ? item
            : Array.isArray(item)
              ? item.join(", ")
              : JSON.stringify(item),
        )
        .join(" | ");
    }
    return String(value);
  };

  if (!character) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
          <User className="w-10 h-10 text-zinc-700" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Identity Not Found
          </h2>
          <p className="text-zinc-500 text-sm max-w-xs">
            The requested character soul could not be retrieved from the
            manifest.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="border-zinc-800 text-zinc-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Registry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Navigation */}
      <div className={s.header.container}>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className={`${s.header.actionButton} bg-transparent text-zinc-400 hover:text-white px-4 py-2 h-10`}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Character Registry
        </Button>

        <Button
          onClick={() =>
            navigate(
              `${basePath}/cast/characters/${encodeURIComponent(characterName!)}/edit`,
            )
          }
          className={s.header.actionButtonPrimary}
        >
          <Edit3 className="w-3.5 h-3.5 mr-2" /> Refine DNA
        </Button>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 space-y-8">
          <div className="flex flex-col gap-6">
            <div className="aspect-square md:aspect-[4/5] max-w-[300px] w-full mx-auto rounded-3xl bg-zinc-950 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.7)] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-studio/10 via-transparent to-fuchsia-500/5" />

              {/* Animated Neural Circuit */}
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 100 100"
              >
                <motion.path
                  d="M0 20 L40 20 L50 10 L80 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-studio"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.path
                  d="M100 80 L60 80 L50 90 L20 90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.2"
                  className="text-fuchsia-500"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                />
              </svg>

              {character.imageUrl ? (
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] relative z-10"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-6 relative z-10 w-full h-full p-6 text-center select-none">
                  {/* Outer Pulsing HUD circles */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-dashed border-studio/25 animate-[spin_40s_linear_infinite]" />
                    <div className="absolute -inset-2 rounded-full border border-white/5 animate-[spin_60s_linear_infinite_reverse]" />
                    <div className="absolute inset-4 rounded-full border border-studio/10 animate-[pulse_3s_ease-in-out_infinite]" />
                    <User className="w-16 h-16 text-zinc-800 group-hover:text-studio/30 transition-all duration-1000 group-hover:scale-110" />

                    {/* Glowing Tech Crosshairs */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-studio/45" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-studio/45" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-3 bg-studio/45" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-3 bg-studio/45" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-studio uppercase tracking-[0.25em] animate-pulse">
                      Awaiting Materialization
                    </p>
                    <p className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase">
                      NO PORTRAIT REGISTERED
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/85 backdrop-blur-xl border border-white/5 rounded-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                <p className="text-[10px] font-black text-studio uppercase tracking-[0.2em] mb-1">
                  Visual Parameters
                </p>
                <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                  "
                  {toText(
                    character.technicalModel?.visualDNA ||
                    character.appearance ||
                    "Aesthetic parameters pending.",
                  )}
                  "
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] text-center space-y-2 hover:border-studio/30 transition-colors">
              <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                Archetype
              </p>
              <p className="text-lg font-black text-studio uppercase tracking-tighter relative z-10">
                {toText(character.archetype) || "Main"}
              </p>
            </div>
            <div className="group relative p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] text-center space-y-2 hover:border-fuchsia-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(217,70,239,0.3)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-xs font-black text-zinc-500 uppercase tracking-widest relative z-10">
                Alignment
              </p>
              <p className="text-lg font-black text-fuchsia-400 uppercase tracking-tighter relative z-10">
                {toText(character.personality) || "Neutral"}
              </p>
            </div>
          </div>

          {/* Quantum Visual Synthesis Console */}
          <div className="bg-zinc-950/80 backdrop-blur-3xl border border-white/5 border-t-studio/20 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:border-studio/40 transition-all duration-700 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(6,182,212,0.2)]">
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-studio/10 rounded-full blur-[80px] group-hover:bg-studio/20 transition-all duration-700" />
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-studio/50 to-transparent opacity-50" />

            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isGenerating
                        ? "bg-amber-500 animate-ping"
                        : "bg-studio shadow-[0_0_8px_var(--studio-glow)]",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute w-2 h-2 rounded-full",
                      isGenerating ? "bg-amber-500 animate-pulse" : "bg-studio",
                    )}
                  />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  Quantum Materializer
                </span>
              </div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                ENG: IMAGEN.V3
              </span>
            </div>

            {/* Prompt Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-wider font-mono">
                <span>Visual DNA Prompt</span>
                <span>Active</span>
              </div>
              <div className="p-4 bg-black/75 rounded-2xl border border-white/5 text-[11px] font-mono text-zinc-400 max-h-[85px] overflow-y-auto leading-relaxed hide-scrollbar select-none italic relative">
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-studio/20 rounded-full animate-ping" />
                "
                {toText(
                  character.technicalModel?.visualDNA ||
                  character.appearance ||
                  "Aesthetic parameters pending.",
                )}
                "
              </div>
            </div>

            {/* Engine Specifications */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider font-mono mb-0.5">
                  Scale
                </p>
                <p className="text-[10px] font-black text-studio uppercase tracking-tighter">
                  4:5 ratio
                </p>
              </div>
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider font-mono mb-0.5">
                  Format
                </p>
                <p className="text-[10px] font-black text-fuchsia-400 uppercase tracking-tighter">
                  Base64 PNG
                </p>
              </div>
              <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider font-mono mb-0.5">
                  Denoise
                </p>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">
                  1.0 (Opt)
                </p>
              </div>
            </div>

            {/* Real-time Synthesis Log Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  Synthesis Log Stream
                </span>
                {isGenerating && (
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono animate-pulse animate-duration-1000">
                    Processing...
                  </span>
                )}
              </div>
              <div className="p-4 bg-black/95 border border-white/5 rounded-2xl h-[120px] overflow-y-auto font-mono text-[10px] text-zinc-400 space-y-1.5 custom-scrollbar scroll-smooth">
                {synthesisLogs.length === 0 ? (
                  <div className="flex items-center gap-2 text-zinc-600 italic">
                    <span>&gt;</span>
                    <span>System idle. Ready to compile DNA...</span>
                  </div>
                ) : (
                  synthesisLogs.map((log, i) => (
                    <div
                      key={i}
                      className="flex gap-2 items-start leading-relaxed"
                    >
                      <span className="text-zinc-600 shrink-0 select-none">
                        &gt;
                      </span>
                      <span
                        className={cn(
                          log.startsWith("ERROR")
                            ? "text-red-400 font-bold"
                            : log.startsWith("SUCCESS") ||
                              log.startsWith("STATUS_OK")
                              ? "text-emerald-400 font-bold text-shadow-sm"
                              : log.startsWith("STATUS_FAIL")
                                ? "text-red-400"
                                : log.startsWith("DECODING") ||
                                  log.startsWith("RENDERING") ||
                                  log.startsWith("MATERIALIZING")
                                  ? "text-fuchsia-400"
                                  : "text-studio",
                        )}
                      >
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Manifest Portrait Trigger Button */}
            <Button
              disabled={isGenerating}
              onClick={handleGenerateImage}
              className={cn(
                "w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden border cursor-pointer",
                isGenerating
                  ? "bg-zinc-900 text-zinc-600 border-zinc-800 pointer-events-none"
                  : "bg-studio/10 hover:bg-studio text-studio hover:text-black border-studio/30 hover:border-studio shadow-[0_0_20px_rgba(6,182,212,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-95",
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-studio" />
                  <span>Manifesting Soul...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-studio animate-pulse" />
                  <span>Materialize Portrait</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 bg-studio/5 border border-studio/20 rounded-2xl text-xs font-black text-studio uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-studio shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
                Neural Identity Verified
              </div>
              <div className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-2xl text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                SID: CAST-
                {Math.random().toString(36).substring(7).toUpperCase()}
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500 uppercase tracking-tighter leading-none filter drop-shadow-lg">
              {character.name}
            </h1>
            <div className="relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-studio via-fuchsia-500 to-transparent rounded-full" />
              <p className="text-xl md:text-2xl text-zinc-300 font-medium leading-relaxed max-w-3xl italic pl-8 py-2">
                "{toText(character.goal) || "No primary objective defined."}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="relative p-10 bg-zinc-950/80 border-white/5 backdrop-blur-3xl space-y-6 group/card hover:border-studio/40 transition-all duration-700 rounded-[3rem] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(6,182,212,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-studio/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-studio/10 rounded-full blur-3xl group-hover/card:bg-studio/30 transition-colors duration-700" />
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-studio/10 border border-studio/20 flex items-center justify-center text-studio shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-500">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-studio uppercase tracking-[0.3em] mb-1">
                    Ideological Protocol
                  </p>
                  <p className="text-2xl font-black text-white uppercase tracking-tighter">
                    Primary Conflict
                  </p>
                </div>
              </div>
              <p className="relative z-10 text-sm text-zinc-400 leading-relaxed font-medium italic border-l-2 border-studio/20 pl-4 group-hover/card:border-studio/50 transition-colors">
                {toText(character.conflict) ||
                  "The internal struggle between duty and desire remains unspecified."}
              </p>
            </Card>

            <Card className="relative p-10 bg-zinc-950/80 border-white/5 backdrop-blur-3xl space-y-6 group/card hover:border-fuchsia-500/40 transition-all duration-700 rounded-[3rem] overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(217,70,239,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-bl from-fuchsia-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl group-hover/card:bg-fuchsia-500/30 transition-colors duration-700" />
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-500 shadow-[inset_0_0_20px_rgba(217,70,239,0.1)] group-hover/card:scale-110 group-hover/card:-rotate-3 transition-transform duration-500">
                  <Skull className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.3em] mb-1">
                    Psychological DNA
                  </p>
                  <p className="text-2xl font-black text-white uppercase tracking-tighter">
                    Fatal Flaw
                  </p>
                </div>
              </div>
              <p className="relative z-10 text-sm text-zinc-400 leading-relaxed font-medium italic border-l-2 border-fuchsia-500/20 pl-4 group-hover/card:border-fuchsia-500/50 transition-colors">
                {toText(character.flaw) ||
                  "The fundamental vulnerability that threatens to derail their mission."}
              </p>
            </Card>
          </div>

          {/* Deep Production DNA Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group space-y-4">
              <div className="flex items-center gap-3 text-red-500 px-2">
                <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Directorial Camera Notes
                </h3>
              </div>
              <div className="p-8 bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-[2.5rem] group-hover:border-red-500/40 group-hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.2)] transition-all duration-500">
                <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                  "{toText(
                    character.powerSystem?.cameraChoreography ||
                    "Maintain high-octane tracking shots with emphasis on kinetic weight.",
                  )}"
                </p>
              </div>
            </div>

            <div className="group space-y-4">
              <div className="flex items-center gap-3 text-fuchsia-400 px-2">
                <div className="p-2 bg-fuchsia-500/10 rounded-lg group-hover:bg-fuchsia-500/20 transition-colors">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                  The Moral Dilemma
                </h3>
              </div>
              <div className="p-8 bg-gradient-to-bl from-fuchsia-500/10 to-transparent border border-fuchsia-500/20 rounded-[2.5rem] group-hover:border-fuchsia-500/40 group-hover:shadow-[0_10px_30px_-10px_rgba(217,70,239,0.2)] transition-all duration-500">
                <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                  "{toText(
                    character.narrative?.arcRoadmap?.moralDilemma ||
                    "A choice between personal salvation and the collective good.",
                  )}"
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group space-y-4">
              <div className="flex items-center gap-3 text-indigo-400 px-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Cinematic VFX Signature
                </h3>
              </div>
              <div className="p-8 bg-gradient-to-tr from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[2.5rem] group-hover:border-indigo-500/40 group-hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2)] transition-all duration-500">
                <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                  "{toText(
                    character.technicalModel?.vfxSignature ||
                    "Subtle chromatic aberration / particulate dust effects.",
                  )}"
                </p>
              </div>
            </div>

            <div className="group space-y-4">
              <div className="flex items-center gap-3 text-amber-500 px-2">
                <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                  <Sun className="w-4 h-4" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Rendering Lighting Logic
                </h3>
              </div>
              <div className="p-8 bg-gradient-to-tl from-amber-500/10 to-transparent border border-amber-500/20 rounded-[2.5rem] group-hover:border-amber-500/40 group-hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)] transition-all duration-500">
                <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                  "{toText(
                    character.technicalModel?.lightingLogic ||
                    "Rim lighting / High contrast shadow profiles.",
                  )}"
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-studio px-2">
              <div className="p-2 bg-studio/10 rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                Acoustic & Communication Protocol
              </h3>
            </div>
            <div className="p-8 md:p-10 bg-zinc-950/80 border border-white/5 border-l-studio/40 rounded-3xl relative overflow-hidden group/speech hover:border-l-studio transition-all duration-500 shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/speech:opacity-20 group-hover/speech:scale-110 group-hover/speech:rotate-12 transition-all duration-700">
                <Zap className="w-24 h-24 text-studio" />
              </div>
              <div className="flex flex-col gap-6 relative z-10">
                <p className="text-xl md:text-2xl text-white font-medium italic tracking-tight leading-relaxed max-w-2xl">
                  "
                  {toText(character.speakingStyle) ||
                    "Clinical and precise communication protocols."}
                  "
                </p>
                <div className="flex gap-4 items-center">
                  <div className="px-5 py-2 bg-studio/10 border border-studio/30 rounded-xl text-xs font-black text-studio uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 h-full bg-studio animate-pulse" />
                      <div className="w-0.5 h-2/3 bg-studio animate-pulse delay-75" />
                      <div className="w-0.5 h-full bg-studio animate-pulse delay-150" />
                      <div className="w-0.5 h-1/2 bg-studio animate-pulse delay-200" />
                    </div>
                    <span>Rhythm: {toText(character.speakingStyle?.dialogueRhythm || "Melodic")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-orange-500 px-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                Classified Identity Data
              </h3>
            </div>
            <div className="relative p-12 bg-zinc-950/90 border border-orange-500/20 rounded-[3rem] group/secret overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwbDRsNCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-20 pointer-events-none" />
              
              <div className="relative z-10 transition-all duration-1000 blur-[12px] group-hover/secret:blur-none select-none group-hover/secret:select-auto">
                <p className="text-xl text-orange-400 font-black uppercase tracking-[0.2em] italic leading-relaxed text-center">
                  "{toText(character.secret) || "NO CLASSIFIED DATA FOUND ON CURRENT LEVEL."}"
                </p>
              </div>

              {/* Holographic overlay before hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-100 group-hover/secret:opacity-0 transition-opacity duration-500 pointer-events-none">
                <Lock className="w-12 h-12 text-orange-500/50 mb-4" />
                <span className="px-4 py-1.5 bg-orange-500/20 border border-orange-500/50 rounded-full text-xs font-black text-orange-400 uppercase tracking-widest shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                  Hover to Decrypt
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

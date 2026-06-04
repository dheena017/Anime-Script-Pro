import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudioBasePath } from "@/hooks/useStudioBasePath";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import {
  Target,
  User,
  EyeOff,
  Loader2,
  Shield,
  Activity,
  Mic,
  Cpu,
  Swords,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CharacterCardProps {
  character: any;
  index: number;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
  onViewCharacter?: (charName: string) => void;
}

export const CharacterCard = React.memo<CharacterCardProps>(
  ({ character, index, onUpdate, onViewCharacter }) => {
    const navigate = useNavigate();
    const basePath = useStudioBasePath();
    const { isDemoMode } = useGeneratorState();
    const { showNotification } = useGeneratorDispatch();
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const toText = (value: unknown, fallback = ""): string => {
      if (typeof value === "string") return value;
      if (value == null) return fallback;
      if (Array.isArray(value)) {
        return value
          .map((item) =>
            typeof item === "string" ? item : JSON.stringify(item),
          )
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

    const archetypeText = toText(character.archetype, "Main Protocol");
    const personalityText = toText(character.personality, "Underspecified");
    const goalText = toText(character.goal, "Redacted");

    // High-fidelity secret extractor supporting single values, arrays, and standard fallbacks
    const getSecretText = (): string => {
      if (character.secret) return toText(character.secret);
      if (Array.isArray(character.secrets) && character.secrets.length > 0) {
        return toText(character.secrets[0]);
      }
      if (character.secrets) return toText(character.secrets);
      return "Classified Identity Data is encrypted. Initiate deep cast sync to reveal.";
    };
    const secretText = getSecretText();

    // Helper extractors to dynamically map nested schemas (AI-generated) OR flat fallback schemas (mock data)
    const getCombatTier = (): string =>
      toText(character.powerSystem?.powerTier || "Tier A");
    const getCombatAbility = (): string =>
      toText(
        character.powerSystem?.signatureAbility ||
          character.combatStyle ||
          "Aether Reactor Kinetic Strike",
      );
    const getCombatDetails = (): string =>
      toText(
        character.powerSystem?.limitations ||
          (character.combatStyle
            ? `Combat style: ${character.combatStyle}`
            : "Operational limits within default parameters."),
      );

    const getVoiceRhythm = (): string =>
      toText(
        character.speakingStyle?.dialogueRhythm ||
          (typeof character.speakingStyle === "string"
            ? "Rhythmic"
            : "Melodic"),
      );
    const getVoiceArchetype = (): string =>
      toText(
        character.speakingStyle?.voiceArchetype ||
          (typeof character.speakingStyle === "string"
            ? character.speakingStyle
            : "Standard Vocoder Model"),
      );
    const getVoiceCatchphrase = (): string => {
      if (
        Array.isArray(character.speakingStyle?.catchphrases) &&
        character.speakingStyle.catchphrases.length > 0
      ) {
        return `"${character.speakingStyle.catchphrases[0]}"`;
      }
      if (character.speakingStyle?.catchphrase) {
        return `"${character.speakingStyle.catchphrase}"`;
      }
      if (typeof character.speakingStyle === "string") {
        return `"${character.speakingStyle}"`;
      }
      return "No active voice-signature logged.";
    };

    const getVfxMovement = (): string =>
      toText(character.technicalModel?.movementStyle || "High-Velocity Trace");
    const getVfxSignature = (): string =>
      toText(
        character.technicalModel?.vfxSignature ||
          (typeof character.appearance === "string"
            ? character.appearance
            : character.appearance?.silhouette) ||
          character.visuals ||
          "Organic particle trails",
      );
    const getVfxLighting = (): string =>
      toText(
        character.technicalModel?.lightingLogic || "High-Contrast Backlighting",
      );

    const getPsychologyArc = (): string =>
      toText(character.narrative?.arcType || "Evolution");
    const getPsychologyWound = (): string =>
      toText(
        character.psychologyProfile?.coreWound ||
          character.psychology ||
          character.personality ||
          "Internal conflict uncatalogued.",
      );
    const getPsychologyCoping = (): string =>
      toText(
        character.psychologyProfile?.copingMechanism || "Strategic isolation",
      );

    // Resilient production-readiness calculator based on populated data segments
    const readiness =
      [
        character.speakingStyle?.voiceArchetype ||
          typeof character.speakingStyle === "string",
        character.powerSystem?.signatureAbility || character.combatStyle,
        character.psychologyProfile?.coreWound ||
          character.psychology ||
          character.personality,
        character.technicalModel?.vfxSignature ||
          character.appearance ||
          character.visuals,
      ].filter(Boolean).length * 25;


    return (
      <div className="group relative bg-[#060606] border border-white/5 rounded-[3rem] overflow-hidden hover:border-studio/30 hover:shadow-[0_0_80px_rgba(var(--studio-rgb),0.1)] flex flex-col">

        {/* Neural Header */}
        <div className="h-28 bg-zinc-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-studio/20 via-transparent to-fuchsia-500/10 opacity-30" />
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 20 L20 20 L30 40 L50 40 L60 10 L80 10 L100 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-studio"
            />
            <path
              d="M0 80 L10 80 L25 60 L40 60 L55 90 L70 90 L100 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-fuchsia-500"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Role/Tier Ribbon */}
          <div className="absolute top-6 right-[-3rem] w-40 h-8 bg-studio rotate-45 flex items-center justify-center shadow-2xl">
            <span className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
              {toText(character.tier || "CAST")}
            </span>
          </div>
        </div>

        <div className="px-10 pb-10 -mt-14 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-end mb-8">
            {/* Avatar Core */}
            <div className="relative group/avatar shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-tr from-studio to-fuchsia-500 rounded-[2.5rem] blur-xl opacity-0 group-hover/avatar:opacity-30" />
              <div className="w-36 h-36 rounded-[2.2rem] bg-zinc-950 border border-white/10 flex items-center justify-center overflow-hidden relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover/avatar:border-studio/50">
                {isGeneratingImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-studio" />
                    <span className="text-[10px] font-black text-studio uppercase tracking-widest">
                      Scanning DNA
                    </span>
                  </div>
                ) : character.imageUrl ? (
                  <img
                    src={character.imageUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-zinc-800">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>

                {/* Generate button removed from character card; moved to scene view */}
              </div>

            {/* Identity & Archetype Info */}
            <div className="flex-1 pb-2">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-3 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  {character.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-5 py-2 bg-studio/5 border border-studio/20 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-studio shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-studio">
                      {archetypeText}
                    </span>
                  </div>
                  <div className="px-5 py-2 bg-white/5 border border-white/5 rounded-2xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      {personalityText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Faction Alignment & Origin Bar */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="px-4 py-3 bg-zinc-950/60 border border-white/5 rounded-2xl flex items-center gap-3">
              <Shield className="w-4 h-4 text-studio shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">
                  FACTION
                </div>
                <div className="text-xs font-black text-zinc-300 truncate uppercase tracking-wide">
                  {toText(
                    character.worldAlignment?.factionAffiliation,
                    "Independent",
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-zinc-950/60 border border-white/5 rounded-2xl flex items-center gap-3">
              <MapPin className="w-4 h-4 text-fuchsia-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">
                  ORIGIN
                </div>
                <div className="text-xs font-black text-zinc-300 truncate uppercase tracking-wide">
                  {toText(
                    character.worldAlignment?.geographicOrigin,
                    "Unknown Sector",
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-zinc-950/60 border border-white/5 rounded-2xl flex items-center gap-3">
              <Activity className="w-4 h-4 text-orange-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">
                  BIOLOGY
                </div>
                <div className="text-xs font-black text-zinc-300 truncate uppercase tracking-wide">
                  {character.age ? `${character.age} yrs` : "Age N/A"} |{" "}
                  {character.gender || "Classified"}
                </div>
              </div>
            </div>
          </div>

          {/* Readiness Meter */}
          <div className="mb-8 p-5 bg-zinc-950/80 rounded-3xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Production Ready Factor
              </span>
              <span className="text-[10px] font-black text-white">
                {readiness}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                style={{ width: `${readiness}%` }}
                className="h-full bg-gradient-to-r from-studio/40 to-studio shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              />
            </div>
          </div>

          {/* Telemetry Core Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Combat Systems Telemetry */}
            <div className="p-6 bg-zinc-950/40 rounded-[2rem] border border-white/5 hover:border-studio/25 hover:bg-zinc-900/20 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-studio">
                  <Swords className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Combat Telemetry
                  </span>
                </div>
                <span className="text-[9px] font-black px-2.5 py-0.5 bg-studio/10 text-studio border border-studio/20 rounded-full uppercase tracking-wider">
                  {getCombatTier()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-black text-white uppercase tracking-wider">
                  ABILITY: <span className="text-studio font-black">{getCombatAbility()}</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                  {getCombatDetails()}
                </div>
              </div>
              {/* Dynamic Reactor Charge indicator */}
              <div className="flex gap-1.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 bg-studio rounded-full shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  />
                ))}
              </div>
            </div>

            {/* Speech & Voice Engine */}
            <div className="p-6 bg-zinc-950/40 rounded-[2rem] border border-white/5 hover:border-fuchsia-500/25 hover:bg-zinc-900/20 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-fuchsia-500">
                  <Mic className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Voice Engine
                  </span>
                </div>
                <span className="text-[9px] font-black px-2.5 py-0.5 bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20 rounded-full uppercase tracking-wider">
                  {getVoiceRhythm()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-black text-white uppercase tracking-wider">
                  ARCHETYPE:{" "}
                  <span className="text-fuchsia-400 font-black">
                    {getVoiceArchetype()}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                  {getVoiceCatchphrase()}
                </div>
              </div>
              {/* Voice Waves Visualizer */}
              <div className="flex items-end gap-1 h-5 mt-2 px-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-4 bg-fuchsia-500 rounded-full shadow-[0_0_8px_rgba(217,70,239,0.4)]"
                  />
                ))}
                <span className="text-[8px] font-black text-fuchsia-500/50 uppercase tracking-widest ml-auto">
                  VOX PULSE
                </span>
              </div>
            </div>

            {/* Technical Style Models */}
            <div className="p-6 bg-zinc-950/40 rounded-[2rem] border border-white/5 hover:border-cyan-500/25 hover:bg-zinc-900/20 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Visual VFX Model
                  </span>
                </div>
                <span className="text-[9px] font-black px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full uppercase tracking-wider">
                  {getVfxMovement()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-black text-white uppercase tracking-wider">
                  VFX:{" "}
                  <span className="text-cyan-400 font-black">
                    {getVfxSignature()}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  {getVfxLighting()}
                </div>
              </div>
              {/* Dynamic Oscilloscope Scanner */}
              <div className="relative mt-2 h-7 bg-zinc-950/90 rounded-xl border border-white/5 overflow-hidden flex items-center px-3">
                <div className="absolute top-0 bottom-0 w-6 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.3)] z-0" />
                <div className="flex items-center gap-1 relative z-10 w-full">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[2.5px] h-7 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    />
                  ))}
                  <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest ml-auto">
                    VFX OSCILLOSCOPE ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Psychological Profile */}
            <div className="p-6 bg-zinc-950/40 rounded-[2rem] border border-white/5 hover:border-orange-500/25 hover:bg-zinc-900/20 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-orange-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Psychology Model
                  </span>
                </div>
                <span className="text-[9px] font-black px-2.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full uppercase tracking-wider">
                  {getPsychologyArc()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-black text-white uppercase tracking-wider truncate">
                  WOUND:{" "}
                  <span className="text-orange-400 font-black">
                    {getPsychologyWound()}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  {getPsychologyCoping()}
                </div>
              </div>
              {/* EKG / Heartbeat Cognitive indicator */}
              <div className="flex items-center gap-1 mt-2">
                <div className="flex gap-1 flex-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-3 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                    />
                  ))}
                </div>
                <span className="text-[8px] font-black text-orange-500/50 uppercase tracking-widest ml-auto">
                  COGNITIVE CORE
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Objective Drawer */}
          <div className="mb-4 p-6 bg-zinc-950/40 rounded-[2rem] border border-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-studio">
              <Target className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Main Objective
              </span>
            </div>
            <div className="relative overflow-hidden bg-studio/5 border border-studio/20 rounded-2xl p-5 group/objective hover:border-studio/50">
              {/* Corner Cyber Brackets */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-studio/60" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-studio/60" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-studio/60" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-studio/60" />

              {/* Scanning Laser Line */}
              <div className="absolute left-0 right-0 top-0 h-[1.5px] bg-studio/40 shadow-[0_0_10px_rgba(6,182,212,0.8)] pointer-events-none z-0" />

              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-[8px] font-black px-2.5 py-0.5 bg-studio/10 text-studio border border-studio/25 rounded-full tracking-widest uppercase">
                  SYSTEM DIRECTIVE: ACTIVE
                </span>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                  Priority Status: Alpha
                </span>
              </div>

              <div className="relative pl-4 border-l-2 border-studio/50 py-1.5 relative z-10">
                <p className="text-xs text-zinc-200 font-bold leading-relaxed tracking-wide italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  "{goalText}"
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Secrets Drawer */}
          <div className="p-6 bg-zinc-950/40 rounded-[2rem] border border-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-orange-500">
              <EyeOff className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">
                Neural Secret (Hover to De-Encrypt)
              </span>
            </div>
            <div className="bg-orange-500/5 p-4 rounded-xl cursor-help">
              <p className="text-xs text-orange-400/90 font-black uppercase italic tracking-wide">
                {secretText}
              </p>
            </div>
          </div>
        </div>

        {/* Neural Footer */}
        <div className="px-10 py-6 bg-black/40 border-t border-white/5 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">
                DNA-0{index + 1}
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
              <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">
                Neural Link: Encrypted
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onViewCharacter?.(character.name)}
              className="px-8 py-2 bg-studio/10 hover:bg-studio text-studio hover:text-black font-black uppercase text-xs tracking-widest rounded-2xl border border-studio/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
            >
              Access Full Profile
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

CharacterCard.displayName = "CharacterCard";

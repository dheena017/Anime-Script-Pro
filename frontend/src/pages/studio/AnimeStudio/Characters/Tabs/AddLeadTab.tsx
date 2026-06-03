import React, { useState } from "react";
import {
  UserPlus,
  Sparkles,
  Fingerprint,
  Brain,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { StudioEmptyState } from "@/pages/studio/components/studio/shared/StudioEmptyState";
import { generateCharacters } from "@/services/api/gemini";
import { cn } from "@/lib/utils";

export const AddLeadTab: React.FC = () => {
  const { characterList, prompt, selectedModel, contentType, generatedWorld } =
    useGeneratorState();
  const { setCharacterList, showNotification } = useGeneratorDispatch();
  const hasCast = Array.isArray(characterList) && characterList.length > 0;
  const [showForm, setShowForm] = useState(hasCast);
  const [name, setName] = useState("");
  const [archetype, setArchetype] = useState("");
  const [goal, setGoal] = useState("");
  const [isBrainstorming, setIsBrainstorming] = useState(false);

  if (!showForm) {
    return (
      <StudioEmptyState
        icon={UserPlus}
        title="Lead Slot Empty"
        description="No lead profile has been initialized yet. Start manual manifestation to seed your cast."
        actionLabel="Start Manual Manifestation"
        onAction={() => setShowForm(true)}
        features={[
          {
            icon: Fingerprint,
            title: "Identity Seed",
            description: "Create the foundational lead profile",
          },
          {
            icon: Brain,
            title: "Motivation Core",
            description: "Define archetype and narrative drive",
          },
          {
            icon: Sparkles,
            title: "Cast Bootstrap",
            description: "Use this lead as the first registry anchor",
          },
        ]}
        accentColor="amber"
      />
    );
  }

  const handleBrainstorm = async () => {
    if (!name && !archetype) {
      showNotification?.(
        "Please provide at least a name or archetype for brainstorming.",
        "info",
      );
      return;
    }

    setIsBrainstorming(true);
    try {
      const userReq = `Brainstorm a detailed character profile for: ${name} (${archetype}). Context: ${prompt}`;
      const result = await generateCharacters(
        userReq,
        selectedModel,
        contentType,
        generatedWorld || undefined,
        1,
      );

      if (
        typeof result === "object" &&
        result.characters &&
        result.characters.length > 0
      ) {
        const char = result.characters[0];
        setName(char.name);
        setArchetype(char.archetype);
        setGoal(char.goal);
        showNotification?.(
          "AI has synthesized a character profile.",
          "success",
        );
      }
    } catch (e) {
      console.error(e);
      showNotification?.("Failed to brainstorm character.", "error");
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleAddLead = () => {
    if (!name || !archetype) {
      showNotification?.("Name and Archetype are required.", "error");
      return;
    }

    const newCharacter = {
      id: `char-${Date.now()}`,
      name,
      archetype,
      goal,
      personality: "Stable Profile",
      appearance: "Awaiting visual description...",
      conflict: "External tensions pending...",
      secret: "Classified",
      speakingStyle: "Formal",
      flaw: "Unknown",
      visualPrompt: `${name}, ${archetype}, cinematic anime style portrait.`,
      imageUrl: null,
    };

    setCharacterList([...(characterList || []), newCharacter]);
    showNotification?.(
      `${name} has been manifested in the registry.`,
      "success",
    );

    // Clear form
    setName("");
    setArchetype("");
    setGoal("");
  };

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-12">
      <div className="text-center space-y-4">
        <UserPlus className="w-16 h-16 text-amber-500 mx-auto opacity-50" />
        <h2 className="text-3xl font-black text-white uppercase tracking-widest">
          Manual Manifestation
        </h2>
        <p className="text-zinc-500 text-sm">
          Directly inject a new soul into the narrative registry.
        </p>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-4">
              Full Name
            </label>
            <input
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:border-amber-500/50 outline-none transition-all font-bold"
              placeholder="Character Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-4">
              Archetype
            </label>
            <div className="relative">
              <input
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:border-amber-500/50 outline-none transition-all font-bold"
                placeholder="The Rogue, The Hero..."
                value={archetype}
                onChange={(e) => setArchetype(e.target.value)}
              />
              <button
                onClick={handleBrainstorm}
                disabled={isBrainstorming}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-400 transition-colors"
                title="Brainstorm with AI"
              >
                <Sparkles
                  className={cn("w-5 h-5", isBrainstorming && "animate-pulse")}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-4">
            Core Motivation
          </label>
          <textarea
            className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:border-amber-500/50 outline-none transition-all font-bold resize-none"
            placeholder="What drives this soul?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleBrainstorm}
            disabled={isBrainstorming}
            className="flex-1 h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-amber-500 font-black uppercase tracking-widest rounded-2xl flex gap-2"
          >
            {isBrainstorming ? (
              <RefreshCcw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            AI Brainstorm
          </Button>
          <Button
            onClick={handleAddLead}
            className="flex-[2] h-14 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)] flex gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Initialize Manifestation
          </Button>
        </div>
      </div>
    </div>
  );
};

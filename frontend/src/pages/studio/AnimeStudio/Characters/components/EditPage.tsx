import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Target, Skull, Sparkles, MessageSquare, User, Lock, Trash2, Workflow, Shield, Zap, Swords, Heart, ArrowRight } from "lucide-react";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useStudioBasePath } from "@/hooks/useStudioBasePath";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function RelationshipEditPage() {
  const { relationshipId } = useParams();
  const navigate = useNavigate();
  const basePath = useStudioBasePath();
  const { showNotification } = useApp();
  const { characterData, characterList, characterRelationships } =
    useGeneratorState();
  const { setCharacterRelationships } = useGeneratorDispatch();

  const displayCast = characterData?.characters || characterList || [];

  const connections = React.useMemo(() => {
    if (typeof characterRelationships === "string") {
      try {
        return JSON.parse(characterRelationships);
      } catch (e) {
        return [];
      }
    }
    return characterRelationships || [];
  }, [characterRelationships]);

  const connectionIndex = connections.findIndex(
    (c: any) => c.id === relationshipId,
  );
  const connection =
    connectionIndex !== -1 ? connections[connectionIndex] : null;

  const [formData, setFormData] = React.useState(connection);

  if (!connection || !formData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-zinc-700">
          <Workflow className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Identity Not Found
          </h2>
          <p className="text-zinc-500 text-sm max-w-xs">
            The requested emotional thread could not be retrieved from the
            manifest.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="border-zinc-800 text-zinc-400"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    const newList = [...connections];
    newList[connectionIndex] = formData;
    setCharacterRelationships(JSON.stringify(newList));
    showNotification(
      `Connection between ${formData.source} �    ${formData.target} realigned successfully!`,
      "success",
    );
    navigate(`${basePath}/cast/relationships`);
  };

  const handleRemove = () => {
    const newList = connections.filter((c: any) => c.id !== relationshipId);
    setCharacterRelationships(JSON.stringify(newList));
    showNotification(
      `Emotional thread dissolved and purged from the relationship matrix.`,
      "warning",
    );
    navigate(`${basePath}/cast/relationships`);
  };

  const types = [
    {
      id: "Ally",
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    {
      id: "Rival",
      icon: Zap,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
    },
    {
      id: "Enemy",
      icon: Swords,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
    {
      id: "Love",
      icon: Heart,
      color: "text-fuchsia-500",
      bg: "bg-fuchsia-500/10",
      border: "border-fuchsia-500/30",
    },
    {
      id: "Secret",
      icon: Lock,
      color: "text-zinc-500",
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/30",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Discard Modalities
        </Button>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleRemove}
            className="text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all font-black uppercase tracking-widest text-xs px-6 h-12 rounded-2xl"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Dissolve Connection
          </Button>
          <Button
            onClick={handleSave}
            className="bg-fuchsia-600 text-white hover:bg-fuchsia-500 transition-all font-black uppercase tracking-widest text-xs px-8 h-12 rounded-2xl shadow-[0_0_30px_rgba(217,70,239,0.3)]"
          >
            <Save className="w-4 h-4 mr-2" /> Apply Realignment
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-xs uppercase tracking-widest text-fuchsia-400 font-bold">
          Refactoring AI Threads
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
          Modify <span className="text-fuchsia-500">Connection</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-10">
            {/* Subject Selection */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
              <div className="md:col-span-3 space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                  Subject A (Source)
                </Label>
                <Select
                  value={formData.source}
                  onValueChange={(v: string | null) =>
                    setFormData({ ...formData, source: v || "" })
                  }
                >
                  <SelectTrigger className="bg-black/60 border-zinc-800 h-14 rounded-2xl text-lg font-bold">
                    <SelectValue placeholder="Select Identity A" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {displayCast.map((c: any) => (
                      <SelectItem
                        key={c.name}
                        value={c.name}
                        className="text-white hover:bg-studio/20"
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1 flex justify-center pt-6">
                <ArrowRight className="w-8 h-8 text-zinc-800" />
              </div>

              <div className="md:col-span-3 space-y-3">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                  Subject B (Target)
                </Label>
                <Select
                  value={formData.target}
                  onValueChange={(v: string | null) =>
                    setFormData({ ...formData, target: v || "" })
                  }
                >
                  <SelectTrigger className="bg-black/60 border-zinc-800 h-14 rounded-2xl text-lg font-bold">
                    <SelectValue placeholder="Select Identity B" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {displayCast.map((c: any) => (
                      <SelectItem
                        key={c.name}
                        value={c.name}
                        className="text-white hover:bg-studio/20"
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Connection Type */}
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                Select Dynamic Archetype
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {types.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({ ...formData, type: t.id })}
                    className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-3 group ${
                      formData.type === t.id
                        ? `${t.bg} ${t.border} ${t.color} shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-105`
                        : "bg-black/20 border-white/5 text-zinc-600 hover:border-white/10 hover:bg-black/40"
                    }`}
                  >
                    <t.icon
                      className={`w-6 h-6 transition-transform group-hover:scale-110`}
                    />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {t.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tension Slider */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                  Dynamic Complexity (Tension)
                </Label>
                <span
                  className={`text-2xl font-black ${formData.tension >= 8 ? "text-red-500" : "text-fuchsia-500"}`}
                >
                  {formData.tension}
                </span>
              </div>
              <Slider
                value={[formData.tension]}
                onValueChange={(v) => {
                  const val = Array.isArray(v) ? v[0] : v;
                  setFormData({ ...formData, tension: val });
                }}
                max={10}
                step={1}
                className="py-4"
              />
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4">
              <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                Relationship Summary
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-black/60 border-zinc-800 min-h-[120px] rounded-[2rem] p-6 text-sm italic text-zinc-400 focus:border-fuchsia-500/30"
                placeholder="Describe the nature of this emotional thread..."
              />
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] space-y-4">
            <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">
              Synthesis Parameter
            </p>
            <div className="space-y-1">
              <p className="text-xs text-white font-bold">RE-SYNTH_04</p>
              <p className="text-xs text-zinc-500 font-medium">
                Any changes will immediately affect the narrative engine's
                dialogue and action generation for scenes featuring these
                entities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CharacterEditPage() {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const basePath = useStudioBasePath();
  const { showNotification } = useApp();
  const { characterData, characterList, contentType } = useGeneratorState();
  const { setCharacterList } = useGeneratorDispatch();

  // Prefer characterList for both read AND write so setCharacterList always updates the right state.
  // Fall back to characterData.characters only when characterList is empty (e.g. first load from API).
  const displayCast =
    characterList && characterList.length > 0
      ? characterList
      : characterData?.characters || [];
  const characterIndex = displayCast.findIndex(
    (c: any) => c.name === characterName,
  );
  const character = characterIndex !== -1 ? displayCast[characterIndex] : null;

  const toText = (value: unknown, fallback = ""): string => {
    if (typeof value === "string") return value;
    if (value == null) return fallback;
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
        .join(", ");
    }
    if (typeof value === "object") {
      return Object.entries(value as Record<string, unknown>)
        .map(
          ([key, val]) =>
            `${key}: ${typeof val === "string" ? val : JSON.stringify(val)}`,
        )
        .join("\n");
    }
    return String(value);
  };

  const normalizeCharData = (char: any) => {
    if (!char) return null;
    return {
      ...char,
      appearance: toText(char.appearance),
      speakingStyle_text: toText(char.speakingStyle), // Keep original logic for legacy
      secret: toText(
        char.secret || (Array.isArray(char.secrets) ? char.secrets[0] : ""),
      ),
      goal: toText(char.goal),
      conflict: toText(char.conflict),
      flaw: toText(char.flaw),
      // Production Deep Fields
      cameraChoreography: toText(char.powerSystem?.cameraChoreography),
      moralDilemma: toText(char.narrative?.arcRoadmap?.moralDilemma),
      vfxSignature: toText(char.technicalModel?.vfxSignature),
      groupEtiquette: toText(
        char.worldAlignment?.socialDynamics?.groupEtiquette,
      ),
    };
  };

  const [formData, setFormData] = React.useState(() =>
    normalizeCharData(character),
  );

  if (!character || !formData) {
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
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    // Re-resolve from the live displayCast to avoid any stale closure issues
    const liveList = [...displayCast];
    const liveIndex = liveList.findIndex((c: any) => c.name === characterName);
    const baseChar = liveIndex !== -1 ? liveList[liveIndex] : character;

    const updatedChar = {
      ...baseChar,
      ...formData,
      // Merge flat form fields back into proper nested sub-objects
      powerSystem: {
        ...baseChar.powerSystem,
        cameraChoreography: formData.cameraChoreography,
      },
      narrative: {
        ...baseChar.narrative,
        arcRoadmap: {
          ...baseChar.narrative?.arcRoadmap,
          moralDilemma: formData.moralDilemma,
        },
      },
      technicalModel: {
        ...baseChar.technicalModel,
        vfxSignature: formData.vfxSignature,
      },
      worldAlignment: {
        ...baseChar.worldAlignment,
        socialDynamics: {
          ...baseChar.worldAlignment?.socialDynamics,
          groupEtiquette: formData.groupEtiquette,
        },
      },
    };

    if (liveIndex !== -1) {
      liveList[liveIndex] = updatedChar;
    } else {
      liveList.push(updatedChar);
    }
    setCharacterList(liveList);
    showNotification(
      `Character DNA for ${formData.name} successfully updated & synced.`,
      "success",
    );
    navigate(
      `${basePath}/cast/characters/${encodeURIComponent(formData.name)}`,
    );
  };

  const handleDelete = () => {
    const liveList = displayCast.filter((c: any) => c.name !== characterName);
    setCharacterList(liveList);
    showNotification(
      `Character ${characterName} dissolved and purged from production manifest.`,
      "warning",
    );
    navigate(`${basePath}/cast`);
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Cancel Edits
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all font-black uppercase tracking-widest text-xs px-6 h-10 rounded-xl"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Character
          </Button>
          <Button
            onClick={handleSave}
            className="bg-studio text-black hover:bg-studio/80 transition-all font-black uppercase tracking-widest text-xs px-8 h-10 rounded-xl shadow-studio"
          >
            <Save className="w-3.5 h-3.5 mr-2" /> Save Character DNA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Identity */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                Core Identity
              </h2>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                Base Soul Parameters
              </p>
            </div>

            <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                    Display Name
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-black/60 border-zinc-800 h-12 text-lg font-bold text-white focus:border-studio/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                    Archetype
                  </Label>
                  <Input
                    value={formData.archetype}
                    onChange={(e) =>
                      setFormData({ ...formData, archetype: e.target.value })
                    }
                    className="bg-black/60 border-zinc-800 h-10 text-studio font-black uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                    Personality Traits
                  </Label>
                  <Input
                    value={formData.personality}
                    onChange={(e) =>
                      setFormData({ ...formData, personality: e.target.value })
                    }
                    className="bg-black/60 border-zinc-800 h-10 text-fuchsia-400 font-bold"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                Visual DNA
              </h2>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                Aesthetic Specification
              </p>
            </div>
            <Card className="p-8 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                  Appearance Details
                </Label>
                <Textarea
                  value={formData.appearance}
                  onChange={(e) =>
                    setFormData({ ...formData, appearance: e.target.value })
                  }
                  className="bg-black/60 border-zinc-800 min-h-[150px] text-xs leading-relaxed text-zinc-400"
                  placeholder="Describe the character's visual features..."
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Narrative & Motivation */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              Narrative Logic
            </h2>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">
              Psychological and Strategic Drivers
            </p>
          </div>

          <Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-md space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-studio" />
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                    Core Objective (Goal)
                  </Label>
                </div>
                <Textarea
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="bg-black/60 border-zinc-800 min-h-[120px] text-sm italic font-medium text-zinc-300"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skull className="w-4 h-4 text-fuchsia-500" />
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                    Genetic Flaw
                  </Label>
                </div>
                <Textarea
                  value={formData.flaw}
                  onChange={(e) =>
                    setFormData({ ...formData, flaw: e.target.value })
                  }
                  className="bg-black/60 border-zinc-800 min-h-[120px] text-sm italic font-medium text-zinc-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-studio" />
                <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                  Narrative Conflict
                </Label>
              </div>
              <Textarea
                value={formData.conflict}
                onChange={(e) =>
                  setFormData({ ...formData, conflict: e.target.value })
                }
                className="bg-black/60 border-zinc-800 min-h-[100px] text-sm leading-relaxed text-zinc-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-studio" />
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                    Speaking Protocol & Rhythm
                  </Label>
                </div>
                <Input
                  value={formData.speakingStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, speakingStyle: e.target.value })
                  }
                  className="bg-black/60 border-zinc-800 h-12 text-sm italic"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-orange-500" />
                  <Label className="text-xs font-black uppercase text-zinc-500 tracking-widest">
                    Hidden Secret
                  </Label>
                </div>
                <Input
                  value={formData.secret}
                  onChange={(e) =>
                    setFormData({ ...formData, secret: e.target.value })
                  }
                  className="bg-orange-500/5 border-orange-500/20 h-12 text-sm text-orange-400 font-bold uppercase tracking-widest"
                />
              </div>
            </div>

            {/* Advanced Production Data */}
            <div className="space-y-8 pt-8 border-t border-white/5">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                  Advanced Production DNA
                </h3>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest italic">
                  Directorial and Technical Specifications
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-red-500/60 tracking-widest">
                    Camera Choreography
                  </Label>
                  <Textarea
                    value={formData.cameraChoreography}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cameraChoreography: e.target.value,
                      })
                    }
                    className="bg-black/40 border-zinc-800 min-h-[80px] text-xs italic"
                    placeholder="Tracking, static, or kinetic camera notes..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-fuchsia-500/60 tracking-widest">
                    Moral Dilemma
                  </Label>
                  <Textarea
                    value={formData.moralDilemma}
                    onChange={(e) =>
                      setFormData({ ...formData, moralDilemma: e.target.value })
                    }
                    className="bg-black/40 border-zinc-800 min-h-[80px] text-xs italic"
                    placeholder="The character's core narrative conflict..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-indigo-500/60 tracking-widest">
                    VFX Signature
                  </Label>
                  <Textarea
                    value={formData.vfxSignature}
                    onChange={(e) =>
                      setFormData({ ...formData, vfxSignature: e.target.value })
                    }
                    className="bg-black/40 border-zinc-800 min-h-[80px] text-xs italic"
                    placeholder="Particles, lighting, or distortion effects..."
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


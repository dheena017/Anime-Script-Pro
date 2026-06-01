import React from "react";
import {
  Plus,
  ArrowRight,
  Users,
  Heart,
  Swords,
  Shield,
  Zap,
  Lock,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { generateRelationships } from "@/services/api/gemini";

interface Connection {
  id: string;
  source: string;
  target: string;
  type: "Ally" | "Rival" | "Enemy" | "Love" | "Secret" | "Master/Apprentice";
  tension: number; // 1-10
  description: string;
}

import { RelationshipMatrix } from "./RelationshipMatrix";
import { RelationshipCard } from "./RelationshipCard";

export function RelationshipLab() {
  const {
    characterRelationships,
    prompt,
    selectedModel,
    contentType,
    characterList,
  } = useGeneratorState();
  const { setCharacterRelationships } = useGeneratorDispatch();
  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [newConn, setNewConn] = React.useState<Partial<Connection>>({
    type: "Ally",
    tension: 5,
  });
  const [viewMode, setViewMode] = React.useState<"list" | "matrix">("list");
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleAISynthesis = async () => {
    if (!prompt || !characterList || characterList.length === 0) return;
    setIsGenerating(true);

    const castNames = characterList.map((c) => c.name).join(", ");
    const results = await generateRelationships(
      prompt,
      castNames,
      selectedModel,
      contentType,
    );

    if (results && Array.isArray(results)) {
      const withIds = results.map((r, idx) => {
        if (r.id) return r;
        return {
          ...r,
          id: `rel-${Date.now()}-${idx}`,
        };
      });
      setConnections(withIds as any);
      setCharacterRelationships(JSON.stringify(withIds));
    }

    setIsGenerating(false);
  };

  // Sync from global context
  React.useEffect(() => {
    if (characterRelationships) {
      try {
        const parsed = JSON.parse(characterRelationships);
        if (Array.isArray(parsed)) {
          setConnections(parsed);
        }
      } catch (e) {
        console.warn("Relationship data is not JSON, might be legacy format.");
      }
    }
  }, [characterRelationships]);

  const addConnection = () => {
    if (!newConn.source || !newConn.target) return;
    const conn: Connection = {
      id: `rel-manual-${Date.now()}`,
      source: newConn.source,
      target: newConn.target,
      type: newConn.type as any,
      tension: newConn.tension || 5,
      description: newConn.description || "",
    };
    const updated = [...connections, conn];
    setConnections(updated);
    setNewConn({ type: "Ally", tension: 5 });
    setCharacterRelationships(JSON.stringify(updated));
  };

  const removeConnection = (id: string) => {
    const updated = connections.filter((c) => c.id !== id);
    setConnections(updated);
    setCharacterRelationships(JSON.stringify(updated));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Ally":
        return <Shield className="w-4 h-4 text-emerald-500" />;
      case "Rival":
        return <Zap className="w-4 h-4 text-orange-500" />;
      case "Enemy":
        return <Swords className="w-4 h-4 text-red-500" />;
      case "Love":
        return <Heart className="w-4 h-4 text-fuchsia-500" />;
      case "Secret":
        return <Lock className="w-4 h-4 text-zinc-500" />;
      default:
        return <Users className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full text-xs uppercase tracking-[0.3em] text-fuchsia-400 font-bold shadow-[0_0_15px_rgba(217,70,239,0.2)]">
          Social Architecture Matrix
        </div>
        <h1 className="text-2xl font-black text-cyan-50 leading-tight uppercase tracking-tighter">
          Relationship <span className="text-fuchsia-600">Lab</span>
        </h1>
        <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
          Engineering the emotional friction and tactical alliances that drive
          your plot.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Button
            onClick={handleAISynthesis}
            disabled={isGenerating || !prompt}
            className="bg-[#050505] hover:bg-zinc-900 border border-fuchsia-500/30 text-fuchsia-500 font-black tracking-[0.2em] text-xs h-12 px-10 rounded-full shadow-[0_0_20px_rgba(217,70,239,0.1)] hover:shadow-[0_0_30px_rgba(217,70,239,0.2)] transition-all gap-3 group"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 group-hover:scale-125 transition-transform" />
            )}
            SYNC SOCIAL MATRIX
          </Button>
          <Button
            onClick={handleAISynthesis}
            disabled={isGenerating || !prompt}
            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black tracking-[0.2em] text-xs h-12 px-10 rounded-full shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-all gap-3 group"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
            )}
            NEURAL RE-GENERATE
          </Button>
        </div>
      </div>

      <Card className="bg-[#0a0a0a]/80 border-fuchsia-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
          <Users className="w-32 h-32 text-fuchsia-500" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">
              Member A
            </label>
            <select
              value={newConn.source || ""}
              onChange={(e) =>
                setNewConn({ ...newConn, source: e.target.value })
              }
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl h-12 px-3 text-zinc-100 focus:border-fuchsia-500/50 focus:outline-none transition-all appearance-none"
            >
              <option value="" disabled>
                Select Character A
              </option>
              {characterList?.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center pb-3">
            <ArrowRight className="text-zinc-800" />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">
              Identity B
            </label>
            <select
              value={newConn.target || ""}
              onChange={(e) =>
                setNewConn({ ...newConn, target: e.target.value })
              }
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl h-12 px-3 text-zinc-100 focus:border-fuchsia-500/50 focus:outline-none transition-all appearance-none"
            >
              <option value="" disabled>
                Select Character B
              </option>
              {characterList?.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-[2] space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">
              Dynamic Complexity
            </label>
            <Input
              placeholder="Define the friction or alliance..."
              value={newConn.description || ""}
              onChange={(e) =>
                setNewConn({ ...newConn, description: e.target.value })
              }
              className="bg-zinc-950/50 border-zinc-800 rounded-xl h-12 text-zinc-100 focus:border-fuchsia-500/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex gap-2">
            {["Ally", "Rival", "Enemy", "Love", "Secret"].map((type) => (
              <button
                key={type}
                onClick={() => setNewConn({ ...newConn, type: type as any })}
                className={cn(
                  "flex-1 h-12 rounded-xl flex items-center justify-center border transition-all",
                  newConn.type === type
                    ? "bg-fuchsia-600/20 border-fuchsia-500/50 text-fuchsia-400"
                    : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700",
                )}
              >
                {getTypeIcon(type)}
              </button>
            ))}
          </div>
          <Button
            onClick={addConnection}
            className="h-12 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black tracking-widest rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all"
          >
            <Plus className="w-5 h-5 mr-3" /> REGISTER CONNECTION
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
          <div className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Users className="w-4 h-4" /> ACTIVE THREADS: {connections.length}
          </div>
          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all",
                viewMode === "list"
                  ? "bg-fuchsia-600 text-white shadow-lg"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              className={cn(
                "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all",
                viewMode === "matrix"
                  ? "bg-fuchsia-600 text-white shadow-lg"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              Matrix Grid
            </button>
          </div>
        </div>

        {viewMode === "matrix" ? (
          <RelationshipMatrix />
        ) : (
          <div className="space-y-4">
            {connections.map((conn) => (
              <RelationshipCard
                key={conn.id}
                connection={conn as any}
                onRemove={removeConnection}
              />
            ))}

            {connections.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-zinc-900 rounded-[2rem] opacity-20 group hover:opacity-100 transition-opacity">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600">
                  No active social threads found
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

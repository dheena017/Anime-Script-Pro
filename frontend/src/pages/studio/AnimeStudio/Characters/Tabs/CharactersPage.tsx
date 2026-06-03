import { useNavigate } from "react-router-dom";
import {
  Plus,
  ListFilter,
  Search,
  Layout as LayoutGrid,
  List,
  User,
  Camera,
} from "lucide-react";
import { useGeneratorState, useGeneratorDispatch } from "@/hooks/useGenerator";
import { useStudioBasePath } from "@/hooks/useStudioBasePath";
import { StudioEditor } from "../../components/StudioEditor";
import { useContext } from "react";
import { CharacterPageContext } from "../CharactersLayout";
import { cn } from "@/lib/utils";
import { CharacterCard } from "../components/CharacterCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudioEmptyState } from "@/pages/studio/components/studio/shared/StudioEmptyState";

export default function CharactersPage() {
  const navigate = useNavigate();
  const basePath = useStudioBasePath();
  const { characterList, isEditing, contentType, generatedCharacters } =
    useGeneratorState();
  const {
    setCharacterList,
    setIsEditing,
    setGeneratedCharacters,
    showNotification: notify,
  } = useGeneratorDispatch();
  const { viewMode = "grid", searchQuery = "" } = useContext(CharacterPageContext);

  const displayCast = (characterList || []).filter((char: any) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    const nameMatch = char.name?.toLowerCase().includes(lowerQuery);
    const roleMatch = char.archetype?.toLowerCase().includes(lowerQuery) || char.role?.toLowerCase().includes(lowerQuery);
    return nameMatch || roleMatch;
  });

  const handleUpdateCharacter = (index: number, updates: any) => {
    const newList = [...displayCast];
    newList[index] = { ...newList[index], ...updates };
    setCharacterList(newList);
  };

  if (displayCast.length === 0) {
    return (
      <StudioEmptyState
        icon={User}
        title="Manifest Empty"
        description="No character manifest exists yet. Start by adding a lead to build your cast lineup."
        features={[
          {
            icon: Camera,
            title: "Visual DNA",
            description: "Prepare image prompts and style metadata",
          },
          {
            icon: ListFilter,
            title: "Manifest Filters",
            description: "Enable role-based cast segmentation",
          },
          {
            icon: Plus,
            title: "Rapid Expansion",
            description: "Scale from lead to full ensemble quickly",
          },
        ]}
        accentColor="cyan"
      />
    );
  }

  return (
    <div className="space-y-8 pb-20">


      {/* Characters List - Responsive Layout */}
      {isEditing ? (
        <StudioEditor
          content={generatedCharacters || ""}
          onContentChange={(val) => setGeneratedCharacters?.(val)}
          isEditing={isEditing}
          placeholder="Edit your character manifest here in markdown format..."
        />
      ) : (
        <div
          className={cn(
            "relative z-10",
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
              : "flex flex-col gap-6",
          )}
        >
          {displayCast.length > 0 ? (
            displayCast.map((char: any, idx: number) => (
              <CharacterCard
                key={idx}
                character={char}
                index={idx}
                isEditing={isEditing}
                onUpdate={(updates) => handleUpdateCharacter(idx, updates)}
                onViewCharacter={(charName) => {
                  navigate(`${basePath}/cast/characters/${charName}`);
                }}
              />
            ))
          ) : (
            <div className="col-span-full h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[3rem] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                <User className="w-8 h-8 text-zinc-700" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-bold uppercase tracking-widest text-sm">
                  No Cast Members Detected
                </p>
                <p className="text-zinc-600 text-xs">
                  Initialize your character synthesis to begin sequencing the
                  cast.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

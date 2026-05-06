import { ProfileLibrary } from '../../profile/ProfileLibrary';

interface LibraryTabProps {
  savedPrompts: any[];
  characters: any[];
  onAddPrompt: () => void;
  onAddDNA: () => void;
}

export function LibraryTab({ savedPrompts, characters, onAddPrompt, onAddDNA }: LibraryTabProps) {
  return (
    <ProfileLibrary
      savedPrompts={savedPrompts}
      characters={characters}
      onAddPrompt={onAddPrompt}
      onAddDNA={onAddDNA}
    />
  );
}
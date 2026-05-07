import React from 'react';
import { 
  User,
} from 'lucide-react';
import { StudioEditor } from '../../components/StudioEditor';
import { useGenerator } from '@/hooks/useGenerator';
import { CastCard } from './CastCard';
import { CastEmptyState } from './CastEmptyState';
import { CastContext } from '../CastLayout';

interface CastViewProps {
  onViewCharacter?: (charName: string) => void;
}

export const CastView: React.FC<CastViewProps> = ({ 
  onViewCharacter,
}) => {
  const { handleLoadDemo } = React.useContext(CastContext);
  const { 
    castList, 
    setCastList,
    generatedCharacters,
    setGeneratedCharacters,
    isEditing,
    isGeneratingCharacters
  } = useGenerator();
  

  const handleUpdateCharacter = (index: number, updates: any) => {
    const newList = [...(castList || [])];
    newList[index] = { ...newList[index], ...updates };
    setCastList(newList);
  };

  if (!castList || castList.length === 0) {
    return (
      <CastEmptyState
        onLaunch={() => {
          window.dispatchEvent(new CustomEvent('studio-generate-cast'));
        }}
        onLoadDemo={handleLoadDemo}
        isGenerating={isGeneratingCharacters}
      />
    );
  }

  return (
    <div className="space-y-8">

      {isEditing ? (
        <StudioEditor
          content={generatedCharacters || ''}
          onContentChange={(val) => setGeneratedCharacters?.(val)}
          isEditing={isEditing}
          placeholder="Edit your character manifest here in markdown format..."
        />
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {castList && castList.length > 0 ? (
            castList.map((char, idx) => (
              <CastCard
                key={idx}
                character={char}
                index={idx}
                isEditing={isEditing}
                onUpdate={(updates) => handleUpdateCharacter(idx, updates)}
                onViewCharacter={onViewCharacter}
              />
            ))
          ) : (
            <div className="col-span-full h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <User className="w-8 h-8 text-zinc-700" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-black uppercase tracking-widest text-[10px]">No Cast Members Detected</p>
                <p className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">Initialize synthesis to begin sequencing.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

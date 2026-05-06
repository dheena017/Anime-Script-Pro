import React from 'react';
import { 
  Search, 
  Layout as LayoutGrid, 
  List, 
  User,
} from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';
import { CastCard } from './CastCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CastEmptyState } from './CastEmptyState';
import { CastContext } from '../CastLayout';

interface CastViewProps {
  onViewCharacter?: (charName: string) => void;
  viewMode?: 'grid' | 'list';
}

export const CastView: React.FC<CastViewProps> = ({ 
  onViewCharacter,
  viewMode: externalViewMode 
}) => {
  const { handleLoadDemo } = React.useContext(CastContext);
  const { 
    castList, 
    setCastList,
    isEditing,
    setIsEditing,
    isGeneratingCharacters
  } = useGenerator();
  
  const [internalViewMode, setInternalViewMode] = React.useState<'grid' | 'list'>('grid');
  const viewMode = externalViewMode || internalViewMode;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setInternalViewMode('grid')}
              className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'grid' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setInternalViewMode('list')}
              className={cn("w-9 h-9 rounded-lg transition-all", viewMode === 'list' ? "bg-studio text-black hover:bg-studio" : "text-zinc-500 hover:text-white")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <Button
            variant="outline"
            className={cn(
              "h-10 px-6 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all duration-300",
              isEditing ? "bg-studio text-black border-studio shadow-studio" : "bg-white/5 border-white/10 text-zinc-400 hover:text-studio hover:border-studio/30"
            )}
            onClick={() => setIsEditing?.(!isEditing)}
          >
            {isEditing ? "Save Cast Bios" : "Custom Manual Edit"}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <Input 
              placeholder="Search registry..." 
              className="h-10 w-64 pl-10 bg-black/40 border-white/5 text-[10px] uppercase tracking-widest font-bold focus:border-studio/50"
            />
          </div>
        </div>
      </div>

      <div className={cn(
        "grid gap-8",
        viewMode === 'grid' ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      )}>
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
    </div>
  );
};

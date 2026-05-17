import React from 'react';
import { 
  User, Sparkles, ScrollText, UserCircle
} from 'lucide-react';
import { StudioEditor } from '../../components/StudioEditor';
import { useGeneratorState, useGeneratorDispatch } from '@/hooks/useGenerator';
import { CastCard } from './CastCard';
import { CastEmptyState } from './CastEmptyState';
import { CastContext } from '../CastLayout';
import { castStyles as s } from '../castStyles';
import { motion } from 'framer-motion';

interface CastViewProps {
  onViewCharacter?: (charName: string) => void;
  viewMode?: 'list' | 'grid';
}

export const CastView: React.FC<CastViewProps> = ({ 
  onViewCharacter,
}) => {
  const { handleLoadDemo } = React.useContext(CastContext);
  const { 
    castList, 
    generatedCharacters,
    isEditing,
    isGeneratingCharacters
  } = useGeneratorState();
  const { setCastList, setGeneratedCharacters } = useGeneratorDispatch();
  
  const handleUpdateCharacter = (index: number, updates: any) => {
    const newList = [...(castList || [])];
    newList[index] = { ...newList[index], ...updates };
    setCastList(newList);
  };

  const scrollToChar = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    <div className={s.content.container}>
      {isEditing ? (
        <StudioEditor
          content={generatedCharacters || ''}
          onContentChange={(val) => setGeneratedCharacters?.(val)}
          isEditing={isEditing}
          placeholder="Edit your character manifest here in markdown format..."
        />
      ) : (
        <div className={s.content.contentArea}>
          <div className={s.content.mainColumn}>
            <div className="grid grid-cols-1 gap-8">
              {castList.map((char, idx) => (
                <div key={idx} id={`char-${idx}`}>
                  <CastCard
                    character={char}
                    index={idx}
                    isEditing={isEditing}
                    onUpdate={(updates) => handleUpdateCharacter(idx, updates)}
                    onViewCharacter={onViewCharacter}
                  />
                </div>
              ))}
            </div>
          </div>

          <aside className={s.content.sidebar + " space-y-6"}>
             <div className={s.content.sidebarCard}>
                <div className={s.content.sidebarGlow + " bg-fuchsia-500/5 group-hover:bg-fuchsia-500/10"} />
                <div className={s.content.sidebarContent}>
                  <h4 className={s.content.sidebarTitle}>
                    <Sparkles className="w-3 h-3 text-fuchsia-400" /> Cast Matrix
                  </h4>
                  <div className="flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-zinc-600 uppercase">Total Entities</span>
                        <span className="text-xs font-black text-white">{castList.length}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-zinc-600 uppercase">Registry Status</span>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Synced</span>
                     </div>
                  </div>
                </div>
             </div>

             <div className="space-y-4">
                <h5 className={s.content.sidebarTitle}>
                  <ScrollText className="w-3 h-3" /> Quick Navigation
                </h5>
                <nav className="space-y-2">
                   {castList.map((char, i) => (
                     <motion.button
                       key={i}
                       whileHover={{ x: 4 }}
                       onClick={() => scrollToChar(`char-${i}`)}
                       className="w-full flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-fuchsia-500/30 transition-all text-left group"
                     >
                        <UserCircle className="w-3 h-3 text-zinc-600 group-hover:text-fuchsia-400 transition-colors" />
                        <span className="text-[10px] font-black text-zinc-500 group-hover:text-zinc-200 uppercase tracking-tight truncate">
                          {char.name}
                        </span>
                     </motion.button>
                   ))}
                </nav>
             </div>

             <p className={s.content.sidebarNote}>
               Use the registry matrix to jump between key characters and verify narrative consistency.
             </p>
          </aside>
        </div>
      )}
    </div>
  );
};

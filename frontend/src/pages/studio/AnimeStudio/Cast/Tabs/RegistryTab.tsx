import React from 'react';
import { CastView } from '../components/CastView';

interface RegistryTabProps {
  onViewCharacter?: (charName: string) => void;
  viewMode?: 'grid' | 'list';
}

export const RegistryTab: React.FC<RegistryTabProps> = ({ onViewCharacter, viewMode }) => {
  return <CastView onViewCharacter={onViewCharacter} viewMode={viewMode} />;
};




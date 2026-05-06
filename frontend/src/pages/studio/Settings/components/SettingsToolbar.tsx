import React from 'react';
import { Save, RotateCcw } from 'lucide-react';

interface SettingsToolbarProps {
  onSave: () => void;
  onReset: () => void;
  isDirty?: boolean;
}

export const SettingsToolbar: React.FC<SettingsToolbarProps> = ({ onSave, onReset, isDirty = true }) => {
  return (
    <div className="p-4 border-b border-white/5 bg-black/20 flex justify-end gap-3">
      <button onClick={onReset} className="px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors">
        <RotateCcw className="w-4 h-4" /> Reset Defaults
      </button>
      <button onClick={onSave} disabled={!isDirty} className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${isDirty ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
        <Save className="w-4 h-4" /> Save Changes
      </button>
    </div>
  );
};

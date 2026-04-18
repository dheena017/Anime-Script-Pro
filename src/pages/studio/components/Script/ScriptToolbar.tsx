import React from 'react';
import { Download, Save, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScriptToolbarProps {
  generatedScript: string | null;
  exportToPDF: () => void;
  isEditing: boolean;
  setIsEditing: (e: boolean) => void;
  isSaving: boolean;
  handleSaveScript: () => void;
}

export const ScriptToolbar: React.FC<ScriptToolbarProps> = ({
  generatedScript,
  exportToPDF,
  isEditing,
  setIsEditing,
  isSaving,
  handleSaveScript
}) => {
  if (!generatedScript) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 h-8 px-3"
        onClick={exportToPDF}
      >
        <Download className="w-4 h-4 mr-2" />
        PDF
      </Button>
      {isEditing && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-zinc-500 hover:text-zinc-300 h-8"
          onClick={() => setIsEditing(false)}
          disabled={isSaving}
        >
          Cancel
        </Button>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        className={`border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 h-8 px-3 ${isEditing ? 'text-cyan-400 border-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/30'}`}
        onClick={() => {
          if (isEditing) {
            handleSaveScript();
          } else {
            setIsEditing(true);
          }
        }}
        disabled={isSaving}
      >
        {isSaving ? (
          <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mr-2" />
        ) : (
          isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />
        )}
        {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Script')}
      </Button>
    </div>
  );
};

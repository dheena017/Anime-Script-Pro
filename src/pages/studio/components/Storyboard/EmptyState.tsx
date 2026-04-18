import React from 'react';
import { Layout, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  handleAddScene: () => void;
  handleLoadDemo: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ handleAddScene, handleLoadDemo }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-zinc-600">
      <Layout className="w-12 h-12 mb-4 opacity-20" />
      <p className="mb-6">Generate a script with a table to see the storyboard.</p>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
          onClick={handleAddScene}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add First Scene
        </Button>
        <Button 
          variant="ghost" 
          className="text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5"
          onClick={handleLoadDemo}
        >
          <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
          Load Example Scene
        </Button>
      </div>
    </div>
  );
};

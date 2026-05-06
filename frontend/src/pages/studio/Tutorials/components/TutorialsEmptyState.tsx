import React from 'react';
import { BookOpen } from 'lucide-react';

export const TutorialsEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-black/20 text-center">
      <BookOpen className="w-12 h-12 text-white/20 mb-4" />
      <h3 className="text-xl font-bold text-white/80 mb-2">No Tutorials Found</h3>
      <p className="text-sm text-white/50 max-w-md">We couldn't find any lessons matching your current filters. Try adjusting your search criteria or explore other categories.</p>
    </div>
  );
};

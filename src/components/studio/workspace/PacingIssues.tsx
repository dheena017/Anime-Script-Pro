import React from 'react';
import { Button } from '@/components/ui/button';

interface PacingIssue {
  type: string;
  issue: string;
  suggestion: string;
  segment: string;
}

interface PacingIssuesProps {
  issues: PacingIssue[];
  onFindInScript: (segment: string) => void;
  onClear: () => void;
}

export function PacingIssues({ issues, onFindInScript, onClear }: PacingIssuesProps) {
  if (issues.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {issues.map((issue, idx) => (
        <div key={idx} className={`p-4 rounded-xl border ${issue.type === 'dragging' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase tracking-widest ${issue.type === 'dragging' ? 'text-amber-500' : 'text-blue-500'}`}>
              {issue.type === 'dragging' ? 'Dragging' : 'Rushing'}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-[8px] uppercase font-black"
              onClick={() => onFindInScript(issue.segment)}
            >
              Find in Script
            </Button>
          </div>
          <p className="text-xs font-bold text-zinc-300 mb-1">{issue.issue}</p>
          <p className="text-[11px] text-zinc-500 italic mt-2 border-t border-white/5 pt-2">
             <span className="text-zinc-400 font-bold not-italic">Suggestion:</span> {issue.suggestion}
          </p>
        </div>
      ))}
      <div className="md:col-span-2">
         <Button 
          variant="ghost" 
          className="w-full text-zinc-600 text-[10px] uppercase font-black tracking-widest h-8"
          onClick={onClear}
         >
           Clear Analysis
         </Button>
      </div>
    </div>
  );
}

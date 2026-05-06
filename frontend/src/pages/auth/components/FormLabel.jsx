import React from 'react';
import { Label } from "@/components/ui/label";

export function FormLabel({ htmlFor, children, className = "", rightElement = null }) {
  return (
    <div className="flex items-center justify-between ml-1">
      <Label htmlFor={htmlFor} className={`text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-black ${className}`}>
        {children}
      </Label>
      {rightElement}
    </div>
  );
}

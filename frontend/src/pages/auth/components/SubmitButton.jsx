import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export function SubmitButton({ loading, children }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-studio hover:bg-studio/90 text-white font-black uppercase tracking-[0.2em] h-12 rounded-xl shadow-[0_10px_30px_rgba(220,38,38,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
    >
      {loading ? 'Synchronizing...' : children} 
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
}

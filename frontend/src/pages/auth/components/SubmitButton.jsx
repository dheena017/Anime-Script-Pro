import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export function SubmitButton({ loading, children }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-studio hover:bg-studio/90 text-white font-black uppercase tracking-[0.3em] text-[11px] h-14 rounded-xl shadow-[0_10px_40px_-10px_rgba(6,182,212,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10">{loading ? 'ESTABLISHING LINK...' : children}</span>
      {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />}
    </Button>
  );
}

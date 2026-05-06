import React from 'react';
import { Button } from "@/components/ui/button";

export function SocialLoginButton({ icon: Icon, children, onClick = undefined }) {
  return (
    <Button 
      type="button"
      variant="outline" 
      onClick={onClick}
      className="h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </Button>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu } from 'lucide-react';

export function AuthCard({ children, title = "Secure Login", description = "Enter your credentials below" }) {
  return (
    <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2.5rem]">
      {/* Top Scanner Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-studio to-transparent shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
      
      <CardHeader className="space-y-6 pb-8 pt-12 text-center relative">
         <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.1)] relative group">
            <div className="absolute inset-0 bg-studio/5 rounded-2xl animate-ping opacity-50" />
            <Cpu className="h-8 w-8 text-studio drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]" />
         </div>

        <div className="space-y-2">
          <CardTitle className="text-3xl font-black tracking-tighter text-white uppercase italic">
            {title.split(' ').map((word, i, arr) => (
               <React.Fragment key={i}>
                 {i === arr.length - 1 ? <span className="text-studio">{word}</span> : word + " "}
               </React.Fragment>
            ))}
          </CardTitle>
          <CardDescription className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[9px]">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-10 pb-12">
        {children}
      </CardContent>
    </Card>
  );
}

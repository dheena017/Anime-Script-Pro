import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Heart, 
  Swords, 
  Shield, 
  Zap, 
  Lock,
  Minus
} from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

export const RelationshipMatrix = React.memo(() => {
  const { characterRelationships, castProfiles, castList, castData } = useGenerator();
  
  // Extract character names from castList or fallback to castProfiles
  const characterNames = React.useMemo(() => {
    if (castList && castList.length > 0) {
      return castList.map(c => c.name).slice(0, 8);
    }
    
    if (!castProfiles) return [];
    const names = new Set<string>();
    const lines = castProfiles.split('\n');
    lines.forEach((line: string) => {
      const match = line.match(/^\d*\.?\s*\*\*?([^*]+)\*\*?/);
      if (match) names.add(match[1].trim());
      else if (line.includes(':')) {
        const potentialName = line.split(':')[0].trim();
        if (potentialName.length < 20 && potentialName.length > 2) names.add(potentialName);
      }
    });
    return Array.from(names).slice(0, 8);
  }, [castList, castProfiles]);

  // Parse relationships from structured data or fallback to string searching
  const relationsMap = React.useMemo(() => {
    const map: Record<string, any> = {};

    // Prioritize structured data from castData
    if (castData?.relationships && Array.isArray(castData.relationships)) {
      castData.relationships.forEach((rel: any) => {
        const key = [rel.source, rel.target].sort().join('-');
        map[key] = { type: rel.type, description: rel.description };
      });
      return map;
    }

    // Secondary priority: JSON parse characterRelationships if it looks like JSON
    if (characterRelationships) {
      try {
        const parsed = JSON.parse(characterRelationships);
        if (Array.isArray(parsed)) {
          parsed.forEach((rel: any) => {
            const key = [rel.source, rel.target].sort().join('-');
            map[key] = { type: rel.type, description: rel.description };
          });
          return map;
        }
      } catch (e) {
        // Not JSON, continue to string parsing
      }

      // Final fallback: string searching
      const lines = characterRelationships.split('\n');
      lines.forEach(line => {
        characterNames.forEach(nameA => {
          characterNames.forEach(nameB => {
            if (nameA === nameB) return;
            const key = [nameA, nameB].sort().join('-');
            if (line.toLowerCase().includes(nameA.toLowerCase()) && line.toLowerCase().includes(nameB.toLowerCase())) {
              let type = 'Neutral';
              if (line.includes('Ally')) type = 'Ally';
              else if (line.includes('Rival')) type = 'Rival';
              else if (line.includes('Enemy')) type = 'Enemy';
              else if (line.includes('Love')) type = 'Love';
              else if (line.includes('Secret')) type = 'Secret';
              else if (line.includes('Familial')) type = 'Familial';
              else if (line.includes('Betrayal')) type = 'Betrayal';
              else if (line.includes('Stalker')) type = 'Stalker';
              else if (line.includes('Apprentice') || line.includes('Master')) type = 'Master/Apprentice';
              
              map[key] = { type, description: line };
            }
          });
        });
      });
    }
    return map;
  }, [characterRelationships, characterNames, castData]);

  const getRelationIcon = (type: string) => {
    switch (type) {
      case 'Ally': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'Rival': return <Zap className="w-5 h-5 text-orange-400" />;
      case 'Enemy': return <Swords className="w-5 h-5 text-red-500" />;
      case 'Love': return <Heart className="w-5 h-5 text-fuchsia-400" />;
      case 'Secret': return <Lock className="w-5 h-5 text-zinc-500" />;
      case 'Familial': return <Users className="w-5 h-5 text-blue-400" />;
      case 'Betrayal': return <Minus className="w-5 h-5 text-amber-600 rotate-45" />;
      case 'Stalker': return <Zap className="w-5 h-5 text-purple-600 animate-pulse" />;
      default: return <Minus className="w-4 h-4 text-zinc-800" />;
    }
  };

  if (characterNames.length === 0) {
    return (
      <div className="p-12 text-center rounded-[2rem] border-2 border-dashed border-zinc-900 opacity-30">
        <Users className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Identity Registry Empty</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto pb-6">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[140px_repeat(8,1fr)] gap-2">
            {/* Header Spacer */}
            <div className="h-20" />
            
            {/* Top Axis */}
            {characterNames.map((name, i) => (
              <div key={i} className="h-20 flex flex-col items-center justify-end pb-4 bg-zinc-950/20 rounded-t-2xl border-x border-t border-zinc-900/50">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 rotate-[-45deg] origin-bottom-left ml-4 whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}

            {/* Matrix Rows */}
            {characterNames.map((nameA, rowIndex) => (
              <React.Fragment key={nameA}>
                {/* Side Axis */}
                <div className="h-16 flex items-center justify-end pr-6 bg-zinc-950/20 rounded-l-2xl border-y border-l border-zinc-900/50">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-50 overflow-hidden text-ellipsis whitespace-nowrap">
                    {nameA}
                  </span>
                </div>

                {/* Grid Cells */}
                {characterNames.map((nameB, colIndex) => {
                  const isSelf = nameA === nameB;
                  const key = [nameA, nameB].sort().join('-');
                  const relation = relationsMap[key];

                  return (
                    <div 
                      key={nameB} 
                      className={cn(
                        "h-16 flex items-center justify-center relative transition-all group border border-zinc-900/30",
                        isSelf ? "bg-zinc-900/40" : "bg-zinc-950/40 hover:bg-zinc-900/60",
                        rowIndex === characterNames.length - 1 && "rounded-b-none",
                        colIndex === characterNames.length - 1 && "rounded-r-none"
                      )}
                    >
                      {isSelf ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                      ) : relation ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="cursor-help"
                            >
                              {getRelationIcon(relation.type)}
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-950 border-studio text-studio p-3 max-w-xs shadow-2xl">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 underline">{relation.type}</p>
                            <p className="text-[11px] font-medium leading-relaxed italic">"{relation.description}"</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Minus className="w-4 h-4 text-zinc-800 opacity-30 group-hover:opacity-100" />
                      )}
                      
                      {/* Glow Overlay */}
                      {relation && (
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity",
                          relation.type === 'Ally' && "bg-emerald-500",
                          relation.type === 'Rival' && "bg-orange-500",
                          relation.type === 'Enemy' && "bg-red-500",
                          relation.type === 'Love' && "bg-fuchsia-500",
                          relation.type === 'Secret' && "bg-zinc-100",
                          relation.type === 'Familial' && "bg-blue-500",
                          relation.type === 'Betrayal' && "bg-amber-700",
                          relation.type === 'Stalker' && "bg-purple-900"
                        )} />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});




import { scriptStyles as s } from '../scriptStyles';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, Hash, Users, Film, Zap, ScrollText, PlayCircle, Video, Sparkles } from 'lucide-react';
import { useSceneReveal } from '@/hooks/useSceneReveal';

interface ScriptViewProps {
  generatedScript: string;
  prompt: string;
  session: string;
  episode: string;
  audience: string;
  visualData?: Record<number, string[]>;
}

// Parse scene data rows out of markdown table string
function parseSceneRows(script: string): string[][] {
  if (!script) return [];
  const lines = script.split('\n').filter(l => l.includes('|') && !l.includes('---'));
  if (lines.length < 2) return [];
  return lines.slice(1).map(l =>
    l.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
  ).filter(cells => cells.length > 0 && !isNaN(Number(cells[0])));
}

// Extract header cells from markdown table
function parseHeaderRow(script: string): string[] {
  if (!script) return [];
  const lines = script.split('\n').filter(l => l.includes('|') && !l.includes('---'));
  if (!lines.length) return [];
  return lines[0].split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
}

// Get content before and after the table
function splitScriptParts(script: string): { before: string; after: string } {
  if (!script) return { before: '', after: '' };
  const tableLines = script.split('\n').filter(l => l.includes('|'));
  if (tableLines.length === 0) {
    return { before: script.trim(), after: '' };
  }
  const tableStart = script.indexOf('|');
  const lastTableLine = tableLines[tableLines.length - 1];
  const tableEnd = script.lastIndexOf(lastTableLine) + lastTableLine.length;
  return {
    before: tableStart > 0 ? script.slice(0, tableStart).trim() : '',
    after: tableEnd < script.length ? script.slice(tableEnd).trim() : ''
  };
}

const SCENE_COL_INDEX = 4; // 0-based "Visuals" column

export const ScriptView: React.FC<ScriptViewProps> = ({
  generatedScript,
  prompt,
  session,
  episode,
  audience,
  visualData = {}
}) => {
  const scriptKey = generatedScript?.slice(0, 60) ?? null;
  const headers = React.useMemo(() => parseHeaderRow(generatedScript), [generatedScript]);
  const sceneRows = React.useMemo(() => parseSceneRows(generatedScript), [generatedScript]);
  const { before, after } = React.useMemo(() => splitScriptParts(generatedScript), [generatedScript]);

  const visibleCount = useSceneReveal(sceneRows.length, scriptKey, 130);
  const allVisible = visibleCount >= sceneRows.length;

  const scrollToScene = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Fallback: render raw markdown if we couldn't parse a table
  const hasTable = sceneRows.length > 0 && headers.length > 0;

  return (
    <div className={s.content.container}>
      <div className={s.content.contentArea}>
        <div className={s.content.mainColumn}>
          {/* Header block */}
          <div className="border-b border-zinc-800/80 pb-6 mb-12 text-center space-y-4 relative">
            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold mb-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              Official Production Script
            </div>
            <h1 className="text-4xl font-black text-white leading-tight uppercase tracking-tight">
              {prompt?.split(' ').slice(0, 5).join(' ') || 'Untitled Sequence'}
            </h1>
            <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-white/5">
                <Clapperboard className="w-3 h-3 text-blue-400" /> S{session}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-white/5">
                <Hash className="w-3 h-3 text-fuchsia-400" /> E{episode}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-white/5">
                <Users className="w-3 h-3 text-emerald-400" /> {audience}
              </span>
            </div>
          </div>

          {/* Pre-table content (intro, chapter headers etc.) */}
          {before && (
            <div className="prose prose-invert max-w-none prose-h1:text-white prose-h2:text-white prose-h3:text-white prose-strong:text-blue-400 mb-12">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{before}</ReactMarkdown>
            </div>
          )}

          {/* Scene-by-scene animated table */}
          {hasTable ? (
            <div className="w-full overflow-x-auto no-scrollbar">
              {/* Reveal progress badge */}
              <AnimatePresence>
                {!allVisible && (
                  <motion.div
                    key="reveal-badge"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit text-[10px] font-black uppercase tracking-widest text-blue-400"
                  >
                    <Film className="w-3 h-3 animate-pulse" />
                    Sequencing Scene {visibleCount} / {sceneRows.length}
                  </motion.div>
                )}
              </AnimatePresence>

              <table className="w-full border-separate border-spacing-0 rounded-3xl overflow-hidden border border-white/5 bg-[#030303]/40">
                {/* Table header */}
                <thead>
                  <tr>
                    {headers.map((h, i) => (
                      <th
                        key={i}
                        className="bg-[#080808] text-zinc-500 font-black p-5 text-left border-b border-white/5 text-[10px] uppercase tracking-[0.2em]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Animated scene rows */}
                <tbody>
                  <AnimatePresence initial={false}>
                    {sceneRows.slice(0, visibleCount).map((cells, rowIdx) => {
                      const sceneNum = Number(cells[0]);
                      const hasVisual = !isNaN(sceneNum) && !!visualData[sceneNum];
                      return (
                        <motion.tr
                          key={`scene-${rowIdx}`}
                          id={`scene-row-${sceneNum}`}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                          className="group hover:bg-white/[0.02]"
                        >
                          {cells.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className="p-6 border-b border-white/5 text-[13px] text-zinc-400 align-top leading-relaxed group-hover:text-zinc-200 transition-colors"
                            >
                              {/* Inject visual thumbnails in the visuals column */}
                              {headers[cellIdx]?.toLowerCase().includes('video prompt') ? (
                                <div className="space-y-1.5 min-w-[220px]">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest text-amber-400">
                                    <Video className="w-2.5 h-2.5" /> Video Prompt
                                  </span>
                                  <p className="font-mono text-[11px] text-zinc-500 bg-black/30 p-2.5 rounded-xl border border-white/5 group-hover:text-zinc-400 transition-colors leading-normal select-all">{cell}</p>
                                </div>
                              ) : headers[cellIdx]?.toLowerCase().includes('image prompt') ? (
                                <div className="space-y-1.5 min-w-[220px]">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">
                                    <Sparkles className="w-2.5 h-2.5" /> Image Prompt
                                  </span>
                                  <p className="font-mono text-[11px] text-zinc-500 bg-black/30 p-2.5 rounded-xl border border-white/5 group-hover:text-zinc-400 transition-colors leading-normal select-all">{cell}</p>
                                </div>
                              ) : cellIdx === SCENE_COL_INDEX && hasVisual ? (
                                <div className="space-y-3">
                                  <span>{cell}</span>
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-1 grid grid-cols-2 gap-1"
                                  >
                                    {Array.isArray(visualData[sceneNum]) ? (
                                      visualData[sceneNum].map((url, i) => (
                                        <img
                                          key={i}
                                          src={url}
                                          alt={`Scene ${sceneNum} V${i + 1}`}
                                          className="w-full h-full object-cover rounded-xl aspect-video"
                                          referrerPolicy="no-referrer"
                                        />
                                      ))
                                    ) : (
                                      <img
                                        src={visualData[sceneNum] as unknown as string}
                                        alt={`Scene ${sceneNum}`}
                                        className="w-full h-full object-cover rounded-xl aspect-video col-span-2"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                  </motion.div>
                                </div>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            /* Fallback: render raw markdown if no table detected */
            <div className="prose prose-invert max-w-none prose-table:border prose-table:border-white/5 prose-th:text-zinc-500 prose-td:text-zinc-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScript}</ReactMarkdown>
            </div>
          )}

          {/* Post-table content */}
          {after && (
            <div className="prose prose-invert max-w-none prose-h1:text-white prose-strong:text-blue-400 mt-12">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{after}</ReactMarkdown>
            </div>
          )}

          <div className="mt-24 pt-12 border-t border-white/5 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-black italic">
              End of Production Sequence
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={s.content.sidebar + " space-y-8"}>
           <div className={s.content.sidebarCard}>
              <div className={s.content.sidebarGlow + " bg-blue-500/5 group-hover:bg-blue-500/10"} />
              <div className={s.content.sidebarContent}>
                 <h4 className={s.content.sidebarTitle}>
                   <Zap className="w-3 h-3 text-blue-400" /> Script Analytics
                 </h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-zinc-600 uppercase">Scene Count</span>
                       <span className="text-xs font-black text-white">{sceneRows.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-zinc-600 uppercase">Est. Runtime</span>
                       <span className="text-xs font-black text-white">{sceneRows.length * 2.5}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-zinc-600 uppercase">Manifest Status</span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Sequenced</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h5 className={s.content.sidebarTitle}>
                <ScrollText className="w-3 h-3" /> Scene Navigator
              </h5>
              <div className="grid grid-cols-4 gap-2">
                 {sceneRows.map((cells, i) => {
                   const sceneNum = Number(cells[0]);
                   return (
                     <motion.button
                       key={i}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => scrollToScene(`scene-row-${sceneNum}`)}
                       className="aspect-square flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-lg hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
                     >
                        <span className="text-[10px] font-black text-zinc-600 group-hover:text-blue-400">{sceneNum}</span>
                     </motion.button>
                   );
                 })}
              </div>
           </div>

           <div className="p-6 bg-gradient-to-br from-blue-500/10 to-fuchsia-500/10 border border-white/5 rounded-[2rem] space-y-4">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <PlayCircle className="w-3 h-3 text-blue-400" /> Director's Note
              </h4>
              <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase">
                The script is ready for visual manifesting. Ensure all character arcs are verified before locking the storyboard.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
};



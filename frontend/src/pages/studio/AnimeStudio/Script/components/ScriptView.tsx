import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, Hash, Users, Film } from 'lucide-react';
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

const COLUMN_WIDTHS = ['w-12', 'w-24', 'w-36', 'flex-1', 'w-48', 'w-28', 'w-16'];
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

  // Fallback: render raw markdown if we couldn't parse a table
  const hasTable = sceneRows.length > 0 && headers.length > 0;

  return (
    <div className="space-y-12">
      {/* Header block */}
      <div className="border-b border-zinc-800/80 pb-6 mb-8 text-center space-y-4 relative">
        <div className="inline-block px-3 py-1 bg-zinc-800/20 border border-zinc-800/50 rounded-full text-xs uppercase tracking-[0.3em] text-zinc-400 font-bold mb-4 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          Official Anime Script
        </div>
        <h1 className="text-4xl font-black text-cyan-50 leading-tight uppercase tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          {prompt?.split(' ').slice(0, 5).join(' ') || 'Untitled Sequence'}
        </h1>
        <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-zinc-400 font-bold">
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-cyan-500/20">
            <Clapperboard className="w-3 h-3 text-cyan-400" /> Session {session}
          </span>
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-fuchsia-500/20">
            <Hash className="w-3 h-3 text-fuchsia-400" /> Episode {episode}
          </span>
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-teal-500/20">
            <Users className="w-3 h-3 text-teal-400" /> {audience}
          </span>
        </div>
      </div>

      {/* Pre-table content (intro, chapter headers etc.) */}
      {before && (
        <div className="prose prose-invert max-w-none prose-h1:text-cyan-100 prose-h2:text-cyan-200 prose-h3:text-cyan-300 prose-strong:text-cyan-400">
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
                className="flex items-center gap-2 mb-4 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full w-fit text-xs font-black uppercase tracking-widest text-cyan-400"
              >
                <Film className="w-3 h-3 animate-pulse" />
                Sequencing Scene {visibleCount} / {sceneRows.length}
              </motion.div>
            )}
          </AnimatePresence>

          <table className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            {/* Table header */}
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="bg-[#0a0a0a] text-cyan-400 font-black p-4 text-left border-b border-cyan-500/30 text-xs uppercase tracking-[0.2em] font-sans"
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
                      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="group hover:[&>td]:bg-cyan-900/10 hover:[&>td]:text-cyan-50"
                    >
                      {cells.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="p-5 border-b border-zinc-800/50 text-[13px] text-zinc-300 align-top leading-relaxed font-sans bg-[#050505]/50 transition-colors duration-200"
                        >
                          {/* Inject visual thumbnails in the visuals column */}
                          {cellIdx === SCENE_COL_INDEX && hasVisual ? (
                            <div className="space-y-3">
                              <span>{cell}</span>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] bg-black/40 p-1 grid grid-cols-2 gap-1"
                              >
                                {Array.isArray(visualData[sceneNum]) ? (
                                  visualData[sceneNum].map((url, i) => (
                                    <img
                                      key={i}
                                      src={url}
                                      alt={`Scene ${sceneNum} V${i + 1}`}
                                      className="w-full h-full object-cover rounded-md aspect-video"
                                      referrerPolicy="no-referrer"
                                    />
                                  ))
                                ) : (
                                  <img
                                    src={visualData[sceneNum] as unknown as string}
                                    alt={`Scene ${sceneNum}`}
                                    className="w-full h-full object-cover rounded-md aspect-video col-span-2"
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
        <div className="prose prose-invert max-w-none prose-table:border prose-table:border-cyan-500/20 prose-th:text-cyan-400 prose-td:text-zinc-300 overflow-x-auto no-scrollbar">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScript}</ReactMarkdown>
        </div>
      )}

      {/* Post-table content */}
      {after && (
        <div className="prose prose-invert max-w-none prose-h1:text-cyan-100 prose-strong:text-cyan-400 mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{after}</ReactMarkdown>
        </div>
      )}

      <div className="mt-24 pt-12 border-t border-zinc-800/50 text-center">
        <p className="text-xs text-zinc-500/50 uppercase tracking-[0.5em] font-bold">
          End of Sequence
        </p>
      </div>
    </div>
  );
};



import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Clapperboard, Hash, Users } from 'lucide-react';

interface ScriptViewProps {
  generatedScript: string;
  prompt: string;
  session: string;
  episode: string;
  audience: string;
  visualData?: Record<number, string[]>;
}

export const ScriptView: React.FC<ScriptViewProps> = ({
  generatedScript,
  prompt,
  session,
  episode,
  audience,
  visualData = {}
}) => {
  // Custom components for ReactMarkdown to inject visuals
  const components = {
    td: ({ node, children, ...props }: any) => {
      // Logic to detect if this is a scene row and if it's the visuals column
      // We can look at the row index and cell index if the table is standard
      // But ReactMarkdown doesn't easily provide indices in simple td props
      // A better way is to check the content.
      return <td {...props}>{children}</td>;
    },
    tr: ({ node, children, ...props }: any) => {
      // Find the scene number in the first cell
      const cells = React.Children.toArray(children);
      const firstCell: any = cells[0];
      const sceneNumText = firstCell?.props?.children?.[0];
      const sceneNum = parseInt(sceneNumText);

      if (!isNaN(sceneNum) && visualData[sceneNum]) {
        return (
          <tr {...props}>
            {React.Children.map(children, (child: any, idx) => {
              // Assuming column 4 is Visuals (0: Scene, 1: Section, 2: Character, 3: Voiceover, 4: Visuals)
              if (idx === 4) {
                return (
                  <td {...child.props}>
                    <div className="space-y-4">
                      {child.props.children}
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
                              alt={`Scene ${sceneNum} Variation ${i+1}`} 
                              className="w-full h-full object-cover rounded-md aspect-video"
                              referrerPolicy="no-referrer"
                            />
                          ))
                        ) : (
                          <img 
                            src={visualData[sceneNum] as unknown as string} 
                            alt={`Scene ${sceneNum} Visual`} 
                            className="w-full h-full object-cover rounded-md aspect-video col-span-2"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </motion.div>
                    </div>
                  </td>
                );
              }
              return child;
            })}
          </tr>
        );
      }
      return <tr {...props}>{children}</tr>;
    }
  };

  return (
    <div className="space-y-12">
      <div className="border-b border-zinc-800/80 pb-6 mb-8 text-center space-y-4 relative">
        <div className="inline-block px-3 py-1 bg-zinc-800/20 border border-zinc-800/50 rounded-full text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-4 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          Official Anime Script
        </div>
        <h1 className="text-4xl font-black text-cyan-50 leading-tight uppercase tracking-tight drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          {prompt?.split(' ').slice(0, 5).join(' ') || "Untitled Sequence"}
        </h1>
        <div className="flex items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-cyan-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <Clapperboard className="w-3 h-3 text-cyan-400" />
            Session {session}
          </span>
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-fuchsia-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <Hash className="w-3 h-3 text-fuchsia-400" />
            Episode {episode}
          </span>
          <span className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-md border border-teal-500/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <Users className="w-3 h-3 text-teal-400" />
            {audience}
          </span>
        </div>
      </div>

      <div className="prose prose-invert max-w-none 
        prose-table:border-separate prose-table:border-spacing-0 prose-table:shadow-[0_0_30px_rgba(0,0,0,0.8)] prose-table:rounded-xl prose-table:overflow-hidden prose-table:border prose-table:border-cyan-500/20
        prose-th:bg-[#0a0a0a] prose-th:text-cyan-400 prose-th:font-black prose-th:p-4 prose-th:text-left prose-th:border-b prose-th:border-cyan-500/30 prose-th:text-[10px] prose-th:uppercase prose-th:tracking-[0.2em] prose-th:font-sans
        prose-td:p-5 prose-td:border-b prose-td:border-zinc-800/50 prose-td:text-[13px] prose-td:text-zinc-300 prose-td:align-top prose-td:leading-relaxed prose-td:font-sans prose-td:bg-[#050505]/50
        prose-tr:hover:td:bg-cyan-900/10 prose-tr:hover:td:text-cyan-50
        prose-h1:font-sans prose-h1:font-black prose-h1:tracking-tight prose-h1:text-cyan-100 prose-h1:uppercase
        prose-h2:font-sans prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-cyan-200 prose-h2:uppercase
        prose-h3:font-sans prose-h3:font-bold prose-h3:tracking-tight prose-h3:text-cyan-300 prose-h3:uppercase
        prose-strong:text-cyan-400 prose-strong:font-bold prose-strong:tracking-wide
        overflow-x-auto no-scrollbar"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{generatedScript}</ReactMarkdown>
      </div>

      <div className="mt-24 pt-12 border-t border-zinc-800/50 text-center">
        <p className="text-[10px] text-zinc-500/50 uppercase tracking-[0.5em] font-bold">
          End of Sequence
        </p>
      </div>
    </div>
  );
};




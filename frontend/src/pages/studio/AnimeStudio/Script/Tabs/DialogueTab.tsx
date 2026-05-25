import React from 'react';
import { MessageSquare, User, Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseScriptTable, getDialogueMatrix } from '../scriptUtils';

interface DialogueTabProps {
  generatedScript: string | null;
}

export const DialogueTab: React.FC<DialogueTabProps> = ({ generatedScript }) => {
  const { characters, sampleLines } = React.useMemo(() => {
    const parsed = parseScriptTable(generatedScript);
    const matrix = getDialogueMatrix(parsed);
    
    if (matrix.length === 0) {
      return {
        characters: [
          { name: 'No Speakers Detected', lines: 0, tone: 'N/A', color: 'studio' }
        ],
        sampleLines: []
      };
    }
    
    const colors = ['studio', 'rose', 'emerald', 'amber', 'purple', 'cyan'];
    const mappedChars = matrix.map((c, i) => ({
      name: c.name,
      lines: c.lines,
      tone: c.tone,
      color: colors[i % colors.length]
    }));
    
    const mappedLines = matrix
      .filter(c => c.featuredLine && c.featuredLine !== '""' && c.featuredLine !== '"..."')
      .map(c => ({
        char: c.name,
        line: c.featuredLine,
        scene: String(c.sceneNum)
      }));
      
    return {
      characters: mappedChars,
      sampleLines: mappedLines
    };
  }, [generatedScript]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 space-y-12"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          >
            <MessageSquare className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Dialogue Matrix</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Character voice profiles and line distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
            {characters.length} Active Speakers
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {characters.map((char, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 90 }}
            className="p-8 bg-gradient-to-b from-[#0e0e0e] to-[#040404] border border-white/5 rounded-[2rem] space-y-4 hover:border-emerald-500/30 hover:shadow-[0_0_35px_rgba(16,185,129,0.03)] transition-all duration-500 group text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:border-emerald-500/20 transition-all duration-500">
              <User className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{char.name}</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">{char.tone}</p>
            </div>
            <div className="pt-2">
              <span className="text-4xl font-black text-white font-mono leading-none">{char.lines}</span>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Total Lines</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2.5">
          <Quote className="w-4 h-4 text-emerald-400" /> Featured Dialogue Clips
        </h3>
        
        {sampleLines.length === 0 ? (
          <p className="text-xs text-zinc-500 font-black uppercase tracking-widest text-center py-6">No speaker quotes extracted.</p>
        ) : (
          sampleLines.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
              className="p-6 bg-gradient-to-r from-[#0c0c0c] to-[#030303] border border-white/5 rounded-2xl space-y-3 hover:border-emerald-500/20 hover:bg-white/[0.02] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400/90 uppercase tracking-widest">{item.char}</span>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-wider font-mono">Scene #{item.scene}</span>
              </div>
              <p className="text-zinc-300 text-sm font-medium italic leading-relaxed pl-3 border-l-2 border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                {item.line}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

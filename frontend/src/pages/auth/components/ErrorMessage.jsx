import React from 'react';
import { motion } from 'framer-motion';

export function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
    >
      <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
      {error}
    </motion.div>
  );
}

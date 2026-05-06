import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { UI_PROMPT_SUGGESTIONS } from '@/services/prompts';

interface OmniPromptProps {
  value?: string;
  onChange?: (value: string) => void;
  onExecute?: (prompt: string) => void;
  onChipClick?: (prompt: string) => void;
  className?: string;
  placeholder?: string;
}

export const OmniPrompt: React.FC<OmniPromptProps> = ({ 
  value: controlledValue,
  onChange,
  onExecute, 
  onChipClick,
  className,
  placeholder = "Describe your vision, or choose a starting point below..."
}) => {
  const [localValue, setLocalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Use controlled value if provided, otherwise fallback to local state
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : localValue;
  const setValue = (val: string) => {
    if (isControlled) {
      onChange?.(val);
    } else {
      setLocalValue(val);
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      onExecute?.(value);
    }
  };

  const handleChipClick = (label: string) => {
    setValue(label);
    onChipClick?.(label);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-4", className)}>
      {/* MAIN INPUT CONTAINER */}
      <div 
        className={cn(
          "relative flex items-center transition-all duration-500 rounded-[2.5rem] p-2 pr-3 bg-zinc-950 border-2",
          isFocused 
            ? "border-cyan-500 ring-4 ring-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]" 
            : "border-zinc-800"
        )}
      >
        <textarea
          rows={1}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-cyan-50 placeholder:text-zinc-700 p-4 text-sm font-medium resize-none hide-scrollbar min-h-[56px] flex items-center pt-5"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* ACTION BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg",
            value.trim() 
              ? "bg-cyan-500 text-[#050505] shadow-cyan-500/40" 
              : "bg-zinc-800 text-zinc-600"
          )}
        >
          <Sparkles className="w-5 h-5 fill-current" />
        </motion.button>
      </div>

      {/* SUGGESTION CHIPS */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {UI_PROMPT_SUGGESTIONS.map((chip, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleChipClick(chip.label)}
            className={cn(
              "px-4 py-2 rounded-full bg-zinc-950 border text-[10px] font-black uppercase tracking-[0.1em] transition-all group",
              chip.border,
              chip.color,
              "hover:bg-cyan-500/5 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:text-cyan-400"
            )}
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
              {chip.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};





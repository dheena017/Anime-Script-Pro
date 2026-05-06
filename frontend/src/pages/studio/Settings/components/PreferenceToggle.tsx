import React from 'react';
import { motion } from 'framer-motion';

interface PreferenceToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const PreferenceToggle: React.FC<PreferenceToggleProps> = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <div className="font-medium text-white/90">{label}</div>
        {description && <div className="text-sm text-white/50 mt-1">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-white/10'}`}
      >
        <motion.div
          layout
          initial={false}
          animate={{ x: checked ? 24 : 2 }}
          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
};

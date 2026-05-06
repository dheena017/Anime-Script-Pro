import React from 'react';

export function Checkbox({ id, name, label, checked, onChange }) {
  return (
    <div className="flex items-center gap-3 ml-1 py-1">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded-md border border-zinc-800 bg-zinc-900/50 text-studio focus:ring-1 focus:ring-studio focus:ring-offset-0 appearance-none checked:bg-studio checked:border-studio relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-xs checked:after:left-[3px] checked:after:-top-[1px] cursor-pointer transition-colors"
      />
      <label htmlFor={id} className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black cursor-pointer hover:text-zinc-400 transition-colors">
        {label}
      </label>
    </div>
  );
}

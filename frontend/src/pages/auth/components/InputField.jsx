import React from 'react';
import { Input } from "@/components/ui/input";

export function InputField({ id, name, type = "text", placeholder, value, onChange, required, autoComplete, icon: Icon }) {
  return (
    <div className="relative group">
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="h-12 bg-zinc-900/50 border-zinc-800/80 focus:border-studio/50 focus:ring-0 transition-all rounded-xl pl-10 text-zinc-200 placeholder:text-zinc-700 font-medium text-sm"
      />
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-studio transition-colors" />}
    </div>
  );
}

import React from 'react';

interface ConfigSectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const ConfigSectionCard: React.FC<ConfigSectionCardProps> = ({ title, description, children }) => {
  return (
    <div className="mb-8 p-6 bg-black/20 border border-white/10 rounded-2xl">
      <h2 className="text-lg font-bold text-white mb-1">{title}</h2>
      {description && <p className="text-sm text-white/50 mb-6">{description}</p>}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

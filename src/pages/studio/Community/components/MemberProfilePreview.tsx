import React from 'react';
import { UserCircle } from 'lucide-react';

export const MemberProfilePreview: React.FC<{ username: string, role: string }> = ({ username, role }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
      <UserCircle className="w-10 h-10 text-white/30" />
      <div>
        <div className="text-sm font-bold text-white/90">@{username}</div>
        <div className="text-xs text-orange-400/80">{role}</div>
      </div>
    </div>
  );
};

import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface Snapshot {
  id: string;
  name: string;
  script: string;
  createdAt: string;
}

interface SnapshotManagerProps {
  snapshots: Snapshot[];
  onRestore: (id: string) => void;
}

export function SnapshotManager({ snapshots, onRestore }: SnapshotManagerProps) {
  return (
    <div className="rounded-xl border border-zinc-800/70 bg-black/30 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">Snapshots / Rollback</p>
        <p className="text-[10px] text-zinc-600">{snapshots.length} saved</p>
      </div>
      {snapshots.length === 0 ? (
        <p className="text-xs text-zinc-600">No snapshots yet. Save one before major rewrites.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {snapshots.slice(0, 8).map((snapshot) => (
            <Button
              key={snapshot.id}
              variant="outline"
              size="sm"
              className="h-8 border-zinc-700/70 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800"
              onClick={() => onRestore(snapshot.id)}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              {snapshot.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

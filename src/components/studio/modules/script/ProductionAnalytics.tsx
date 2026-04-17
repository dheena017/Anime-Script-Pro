import { Users, BarChart3, Activity, Mic } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const NEURAL_VOICES = [
  { id: 'v1', name: 'Pro Hero (Bold)', pitch: 1, rate: 1 },
  { id: 'v2', name: 'Dark Antagonist', pitch: 0.7, rate: 0.9 },
  { id: 'v3', name: 'Youthful Protagonist', pitch: 1.2, rate: 1.1 },
  { id: 'v4', name: 'Wise Sensei', pitch: 0.8, rate: 0.8 },
  { id: 'v5', name: 'Cybernetic AI', pitch: 1, rate: 1.5 },
];

interface CharacterStat {
  name: string;
  count: number;
}

interface ProductionAnalyticsProps {
  characterStats: CharacterStat[];
  sentimentMap: string[]; // SentimentTone[]
  totalLines: number;
  characterVoices: Record<string, string>;
  onAssignVoice: (char: string, voiceId: string) => void;
}

export function ProductionAnalytics({
  characterStats,
  sentimentMap,
  totalLines,
  characterVoices,
  onAssignVoice,
}: ProductionAnalyticsProps) {
  const maxLines = characterStats.length > 0 ? characterStats[0].count : 1;

  const sentimentStats = {
    action: sentimentMap.filter(t => t === 'action').length,
    sad: sentimentMap.filter(t => t === 'sad').length,
    comedy: sentimentMap.filter(t => t === 'comedy').length,
  };

  const totalFlagged = sentimentStats.action + sentimentStats.sad + sentimentStats.comedy || 1;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-red-500" /> Casting Balance
        </h3>
        <div className="space-y-3 bg-black/20 rounded-xl p-4 border border-white/5">
          {characterStats.length === 0 ? (
            <p className="text-[10px] text-zinc-600 italic">No dialogue detected yet.</p>
          ) : (
            characterStats.slice(0, 5).map((char) => (
              <div key={char.name} className="space-y-2 pb-2 border-b border-white/5 last:border-0">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-zinc-300 uppercase truncate max-w-[120px]">{char.name}</span>
                    <span className="font-mono text-zinc-600 text-[8px]">{char.count} lines</span>
                  </div>
                  <Select 
                    value={characterVoices[char.name] || 'v1'} 
                    onValueChange={(val) => onAssignVoice(char.name, val)}
                  >
                    <SelectTrigger className="h-7 w-[100px] bg-zinc-950 border-zinc-800 text-[8px] font-bold uppercase tracking-tighter">
                      <SelectValue placeholder="Cast Voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800 text-[9px]">
                      {NEURAL_VOICES.map(v => (
                        <SelectItem key={v.id} value={v.id} className="text-[9px] uppercase font-bold">{v.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Progress value={(char.count / maxLines) * 100} className="h-1 bg-zinc-800" indicatorClassName="bg-red-500" />
              </div>
            ))
          )}
          {characterStats.length > 5 && (
            <p className="text-[9px] text-zinc-700 text-center font-bold uppercase tracking-widest pt-1">
              + {characterStats.length - 5} more characters
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-red-500" /> Emotional Rhythm
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
            <p className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Action</p>
            <p className="text-sm font-black text-zinc-300">{Math.round((sentimentStats.action / totalLines) * 100)}%</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Melancholy</p>
            <p className="text-sm font-black text-zinc-300">{Math.round((sentimentStats.sad / totalLines) * 100)}%</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center">
            <p className="text-[8px] font-black text-yellow-500 uppercase tracking-tighter">Comedy</p>
            <p className="text-sm font-black text-zinc-300">{Math.round((sentimentStats.comedy / totalLines) * 100)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

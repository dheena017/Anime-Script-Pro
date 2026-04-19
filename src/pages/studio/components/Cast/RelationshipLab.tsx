import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ArrowRight, 
  Trash2, 
  Users, 
  Heart, 
  Swords, 
  Shield, 
  Zap, 
  Crown,
  Lock,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useGenerator } from '@/contexts/GeneratorContext';

interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'Ally' | 'Rival' | 'Enemy' | 'Love' | 'Secret' | 'Master/Apprentice';
  tension: number; // 1-10
  description: string;
}

export function RelationshipLab() {
  const { characterRelationships, setCharacterRelationships } = useGenerator();
  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [newConn, setNewConn] = React.useState<Partial<Connection>>({ type: 'Ally', tension: 5 });

  // Initial parse of the text-based relationships if they exist
  React.useEffect(() => {
    if (characterRelationships && connections.length === 0) {
      // Very loose parsing for now, or just setting a default
    }
  }, [characterRelationships]);

  const addConnection = () => {
    if (!newConn.source || !newConn.target) return;
    const conn: Connection = {
      id: Math.random().toString(36).substr(2, 9),
      source: newConn.source,
      target: newConn.target,
      type: newConn.type as any,
      tension: newConn.tension || 5,
      description: newConn.description || '',
    };
    const updated = [...connections, conn];
    setConnections(updated);
    setNewConn({ type: 'Ally', tension: 5 });
    
    // Sync back to global context as a descriptive string the AI can read
    const syncString = updated.map(c => 
      `${c.source} & ${c.target}: ${c.type} (Tension: ${c.tension}/10) - ${c.description}`
    ).join('\n');
    setCharacterRelationships(syncString);
  };

  const removeConnection = (id: string) => {
    const updated = connections.filter(c => c.id !== id);
    setConnections(updated);
    const syncString = updated.map(c => 
      `${c.source} & ${c.target}: ${c.type} (Tension: ${c.tension}/10) - ${c.description}`
    ).join('\n');
    setCharacterRelationships(syncString);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Ally': return <Shield className="w-4 h-4 text-emerald-500" />;
      case 'Rival': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'Enemy': return <Swords className="w-4 h-4 text-red-500" />;
      case 'Love': return <Heart className="w-4 h-4 text-fuchsia-500" />;
      case 'Secret': return <Lock className="w-4 h-4 text-zinc-500" />;
      default: return <Users className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-block px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full text-[10px] uppercase tracking-[0.3em] text-fuchsia-400 font-bold shadow-[0_0_15px_rgba(217,70,239,0.2)]">
          Social Architecture Matrix
        </div>
        <h1 className="text-5xl font-black text-cyan-50 leading-tight uppercase tracking-tighter">
          Relationship <span className="text-fuchsia-600">Lab</span>
        </h1>
        <p className="text-zinc-500 italic max-w-lg mx-auto font-medium">
          Engineering the emotional friction and tactical alliances that drive your plot.
        </p>
      </div>

      <Card className="bg-[#0a0a0a]/80 border-fuchsia-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
          <Users className="w-32 h-32 text-fuchsia-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Member A</label>
              <Input 
                placeholder="e.g., Kael"
                value={newConn.source || ''}
                onChange={e => setNewConn({...newConn, source: e.target.value})}
                className="bg-zinc-950/50 border-zinc-800 rounded-xl h-12 text-zinc-100 focus:border-fuchsia-500/50 transition-all"
              />
           </div>
           <div className="flex justify-center mb-3">
              <ArrowRight className="text-zinc-800" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Member B</label>
              <Input 
                placeholder="e.g., Elara"
                value={newConn.target || ''}
                onChange={e => setNewConn({...newConn, target: e.target.value})}
                className="bg-zinc-950/50 border-zinc-800 rounded-xl h-12 text-zinc-100 focus:border-fuchsia-500/50 transition-all"
              />
           </div>
           <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Visual Dynamics / Secret</label>
              <Input 
                placeholder="e.g., Secretly jealous of their power..."
                value={newConn.description || ''}
                onChange={e => setNewConn({...newConn, description: e.target.value})}
                className="bg-zinc-950/50 border-zinc-800 rounded-xl h-12 text-zinc-100 focus:border-fuchsia-500/50 transition-all"
              />
           </div>
           <div className="flex gap-2">
              {['Ally', 'Rival', 'Enemy', 'Love', 'Secret'].map(type => (
                <button 
                  key={type}
                  onClick={() => setNewConn({...newConn, type: type as any})}
                  className={cn(
                    "flex-1 h-12 rounded-xl flex items-center justify-center border transition-all",
                    newConn.type === type 
                      ? "bg-fuchsia-600/20 border-fuchsia-500/50 text-fuchsia-400" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700"
                  )}
                >
                  {getTypeIcon(type)}
                </button>
              ))}
           </div>
           <div className="md:col-span-3">
              <Button 
                onClick={addConnection}
                className="w-full h-14 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black tracking-widest rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all"
              >
                <Plus className="w-5 h-5 mr-3" /> REGISTER CONNECTION
              </Button>
           </div>
        </div>

        <div className="space-y-4">
           {connections.map((conn) => (
             <motion.div 
               layout
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               key={conn.id}
               className="flex items-center justify-between p-6 bg-zinc-950/50 border border-zinc-900 rounded-[1.5rem] group hover:border-fuchsia-500/30 transition-all"
             >
                <div className="flex items-center gap-8">
                   <div className="flex items-center gap-4">
                      <div className="text-lg font-black text-white uppercase tracking-tighter">{conn.source}</div>
                      <div className="flex flex-col items-center gap-1 opacity-20">
                         <div className="h-0.5 w-8 bg-zinc-500" />
                         {getTypeIcon(conn.type)}
                         <div className="h-0.5 w-8 bg-zinc-500" />
                      </div>
                      <div className="text-lg font-black text-white uppercase tracking-tighter">{conn.target}</div>
                   </div>

                   <div className="h-10 w-[1px] bg-zinc-800 hidden md:block" />

                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded", {
                            'bg-emerald-500/10 text-emerald-500': conn.type === 'Ally',
                            'bg-orange-500/10 text-orange-500': conn.type === 'Rival',
                            'bg-red-500/10 text-red-500': conn.type === 'Enemy',
                            'bg-fuchsia-500/10 text-fuchsia-500': conn.type === 'Love',
                            'bg-zinc-800 text-zinc-400': conn.type === 'Secret',
                         })}>
                           {conn.type}
                         </span>
                         <div className="flex gap-0.5">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className={cn("w-1.5 h-3 rounded-sm", i < conn.tension ? "bg-fuchsia-500/40" : "bg-zinc-800")} />
                            ))}
                         </div>
                      </div>
                      <p className="text-xs text-zinc-500 font-medium italic">"{conn.description}"</p>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <Button variant="ghost" size="icon" className="hover:bg-zinc-900 text-zinc-600 hover:text-cyan-400">
                      <MessageSquare className="w-4 h-4" />
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="hover:bg-red-500/10 text-zinc-600 hover:text-red-500"
                     onClick={() => removeConnection(conn.id)}
                   >
                      <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
             </motion.div>
           ))}

           {connections.length === 0 && (
             <div className="p-12 text-center border-2 border-dashed border-zinc-900 rounded-[2rem] opacity-20 group hover:opacity-100 transition-opacity">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600">No active social threads found</p>
             </div>
           )}
        </div>
      </Card>
    </div>
  );
}

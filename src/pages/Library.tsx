import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Download, 
  Trash2,
  FileText,
  Clock,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function LibraryPage() {
  const [user] = useAuthState(auth);
  const [scripts, setScripts] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'scripts'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setScripts(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this script?')) {
      try {
        await deleteDoc(doc(db, 'scripts', id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const filteredScripts = scripts.filter(s => 
    s.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.script?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <History className="w-16 h-16 text-zinc-800 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to view your library</h2>
        <p className="text-zinc-500 max-w-md">
          Your saved scripts and production history will appear here once you're logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Library</h1>
          <p className="text-zinc-500">Manage and organize your generated anime scripts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Search scripts..." 
              className="pl-10 bg-zinc-900/50 border-zinc-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredScripts.map((script, idx) => (
          <motion.div
            key={script.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-red-500/30 transition-all group overflow-hidden h-full flex flex-col">
              <div className="aspect-video bg-zinc-950 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${script.id}/600/400`} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded border border-red-500/20">
                      {script.tone || 'Action'}
                    </span>
                    {(script.session || script.episode) && (
                      <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-700">
                        {script.session && `S${script.session}`} {script.episode && `E${script.episode}`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                    <Clock className="w-3 h-3" />
                    5:00
                  </div>
                </div>
              </div>
              
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-lg line-clamp-1 group-hover:text-red-500 transition-colors">
                  {script.prompt?.slice(0, 40) || 'Untitled Script'}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                  <Calendar className="w-3 h-3" />
                  {script.createdAt instanceof Timestamp ? script.createdAt.toDate().toLocaleDateString() : 'Recent'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                <p className="text-xs text-zinc-500 line-clamp-3 mb-6 leading-relaxed">
                  {script.script?.replace(/[#|*-]/g, '').slice(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-zinc-400 hover:text-white"
                      onClick={() => navigate('/', { state: { scriptId: script.id, script: script.script } })}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-zinc-400 hover:text-red-500"
                    onClick={() => handleDelete(script.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredScripts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <FileText className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500">No scripts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
